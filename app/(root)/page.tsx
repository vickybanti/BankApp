import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '@/components/RecentTransactions'
import {redirect} from 'next/navigation'

type SearchParamProps = {
  searchParams:  Promise<{
    id: string;
    page: string;
  }>;
};

export const dynamic = 'force-dynamic'; // ensure SSR

const Home = async ({ searchParams }: SearchParamProps) => {

  
  const loggedIn = await getLoggedInUser();
  if (!loggedIn?.$id) redirect('/auth/sign-in');
  const {id} = await searchParams;
  const {page} = await searchParams;


  

  const accounts = await getAccounts({ userId: loggedIn.$id });
  if(!accounts) return;

  const accountsData = accounts?.data;

  const currentPage = Number(page) || 1;
  const appwriteItemId = id || accountsData?.[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <div className='flex items-center gap-3'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Efficiently manage your bank accounts"
          />
          </div>
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
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
