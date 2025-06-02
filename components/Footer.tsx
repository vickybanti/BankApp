import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FooterProps } from '@/types'

const Footer = ({user, type="desktop"}:FooterProps) => {
  const router = useRouter()
   
    return (
    <footer className="footer">
        <div className={type ==='mobile'?'footer_name-mobile':'footer_name'}>
            <p className='text-xl font-bold text-gray-700'>
                

            </p>
        </div>
        <div className={`${type ==='mobile'?'footer_email-mobile':'footer_email'}`}>
            <h1 className='font-normal text-gray-600 truncate text-14'>
                {user?.firstName}
            </h1>

            </div>
            
        
    </footer>
  )
}

export default Footer