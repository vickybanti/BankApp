import AuthForm from '@/components/AuthForm'
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import React from 'react'

const Signin = async() => {
    const loggedIn = await getLoggedInUser();
    if (loggedIn?.$id) {
        redirect('/');
    }
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-in"/>
    </section>
  )
}

export default Signin