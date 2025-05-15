import HeaderBox from '@/components/HeaderBox'
import React from 'react'

const Home = () => {
    const loggedIn ={firstName:'Banti'}
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
               
                </header>
        </div>
    </section>

  )
}

export default Home