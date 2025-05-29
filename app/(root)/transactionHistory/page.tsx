import HeaderBox from '@/components/HeaderBox'
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react'

const TransactionHistory = async ({searchParams: {id,page}}:SearchParamProps) => {
  
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
            <h2 className='font-bold text-18 text-white'>
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
          <p className='text-24 text-center font-bold'>
            {formatAmount(account?.cata.currentBalance)}
          </p>
        </div>
      </div>
      <section className='fkex w-full flex-col gap-6'>
        <TransactionsTable transaction={account?.transactions}/>
      </section>
    </div>
  )
}

export default TransactionHistory