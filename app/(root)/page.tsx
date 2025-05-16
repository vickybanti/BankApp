import HeaderBox from '@/components/HeaderBox'
import TotalBalanceBox from '@/components/TotalBalanceBox'
import React from 'react'
import RightSidebar from '@/components/RightSidebar'

const Home = () => {
    const loggedIn ={firstName:'Banti', lastName:'Vikky', email:'olamuyiwavictor@gmail.com'}
  return (
    <section className='home'>
        <div className="home-content">
            <header className='home-header'>
                <HeaderBox 
                type="greeting"
                title="Welcome"
                user={loggedIn?.firstName || "Guest"}
                subtext="Efficiently  manage your bank accounts"
                />
               
               <TotalBalanceBox 
               accounts={[]}
                totalBanks = {1}
               totalCurrentBalance={1250.53}
               />
                </header>

                RECENT TRANSACTIONS
        </div>
        <RightSidebar 
        user={loggedIn}
        transactions={[]}
          banks={[{currentBalance:1250.53},{currentBalance:1250.53}]}
        
        />
     </section>

  )
}

export default Home