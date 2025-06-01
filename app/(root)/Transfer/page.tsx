"use client"
export const dynamic = "force-dynamic"

import React from 'react'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccounts } from '@/lib/actions/bank.actions'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import HeaderBox from '@/components/HeaderBox'

const Transfer = async () => {
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts({ userId: loggedIn.$id })
  const accountsData = accounts?.data

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Please provide any specific details"
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer
