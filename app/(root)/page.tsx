import { redirect } from 'next/navigation' // Add this
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '@/components/RecentTransactions'

const Home = async ({searchParams : {id,page}}:SearchParamProps) => {
  const loggedIn = await getLoggedInUser();

  // ✅ Redirect if not logged in
  if (!loggedIn || !loggedIn.$id) {
    redirect('/sign-in')
  }

  const currentPage = Number(page as string) || '1'

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
    <section className='home'>
      <div className="home-content">
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.name || 'Guest'}
            subtext="Efficiently manage your bank accounts"
          />

          <TotalBalanceBox 
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

       <RecentTransactions 
       accounts={accountsData}
       transactions={account?.transactions}
       appwriteItemId={appwriteItemId}
       page={currentPage}
       />
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={accounts?.transactions}
        banks={accountsData?.slice(0,2)}
      />
     </section>
  )
}

export default Home
