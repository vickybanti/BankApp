import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCards from './BankCards'
import { countTransactionCategories } from '@/lib/utils'
import { Category } from './Category'
import { CategoryCount, RightSidebarProps } from '@/types'

const RightSidebar = ({user, transactions, banks} : RightSidebarProps) => {
  
  const categories: CategoryCount[] = countTransactionCategories(transactions);
    return ( 
    <aside className="right-sidebar">
        <section className="sticky flex flex-col pb-8">
            <div className="profile-banner"/>
            <div className="profile">
                <div className="profile-img">
                    <span className="text-5xl font-bold text-blue-500">
                     
                     {user.firstName[0]}
                        </span>
                        </div>
                    <div className="profile-details">
                        <h1 className="profile-name">
                            {user.firstName} 
                        </h1>
                        <p className="profile-email">{user.email}</p>
                    </div>
            </div>

            
    </section>

    <section className='banks'>
        <div className='flex justify-between w-full'>
            <h2 className='header-2'>Banks</h2>
            <Link href="/" className="flex gap-2">
                <Image src="/icons/plus.svg"
                 alt="add bank" 
                 width={20}
                  height={20} />
                <h2 className='font-semibold text-gray-600 text-14'>Add Bank</h2>
            </Link>
        </div>
        {banks?.length > 0 && (
            <div className="relative flex flex-col items-center justify-center flex-1 gap-5">
                <div className='relative z-10'>
                    <BankCards 
                        key={banks[0].$id}
                        account={banks[0]}
                        userName={`${user?.firstName} ${user?.lastName}`}
                        showBalance={false}
                    />
                </div> 
                {banks[1] && (
                    <div className='absolute right-0 top-8 z-0 w-[90%]'>
                        <BankCards 
                        key={banks[1].$id}
                        account={banks[1]}
                        userName={user.name}     
                        showBalance={false}
                    />
                        </div>
                )}
            </div>) }

            <div className="flex flex-col flex-1 gap-6 mt-10">
                <h2 className="header-2">Top Categories</h2>

                <div className="space-y-5">
                    {categories.map((category) => (
                        <Category key={category.name} category={category} />
                    ))}
                </div>
            </div>
    </section>
    </aside>
  )
}

export default RightSidebar