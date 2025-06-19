export const dynamic = "force-dynamic"; // <- ✅ Tell Next.js not to statically render

import React, { Suspense } from 'react'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccounts } from '@/lib/actions/bank.actions'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import HeaderBox from '@/components/HeaderBox'
import { Loader2 } from 'lucide-react';

const Transfer = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id || loggedIn.id })
  const accountsData = accounts?.data

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details"
      />

      <section className="size-full pt-5">
        <Suspense fallback={
              <div className="flex items-center justify-center h-screen w-screen">
                <Loader2 className="animate-spin text-blue-400 w-14 h-14" />
              </div>
            }>  
        <PaymentTransferForm accounts={accountsData} />
        </Suspense>
      </section>
    </section>
  )
}

export default Transfer
