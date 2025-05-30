import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '@/components/RecentTransactions'

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const Home = async ({ searchParams }: Props) => {
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) return; // ✅ Early return if not logged in

  const accounts = await getAccounts({ userId: loggedIn.$id });
  const accountsData = accounts?.data;

  const id = searchParams?.id as string | undefined;
  const page = Number(searchParams?.page) || 1;

  const appwriteItemId = id || accountsData?.[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId });

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
          page={page}
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
