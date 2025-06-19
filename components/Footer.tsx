import React from 'react'
import { FooterProps } from '@/types'
import Logout from './Logout'

const Footer = ({user, type="desktop"}:FooterProps) => {
   
    return (
    <footer className="footer">
        <div className={type ==='mobile'?'footer_name-mobile':'footer_name'}>
            <p className='text-xl font-bold text-gray-700'>
                
                {user.firstName[0] + user.lastName[0]}
            </p>
        </div>
        <div className={`${type ==='mobile'?'footer_email-mobile':'footer_email'}`}>
            <h1 className='font-normal text-gray-600 truncate text-14'>
                {user?.firstName}
            </h1>

            </div>
         <Logout />
            
        
    </footer>
  )
}

export default Footer