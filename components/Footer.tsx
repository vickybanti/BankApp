import { logoutAccount } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { FooterProps } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
                

            </p>
        </div>
        <div className={`${type ==='mobile'?'footer_email-mobile':'footer_email'}`}>
            <h1 className='font-normal text-gray-600 truncate text-14'>
                {user?.firstName}
            </h1>

            </div>
            
            <DropdownMenu>
  <DropdownMenuTrigger>{user?.firstName[0]}</DropdownMenuTrigger>
  <DropdownMenuContent>
    
    <DropdownMenuItem onClick={()=>handleLogout()}>
      Logout
    </DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu>
              
    </footer>
  )
}

export default Footer