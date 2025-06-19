import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React, { Suspense } from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '@/components/RecentTransactions'
import {redirect} from 'next/navigation'
import { Loader2 } from 'lucide-react'



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
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <Loader2 className="animate-spin text-blue-400 w-10 h-10" />
          </div>
        }>
        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
        </Suspense>
        
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
