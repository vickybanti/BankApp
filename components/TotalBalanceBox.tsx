import React from 'react'

const TotalBalanceBox = ({
    accounts =[], totalBanks, totalCurrentBalance
}: TotlaBalanceBoxProps) => {

  return (
    <section>
        <div className='total-balance'>
            <div className='total-balance-chart'>
                {/*DoughnutChart */}
            </div>

            <div className='flex flex-col gap-6'>
                <h2 className='header-2'>
                    Bank Accounts: {totalBanks}
                </h2>

                <div className='flex flex-col gap-2'>
                    <p className='total-balance-label'>Total Current Balance</p>
                    <p className='gap-2 total-balance-amount flex-center'>
                        {totalCurrentBalance}
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox