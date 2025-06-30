import Link from 'next/link'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import { Account, RecentTransactionsProps } from '@/types'
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react'

const RecentTransactions = ({accounts, 
    transactions = [],
    appwriteItemId,
    page=1
}:RecentTransactionsProps) => {

    if (!accounts || accounts.length === 0) {
        return (
            <div className="mt-6 space-y-3 text-center">
                <h2 className="font-medium text-white">No bank accounts linked</h2>
                <p
                    className="text-blue-500"
                >
                    Click on connect bank Link an account
                </p>
            </div>
        )
    }    
    const rowsPerPage = 10
    const totalPages = Math.ceil(transactions.length/rowsPerPage)

    const indexOfLastTransaction = page * rowsPerPage
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage
    const currentTransaction = transactions.slice(
        indexOfFirstTransaction, indexOfLastTransaction
    )
  return (
    <section className='recent-transactions'>
        <header className='flex items-center justify-between'>
           <h2 className='recent-transactions-label'>

                Recent transactions
            </h2> 
            
            <Link href={`/transaction-history/?id=${appwriteItemId}`} className='view-all-btn'>
                View all
             </Link>
             </header>

             <Tabs defaultValue={appwriteItemId} className="w-full">
                <TabsList className='recent-transactions-tablist'>
                <Suspense fallback={<Loader2 />}>
                    {accounts.map((account:Account) => (
                        <TabsTrigger key={account.id} value={account.appwriteItemId}>
                            <BankTabItem 
                                key={account.id}
                                account={account}
                                appwriteItemId={appwriteItemId}
                            />
                        </TabsTrigger>
                    ))}
                </Suspense>
                </TabsList>
                     
                   <Suspense fallback={<Loader2 className="animate-spin text-blue-400 w-10 h-10" />}>

                {accounts.map((account:Account) => (
 <TabsContent
 key={account.id}
 value={account.appwriteItemId}
 className="space-y-4"
>
 <BankInfo 
   account={account}
   appwriteItemId={appwriteItemId}
   type="full"
 />


 {currentTransaction && currentTransaction.length > 0 ? (
   <>
     <TransactionsTable transactions={currentTransaction} />
     {totalPages > 1 && (
       <div className="w-full my-4">
         <Pagination totalPages={totalPages} page={page} />
       </div>
     )}
   </>
 ) : (
   <div className="mt-6 space-y-3 text-center">
     <p className="font-medium text-white">No transactions available</p>
     <Link
       href="/link-bank"
       className="text-blue-500 underline hover:text-blue-400"
     >
       Link a bank account
     </Link>
   </div>
 )}
</TabsContent>


                ))}
                                      </Suspense>

                
                            </Tabs>

    </section>
  )
}

export default RecentTransactions
