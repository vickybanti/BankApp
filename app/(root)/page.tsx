import { redirect } from 'next/navigation' // Add this
import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const Home = async () => {
  const loggedIn = await getLoggedInUser()

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
            user={loggedIn.name}
            subtext="Efficiently manage your bank accounts"
          />

          <TotalBalanceBox 
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1250.53}
          />
        </header>

        RECENT TRANSACTIONS
      </div>

      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[
          { $id: "bank1", currentBalance: 1250.53 },
          { $id: "bank2", currentBalance: 1250.53 }
        ]}
      />
    </section>
  )
}

export default Home
