import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import {PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink} from 'react-plaid-link'
import { createLinkToken,exchangePublicToken } from '@/lib/actions/user.actions'

const PlaidLink = ({user, variant} :PlaidLinkProps) => {
    const [token, setToken] = useState('')
    const router = useRouter()

    useEffect(() =>  {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);
            setToken(data.linkToken)
        }
        getLinkToken();
    },[user]); 
    console.log('token', token)

    const onSuccess =useCallback<PlaidLinkOnSuccess>(async(public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user
        })
        router.push('/')
    }, [user]);
    
    const config: PlaidLinkOptions = {
        token, 
        onSuccess
    }

    const {open , ready} = usePlaidLink(config);
  return (
    <>
        {variant==='primary' ? (
            <Button className='plaidlink-primary'
            onClick={() => open()}
            disabled={!ready}
            >
                Connect bank
            </Button>
        ) :
        variant === 'ghost' ? (
            <Button>
                Connect bank
            </Button>
        ): (
            <Button>
                Connect bank account
            </Button>
        )
        }
    </>
  )
}

export default PlaidLink
