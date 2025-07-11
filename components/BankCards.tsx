import Link from 'next/link'
import React from 'react'
import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Copy from './Copy'
import { CreditCardProps } from '@/types'

const BankCards = ({account, userName, showBalance=true}:CreditCardProps) => {
  return (
    <div className='flex flex-col'>
        <Link href={`/transaction-history/?id=${account.appwriteItemId}`} className='bank-card'>
            <div className="bank-card_content">
                <div>
                    <h1 className='font-semibold text-white text-16'>
                        {account?.name || userName}

                    </h1>

                    <p className='font-black text-white font-ibm-plex-serif'>
                        {formatAmount(account?.currentBalance || 0)}
                    </p>

                </div>
                <article className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <h1 className='font-semibold text-white text-12'>
                           {userName} 
                        </h1>

                        <h2 className='font-semibold text-white text-12'>
                            **/ **
                        </h2>
                        </div>

                        <p className='text-14 font-semibold tracking-[1.1px] text-white'>
                            ●●●● ●●●● ●●●● | <span className='text-16'>{account?.mask}</span>
                        </p>
                    

                </article>

            </div>
            <div className='bank-card_icon'>
                <Image src="/icons/Paypass.svg" width={20} height={20} alt='pay' />
                <Image src="/icons/mastercard.svg" width={45} height={32} alt='master' className='ml-5'/> 
            </div>

            <Image src="/icons/lines.svg" width={316} height={190} alt="lines"  className='absolute top-0 left-0'/>
            

        </Link>

        {showBalance && <Copy title={account?.sharableId}/>}
    </div>
  )
}

export default BankCards