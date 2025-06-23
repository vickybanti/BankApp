'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"
import { createBankAccountProps, exchangePublicTokenProps, getBankByAccountIdProps, getBankProps, getBanksProps, getUserInfoProps, signInProps, SignUpParams, User } from "@/types"

const {APPWRITE_DATABASE_ID:DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID:USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID:BANK_COLLECTION_ID
} = process.env

interface DwollaEmbeddedError {
  message?: string;
}

interface DwollaError {
  message?: string;
  _embedded?: {
    errors?: DwollaEmbeddedError[];
  };
}


//get user from database
export const getUserInfo = async ({userId}:getUserInfoProps) => {
   try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return JSON.parse(JSON.stringify(user.documents[0]));
  } catch (error) {
    console.error("Error", error);
  }
}

export const signIn = async ({email, password}:signInProps) => {
    try {
          const { account } = await createAdminClient();
          const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
          const user = await getUserInfo({ userId:session.userId})
      return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error", error)
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  try {
    const { account, database } = await createAdminClient();
    const { email, firstName, lastName } = userData;

    // Step 1: Create Appwrite Account
    let newUserAccount;
    try {
      newUserAccount = await account.create(
        ID.unique(),
        email,
        password,
        `${firstName} ${lastName}`
      );
    } catch (appwriteError: unknown) {
      if (appwriteError instanceof Error) {
        if ("code" in appwriteError && appwriteError.code === 409) {
          throw new Error("Email already exists. Please use a different email address.");
        }
        
        throw new Error(appwriteError.message || "Error creating user account.");
      }
      throw new Error("Unknown error occurred.");
    }
    

    // Step 2: Create Dwolla Customer
    let dwollaCustomerUrl: string | null = null;
    try {
      dwollaCustomerUrl = await createDwollaCustomer({
        ...userData,
        type: "personal",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error", error);
        throw error;
      } else {
        throw new Error("An unknown error occurred.");
      }
    
    
}




    // if (!dwollaCustomerUrl) {
    //   throw new Error("Dwolla customer creation failed.");
    // }

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl!);

    // Step 3: Create User Document in Appwrite DB
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        dwollaCustomerId,
        dwollaCustomerUrl,
        userId: newUserAccount.$id,
      }
    );

    // Step 4: Create Session
    const session = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (dwollaError: unknown) {
    // ONLY RETURN THE RAW ERROR MESSAGE
    let dwollaMessage = "Error creating Dwolla customer.";
  
    try {
      // Parse if the error is a stringified JSON
      const parsedError:DwollaError  =
      typeof dwollaError === "string" ? JSON.parse(dwollaError) : dwollaError as DwollaError;
  
      const embeddedErrors = parsedError._embedded?.errors;
  
      if (Array.isArray(embeddedErrors) && embeddedErrors.length > 0) {
        dwollaMessage = embeddedErrors[0]?.message || parsedError.message || dwollaMessage;
      } else if (parsedError.message) {
        dwollaMessage = parsedError.message;
      }
      
    } catch {
      // Fallback in case parsing fails
      if (dwollaError instanceof Error) {
        dwollaMessage = dwollaError.message;
      } else if (typeof dwollaError === "object" && dwollaError !== null && "message" in dwollaError) {
        dwollaMessage = String((dwollaError as { message?: string }).message);
      }
    }
  
    throw new Error(dwollaMessage);
  }
  
};

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id})

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error)
    return null;
  }
}


export const logoutAccount = async () => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      throw new Error("No session client found.");
    }

    const { account } = sessionClient;

    // Delete the session cookie
    (await cookies()).delete("appwrite-session");

    // Log out from Appwrite
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createLinkToken = async (user: User) => {
    try {
      const tokenParams = {
        user: {
          client_user_id: user.$id,
        },
        client_name: `${user.firstName} ${user.lastName}`,
        products: ["auth","transactions","identity"] as Products[],
        country_codes: ["US"] as CountryCode[],
        language: 'en'
      }
      const response = await plaidClient.linkTokenCreate(tokenParams)
      return JSON.parse(JSON.stringify({linkToken: response.data.link_token}))
    } catch (error) {
        console.error("Error", error)
    }}
//exchange token helps to exgange the public token for an access token to do lots of stuff (link accounts, get transactions, etc)
//1. create a link token
//2. use the link token to create a plaid link on Plain link by triggering flow to connectiong to bank accounjt to application through plaid link
//3. use the public token to exchange for an access token 
// //4. use the access token to get bank account information
// 5. Processor
//5

export const createBankAccount = async (
  {
        userId,
        bankId,
       accountId,
     accessToken,
fundingSourceUrl,
      sharableId,
}:createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();
    const response = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        sharableId
      }
    );
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error("Error", error);
    throw new Error((error instanceof Error ? error.message : "Something went wrong."))

  }
}

export const exchangePublicToken = async ({publicToken, user}: exchangePublicTokenProps) => {
  try {
    // exchange the public token for an access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // //4. use the access token to get bank account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    // const accountId = accountData[0].account_id;

    //&. use dwolla to process the payment using the accountID

    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum};

      const processTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processTokenResponse.data.processor_token;
      
      //Create a funding source URL for the account using the Dwolla customer ID, processor Token and bank name
      const fundingSourceUrl = await addFundingSource({
        processorToken,
        dwollaCustomerId: user.dwollaCustomerId,
        bankName: accountData.name,
      })

      if(!fundingSourceUrl) {
        throw new Error('Error creating funding source URL');
      }

      // Create a bank account in your database
      // using the access token, item ID, and account ID

      await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        sharableId: encryptId(accountData.account_id),
      });

      revalidatePath('/');
      return JSON.parse(JSON.stringify({
       publicTokenExchange: 'complete',
      }));
    } catch (error) {
    console.error("Error", error)
  }
} 
export const getBanks= async ({userId}: getBanksProps) => {
  try {
    const { database } = await createAdminClient();
    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return JSON.parse(JSON.stringify(banks.documents));
  } catch (error) {
    console.error("Error", error);
  }
}

export const getBank= async ({documentId}: getBankProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    );
    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.error("Error", error);
  }
}

export const getBankByAccountId= async ({accountId}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );
    if(bank.total !== 1) return null;
    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.error("Error", error);
  }
}
//atomic functions is a function that either works or fails
