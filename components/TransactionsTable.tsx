import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'
import { transactionCategoryStyles } from '@/constants'
import { CategoryBadgeProps, Transaction, TransactionTableProps } from '@/types'
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react'


const CategoryBagde = ({category}:CategoryBadgeProps) => {

    const {
        borderColor,
        backgroundColor,
        textColor,
        chipBackgroundColor
    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
    if (!category) {
        return (
            <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
                <div className={cn('size-2 rounded-full', backgroundColor)} />
                <p className={cn('text-[12px] font-medium', textColor)}>
                    N/A
                </p>
            </div>
        )
    }   
    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>
                {category}
            </p>

        </div>
    )
}

const TransactionsTable = ({transactions}:TransactionTableProps) => {
  return (
      <Table className='!border-DEFAULT !border-t-0 !border-b-0'>
        <TableHeader className='bg-[#f9fafb]'>
            <TableRow>
            <TableHead className="px-2">Transactions</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
            <TableHead className="px-2 max-md:hidden">Date</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
            <Suspense fallback={<Loader2 className='animate-spin-100 w-10 h-10'/>}>
            {transactions.map((t:Transaction) => {
                //it takes one to two days to process transaction on sandbox
                const status = getTransactionStatus(new Date(t.date))
                const amount = formatAmount(t.amount)

                const isDebit = t.type === 'debit';
                const isCredit = t.type === 'credit';

                return (
                    <TableRow key ={t.id} 
                    className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]': 
                    'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
                        <TableCell className='max-w-[250px] pl-2 pr-10'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-14 truncate font-semibold text-[#344054]'>
                                    {removeSpecialCharacters(t.name)}
                                </h1>
                            </div>
                        </TableCell>

                        <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#F04438]': 
                    'text-[#039855]'}`}>
                            {isDebit ? `-${amount}` : isCredit ? amount:amount}
                        </TableCell>

                        <TableCell className='pl-2 pr-10'>
                           <CategoryBagde category={status}/> 
                        </TableCell>

                        <TableCell className='pl-2 pr-10 min-w-32'>
                            {formatDateTime(new Date(t.date)).dateTime}
                        </TableCell>

                        <TableCell className='pl-2 pr-10 capitalize min-w-24'>
                            {t.paymentChannel}
                        </TableCell>

                        <TableCell className='pl-2 pr-10 max-md:hidden'>
                           <CategoryBagde category={Array.isArray(t.category) ? t.category[0] : (t.category ? t.category : t.personal_finance_category?.primary)} />
                        </TableCell>

                        <TableCell className='pl-2 pr-10 max-md:hidden'>
                            {t.date ? formatDateTime(new Date(t.date)).dateOnly : 'N/A'}
                        </TableCell>
                    </TableRow>
                )
            })}
            </Suspense>
        </TableBody>
    </Table>

  )
}

export default TransactionsTable
