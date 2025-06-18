'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'
import PlaidLink from './PlaidLink'
import { SiderbarProps } from '@/types'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const AppSidebar = ({user}:SiderbarProps) => {
    const pathname= usePathname()
  return (

    <Sidebar collapsible="icon" variant="inset" className='max-md:hidden'>
      <SidebarContent className='ml-2'>
        
             <Link
            href="/"
            className='flex items-center gap-2 mb-12 cursor-pointer'>
            <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon"
            className='size-[24px] max-xl:size-14'
            />
            <h1 className='sidebar-logo pl-5'>Horizon</h1>

            </Link>
            <SidebarMenu>
             {sidebarLinks.map((item) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
                return (
                <SidebarMenuItem key={item.label}>
                 <SidebarMenuItem key={item.label} className='my-2'>
  <SidebarMenuButton asChild>
    <Link href={item.route} key={item.label} className={cn('sidebar-link',{'bg-bank-gradient':isActive})}>
      <div className='relative size-6'>
        <div className={cn('text-gray-600',{'brightness-[3] invert-0': isActive})}>
           <item.icon />
       </div>
      </div>
      <span className={cn('sidebar-label', {'!text-white':isActive})}>{item.label}</span>
    </Link>
  </SidebarMenuButton>

</SidebarMenuItem>
 

                </SidebarMenuItem>
                )
})}
<div className='my-2'>
 <PlaidLink user={user} />
</div>

                 <Footer user={user} type="desktop" />
            </SidebarMenu>
      </SidebarContent>
    </Sidebar>
    // <section className='sidebar'>
      
    //     <nav className='flex flex-col gap-4'>
    //         <Link
    //         href="/"
    //         className='flex items-center gap-2 mb-12 cursor-pointer'>
    //         <Image
    //         src="/icons/logo.svg"
    //         width={34}
    //         height={34}
    //         alt="Horizon"
    //         className='size-[24px] max-xl:size-14'
    //         />
    //         <h1 className='sidebar-logo'>Horizon</h1>

    //         </Link>

    //         {sidebarLinks.map((link) => {
    //             const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
    //             return (
    //                 <Link href={link.route}
    //                 key={link.label}
    //                 className={cn('sidebar-link',{'bg-bank-gradient':isActive})}
    //                 >
    //                     <div className='relative size-6'>
    //                         <Image src={link.imgURL}
    //                         alt={link.label}
    //                         fill
    //                         className={cn({'brightness-[3] invert-0': isActive})}
    //                     />
    //                     </div>
    //                    <p className={cn('sidebar-label', {'!text-white':isActive})}> {link.label} </p>
    //                 </Link>
    //             )
    //         })}

    //         <PlaidLink user={user} />

    //     </nav>
    //     <Footer user={user} type="desktop" />
    // </section>
  )
}

export default AppSidebar