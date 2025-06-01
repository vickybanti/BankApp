import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { FooterProps } from '@/types'

const Footer = ({user, type="desktop"}:FooterProps) => {
  const router = useRouter()
    const handleLogout = async () => {
    const loggedOut = await logoutAccount()
    if(loggedOut) router.push('/sign-in')
    
  }
    return (
    <footer className="footer">
        <div className={type ==='mobile'?'footer_name-mobile':'footer_name'}>
            <p className='text-xl font-bold text-gray-700'>
                {user?.firstName[0]}

            </p>
        </div>
        <div className={`${type ==='mobile'?'footer_email-mobile':'footer_email'} flex justify-between gap-3`}>
            <h1 className='font-normal text-gray-600 truncate text-14'>
                {user?.firstName}
            </h1>

            <Button variant="secondary" onClick={()=>handleLogout()}>
              Logout
            </Button>
            </div>
    </footer>
  )
}

export default Footer