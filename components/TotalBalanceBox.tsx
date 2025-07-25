import React from 'react'
import AnimatedCounter from './AnimatedCounter'
import DoughnutChart from './DoughnutChart'
import { TotalBalanceBoxProps } from '@/types'

const TotalBalanceBox = ({
    accounts =[], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {

  return (
    <section>
        <div className='total-balance'>
            <div className='total-balance-chart'>
                {/*DoughnutChart */}
                <DoughnutChart accounts={accounts} />
            </div>

            <div className='flex flex-col gap-6'>
                <h2 className='header-2'>
                    Bank Accounts: {totalBanks}
                </h2>

                <div className='flex flex-col gap-2'>
                    <p className='total-balance-label'>Total Current Balance</p>
                    <div className='gap-2 total-balance-amount flex-center'>
                        <AnimatedCounter 
                        amount={totalCurrentBalance}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox