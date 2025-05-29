'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {APPWRITE_DATABASE_ID:DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID:USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID:BANK_COLLECTION_ID
} = process.env

//get user from database
export const getUserInfo = async ({userId}:getUserInfoProps) => {
   try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return parseStringify(user.documents[0]);
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
      return parseStringify(user);
    } catch (error) {
        console.error("Error", error)
    }
}

export const signUp = async ({password,...userData}: SignUpParams) => {
  let newUserAccount; 

  try {
         const { account, database } = await createAdminClient();
         const {email, firstName,lastName} = userData

         
  newUserAccount = await account.create(
  ID.unique(), email, password, `${firstName} ${lastName}`
);

if(!newUserAccount) throw new Error('Error creating user account')
 
 const dwollaCustomerUrl = await createDwollaCustomer({
  ...userData,
  type:'personal'
 })

 if(!dwollaCustomerUrl) throw new Error('Error creating dwolla customer')
 const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
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
 
 const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return parseStringify(newUser)
    } catch (error) {
        console.error("Error", error)
    }
}

// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result =  await account.get();

    const user = await getUserInfo({userId: result.$id})
    return parseStringify(user)
  } catch (error) {
    return null;
  }
}

export const logoutAccount = async () => {
    try{
        const { account } = await createSessionClient();
        (await cookies()).delete("appwrite-session")
        await account.deleteSession("current");
    } catch (error) {
        return null;
    }
}

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
      return parseStringify({linkToken: response.data.link_token})
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
    return parseStringify(response);
  } catch (error) {
    console.error("Error", error);
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
      return parseStringify({
       publicTokenExchange: 'complete',
      });
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
    return parseStringify(banks.documents);
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
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
  }
}

export const getBankAccountId= async ({accountId}: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();
    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    );
    if(bank.total !== 1) return null;
    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.error("Error", error);
  }
}
//atomic functions is a function that either works or fails