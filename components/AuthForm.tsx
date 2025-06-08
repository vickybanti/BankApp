"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl, FormField, FormLabel, FormMessage,FormItem,FormDescription } from "@/components/ui/form"
import FormFields from './FormFields'
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from './PlaidLink'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {usStates} from '@/constants'


 
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

 

const AuthForm = ({type} : {type:string}) => {
 const router = useRouter()
  const [user,setUser] = useState(null)
  const [isPlaidLinkOpen, setIsPlaidLinkOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [seePassword, setSeePassword] = useState(false)
  const [message,setMessage] = useState('')
   const [date, setDate] = React.useState<Date | undefined>(null)
  console.log('date',date)
  console.log(usStates.map((us)=>us.code))

  
  const handleSeePassword = () => {
    setSeePassword(!seePassword)
  }
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
  setMessage('')

  try {
    if (type === 'sign-up') {
      const userData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!.toString(),
        state: data.state!,
        ssn: data.ssn!,
        email: data.email,
        password: data.password
      }

      const newUser = await signUp(userData)
      if (!newUser) throw new Error("Sign-up failed. Please try again.")
      setUser(newUser)
      router.push('/')
    } 
    
    else if (type === 'sign-in') {
      const response = await signIn({
        email: data.email,
        password: data.password
      })

      if (!response) throw new Error("Sign-in failed. Please check your credentials.")
      
      setMessage(`${response.type || 'Success'}`)
      router.push('/')
    } 
    
    else if (type === 'link-account') {
      setIsPlaidLinkOpen(true)
    }

  } catch (error: any) {
    console.log(error)
    setMessage(error.message || "Something went wrong.")
  } finally {
    setIsLoading(false)
    setIsPlaidLinkOpen(false)
  }
}

console.log(usStates.code)
  
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
              <FormFields control={form.control} name="firstName" label="First Name" type="text" /> 
              <FormFields control={form.control} name="lastName" label="Last Name" type="text"/> 
             </div>

              <FormFields control={form.control} name="address1" label="Address e.g 24 health center" type="text"/> 
              <FormFields control={form.control} name="city" label="City e.g NYC" type="text"/> 
                          <div className='flex gap-4'>



         <FormField
  control={form.control}
  name="state"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>State</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select state" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {usStates.map((state) => (
            <SelectItem key={state.id} value={state.code}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>


               {/* <FormFields control={form.control} name="state" label="Specific state e.g LA" type="text"/>   */}
              <FormFields control={form.control} name="postalCode" label="postal code e.g 10011" type="number"/> 
                           </div> 
                          <div className='flex gap-4'>



<FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd")                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                    }}                   
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                format:YYYY-MM-DD
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


            
              <FormFields control={form.control} name="ssn" label="SSN e,g 1234" type="number"/> 
            </div>
            </>
          )}
          <FormFields label="email" name="email"  control={form.control} type="email"/>
         <div className='relative'>
          <FormFields label="password" name="password" control={form.control} type={seePassword ? "text" : "password"} />
          <button
            type="button"
            onClick={handleSeePassword}
            className='absolute right-3 top-12 -translate-y-1/2 text-gray-500 hover:text-gray-700'
          >
            {seePassword ? (
              <VisibilityOutlinedIcon />
            ) : (
              <VisibilityOffOutlinedIcon />
            )}
          </button>
          </div>
        
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

       <p className="text-12 text-red-500"> {message && message} </p>
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