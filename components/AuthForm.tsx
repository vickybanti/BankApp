"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import FormFields from './FormFields'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'
 

 

const AuthForm = ({type} : {type:string}) => {
 const router = useRouter()
  const [user,setUser] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
const formSchema =authFormSchema(type)

 const defaultValues = type === 'sign-up'
  ? {
      firstName: '',
      lastName: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      password: '',
    }
  : {
      email: '',
      password: '',
    }

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues,
})

 
  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      //signup with appwrite and create a token


      if(type === 'sign-up'){
        const userData = {
          firstName:data.firstName!,
          lastName:data.lastName!,
          address1:data.address1!,
          city:data.city!,
          postalCode:data.postalCode!,
          dateOfBirth:data.dateOfBirth!,
          state:data.state!,
          ssn:data.ssn!,
          email:data.email,
          password:data.password

        }
        const newUser = await signUp(userData)
        setUser(newUser)
        }
      
      else if(type === 'sign-in'){
        const response  = await signIn({
          email:data.email,
          password:data.password
        })
       if (response) router.push('/')
      }
      else if(type === 'link-account'){
      }
      else{
        console.log('error')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
    console.log(data)
    setIsLoading(false)
  }

  
    return (
    <section className='auth-form'>
        <header className="flex flex-col gap-5 md:gap-8">
           <Link
            href="/"
            className='flex items-center gap-1 cursor-pointer'>
            <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon"
            />
            <h1 className='sidebar-logo'>Horizon</h1>

            </Link>

            <div className='flex flex-col gap-1 md:gap-3'>
                <h1 className='font-semibold text-gray-900 text-24 lg:text-36'>
                    {user ?
                    'Link Account': type === 'sign-in'
                    ? 'Sign In': 'Sign up'}

                    <p className='font-normal text-gray-600 text-16'>
                        {user ? 'Link your bank account to Horizon' :
                         'Please enter your details'}
                    </p>
                </h1>
            </div>

        </header>
        {user ? (
            <div className='flex flex-col gap-4'>
              <PlaidLink 
              user={user}
              variant="primary"
              />
            </div>
        ) : (
            <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {type==='sign-up' && (
            <>
            <div className='flex gap-4'>
              <FormFields control={form.control} name="firstName" label="First Name" /> 
              <FormFields control={form.control} name="lastName" label="Last Name" /> 
             </div>

              <FormFields control={form.control} name="address1" label="address1 e.g 24 health center" /> 
              <FormFields control={form.control} name="city" label="City e.g NYC" /> 
                          <div className='flex gap-4'>

               <FormFields control={form.control} name="state" label="specific state e.g LA" />  
              <FormFields control={form.control} name="postalCode" label="postal code e.g 10011" /> 
                           </div> 
                          <div className='flex gap-4'>

              <FormFields control={form.control} name="dateOfBirth" label="date of birth e,g 1990-11-12" /> 
              <FormFields control={form.control} name="ssn" label="SSN e,g 1234" /> 
            </div>
            </>
          )}
          <FormFields label="email" name="email"  control={form.control}/>
         
          <FormFields label="password" name="password" control={form.control}/>
        
        <div className='flex flex-col gap-4'>
        <Button type="submit" disabled={isLoading} className='form-btn'>
          {isLoading ? (
            <>
              <Loader2 size={20} className='animate-spin'/> &nbsp;Loading...
            </>
          )
            :(type === 'sign-in' ? 'Sign In' : 'Sign Up') 
          }
        </Button>
        </div>
      </form>
    </Form>

    <footer className='flex justify-center gap-1'>
      <p className='font-normal text-gray-600 text-14'>{type==='sign-in' ? "Don't have an account?":"Already have an account?"}</p>
          <Link href={type==='sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
          
          {type==='sign-in' ? 'Sign Up' : 'Sign In'}
          </Link>
    </footer>
            </>
        )}
    </section>
  )
}

export default AuthForm