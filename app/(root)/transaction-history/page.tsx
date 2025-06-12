import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'


type SearchParamProps = {
  searchParams:  Promise<{
    id: string;
    page: string;
  }>;
};


const TransactionHistory = async ({searchParams}:SearchParamProps) => {
  
  const {id,page} = await searchParams;

  const loggedIn = await getLoggedInUser();
  
    // ✅ Redirect if not logged in
    if (!loggedIn || !loggedIn.$id) {
      redirect('/sign-in')
    }
  
    const currentPage = Number(page as string) || 1
  
    const accounts = await getAccounts({ 
      userId: loggedIn.$id
    })
    const accountsData = accounts.data
  
    const appwriteItemId =(id as string) || accountsData[0]?.appwriteItemId;
  
    const account = await getAccount({ appwriteItemId})
    // ✅ Redirect if not logged in
    if (!loggedIn) {
      redirect('/sign-in')
    }
  
    const rowsPerPage = 10
    const totalPages = Math.ceil(account?.transactions.length/rowsPerPage)

    const indexOfLastTransaction = currentPage * rowsPerPage
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage
    const currentTransaction = account?.transactions.slice(
        indexOfFirstTransaction, indexOfLastTransaction
    )
  
  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Transactions History"
          subtext="See your bank history here"
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className='flex flex-col gap-2'>
            <h2 className='font-bold text-white text-18'>
                {account?.data.name}
            </h2>
            <p className='text-14 text-blue-25'>
              {account?.data.officialName}
            </p>
             <p className='text-14 font-semibold tracking-[1.1px] text-white'>
                ●●●● ●●●● ●●●● {account?.data.mask}
                 </p>

          </div>
        </div>
        <div className='transactions-account-balance'>
          <p className='text-14'>Current balance</p>
          <p className='font-bold text-center text-24'>
            {formatAmount(account?.data.currentBalance)}
          </p>
        </div>
      </div>
      <section className='flex-col w-full gap-6 fkex'>
  {currentTransaction && currentTransaction.length > 0 ? (
    <>
      <TransactionsTable transactions={currentTransaction} />
      {totalPages > 1 && (
        <div className="w-full my-4">
          <Pagination totalPages={totalPages} page={currentPage} />
        </div>
      )}
    </>
  ) : (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4 text-center">
      <p className="text-lg font-semibold text-white">No transactions found.</p>
      <div className='flex-col gap-6'>
      <Image src="link.jpg"
      alt="link"
      width={80}
      height={80}
      className='items-center'
      />
      <Link
        href="/link-bank" // 🔁 Update this path based on your actual link-bank page
        className="text-blue-500 underline hover:text-blue-400"
      >
        Link a bank account to get started
      </Link>
      </div>
    </div>
  )}
</section>

    </div>
  )
}

export default TransactionHistory