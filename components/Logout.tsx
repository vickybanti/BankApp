"use client"
import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'

const Logout = () => {
    const router = useRouter()
     const handleLogout = async () => {
    const loggedOut = await logoutAccount()
    if(loggedOut) router.push('/sign-in')
    
  }
  return (
    <div>
      <Button
        onClick={handleLogout}
        variant='link'
        className='text-red-500 hover:text-red-700'
        >
        Logout
        </Button>
    </div>
  )
}

export default Logout
