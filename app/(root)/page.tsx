import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '@/components/RecentTransactions'

type SearchParamProps = {
searchParams: {
    id: string;
    page: string;
  };
};
const Home = async ({searchParams}:SearchParamProps) => {
  const id = await searchParams.id
  const page = await searchParams.page
  const loggedIn = await getLoggedInUser();
   const accounts = await getAccounts({ 
    userId: loggedIn.$id
  })
  const accountsData = accounts?.data


  // ✅ Redirect if not logged in
  if (!loggedIn) return;

  const currentPage = Number(page as string) || 1

 
  const appwriteItemId =(id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId})
  // ✅ Redirect if not logged in
  
  return (
    <section className='home'>
      <div className="home-content">
        <header className='home-header'>
          <HeaderBox 
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
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
        transactions={account?.transactions}
        banks={accountsData?.slice(0,2)}
      />
     </section>
  )
}

export default Home
