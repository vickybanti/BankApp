'use client'
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Footer from './Footer'
import { MobileNavProps } from '@/types'


const MobileNav = ({user}:MobileNavProps) => {
    const pathname = usePathname()
  return (
    <section className='w-full max-w-[264px]'>
        <Sheet>
  <SheetTrigger>
    <Image
    src="/icons/hamburger.svg"
    width={30}
    height={30}
    alt="menu"
    className="cursor-pointer"
    />
  </SheetTrigger>
  <SheetContent side="left" className='bg-white border-none'>
    <Link
                href="/"
                className='flex items-center gap-1 px-4 cursor-pointer'>
                <Image
                src="/icons/logo.svg"
                width={34}
                height={34}
                alt="Horizon"
                className='size-[24px] max-xl:size-14'
                />
                    <h1 className='font-bold text-26 font-ibm-plex-serif text-black-1'>Horizon</h1>

                </Link>
    <div className='mobilenav-sheet'>
        <SheetClose asChild>
            <nav className="flex flex-col h-full gap-6 pt-16 text-white">

           
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
                    return (
                        <SheetClose asChild key={link.route}>
                        <Link href={link.route}
                        key={link.label}
                        className={cn('mobilenav-sheet_close w-full',{'bg-bank-gradient':isActive})}
                        >
                                <Image src={link.imgURL}
                                alt={link.label}
                                width={20}
                                height={20}
                                className={cn({'brightness-[3] invert-0': isActive})}
                            />
                           <p className={cn('text-16 font-semibold text-black-2', {'text-white':isActive})}> {link.label} </p>
                        </Link>
                        </SheetClose>
                    )
                })}
            
                 </nav>
        </SheetClose>

        <Footer user={user} type="mobile"/>
                        </div>


    
  </SheetContent>
</Sheet>

    </section>
  )
}

export default MobileNav