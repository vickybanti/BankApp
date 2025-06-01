import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
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
            {formatAmount(account?.cata.currentBalance)}
          </p>
        </div>
      </div>
      <section className='flex-col w-full gap-6 fkex'>
        <TransactionsTable transactions={currentTransaction}/>
        {totalPages > 1 && (
          <div className="w-full my-4">
              <Pagination totalPages={totalPages} page={currentPage}/>
          </div>
        )}
      
      </section>
    </div>
  )
}

export default TransactionHistory