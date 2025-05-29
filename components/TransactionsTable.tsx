<<<<<<< HEAD
import React from 'react'
=======
import React from "react";
>>>>>>> 86eec12 (got recent transactions data)
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
<<<<<<< HEAD
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'
import { transactionCategoryStyles } from '@/constants'

const CategoryBagde = ({category}:CategoryBadgeProps) => {

=======
} from "@/components/ui/table";

import { TransactionTableProps, Transaction } from "../types";
import {
    cn,
  formatAmount,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { transactionCategoryStyles } from "@/constants";
import Image from "next/image";

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CategoryBadge = ({category}:CategoryBadgeProps) => {
>>>>>>> 86eec12 (got recent transactions data)
    const {
        borderColor,
        backgroundColor,
        textColor,
        chipBackgroundColor
    } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
<<<<<<< HEAD
   
   
    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full', backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>
                {category}
            </p>

=======
    return (
        <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
            <div className={cn('size-2 rounded-full',backgroundColor)} />
            <p className={cn('text-[12px] font-medium', textColor)}>
                {category}
            </p>
>>>>>>> 86eec12 (got recent transactions data)
        </div>
    )
}

<<<<<<< HEAD
const TransactionsTable = ({transactions}:TransactionTableProps) => {
  return (
      <Table>
        <TableHeader className='bg-[#f9fafb]'>
            <TableRow>
=======
const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  console.log(transactions)
    return (
    <div>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
>>>>>>> 86eec12 (got recent transactions data)
            <TableHead className="px-2">Transactions</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
<<<<<<< HEAD
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
         </TableRow>
        </TableHeader>
        <TableBody>
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
                           <CategoryBagde category={t.category} />
                        </TableCell>
                    </TableRow>
                )
            })}
        </TableBody>
    </Table>

  )
}

export default TransactionsTable
=======
            <TableHead className="px-2 max-md:hidden">Image</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);
            const isDebit = t.type === "debit";
            const isCredit = t.type === "credit";

            return (
              <TableRow key={t.id} 
              className={`${isDebit || amount[0] === '-'? 'bg-[#FFFBFA]':'bg-[#F6FEF9]'} !over:bg-none !border-b-default`}>
                <TableCell className="max-w-[250px] pl-2 pr-10">
                    <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">{removeSpecialCharacters(t.name)}</h1>
                </div>
                </TableCell>

                <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-'? 'text-[#f04438]': 'text-[#039855]'}`}>
                  {isDebit ? `-${amount}` : amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                   <CategoryBadge category= {status} />
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">{formatDateTime(new Date(t.date))}</TableCell>

                <TableCell className="min-w-24 capitalize pl-2 pr-10">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="max-md:hidden pl-2 pr-10">
                    <CategoryBadge category= {t.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
>>>>>>> 86eec12 (got recent transactions data)
