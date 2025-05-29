import React from 'react'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'


const MyBanks = async() => {
  const loggedIn = await getLoggedInUser();
   const accounts = await getAccounts({ 
    userId: loggedIn.$id
  })
  const accountsData = accounts?.data
  return (
    <section className="flex">
      <div className="my-banks">
        <HeaderBox 
        title="My Bank Accounts"
        subtext="Effortlessly manage your banking activities"
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your Cards
          </h2>
          <div className="flex flex-wrap gap-6">
            {accounts && accounts.data.map((a:Account)=> (
              <BankCard 
              key={accounts.id}
              
              />
            ))}
          </div>


          </div>
        </div>

    </section>
  )
}

export default MyBanks