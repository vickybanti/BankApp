import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {CustomInput} from '@/types'
 
const FormFields = ({control,label,name}:CustomInput) => {
    return (
     <FormField
              control={control}
              name={name}
              render={({ field }) => (
                <div className="form-item">
                    <FormLabel className="form-label">{label}</FormLabel>
    
                <div className='flex flex-col w-full'>
                    <FormControl>
                        <Input placeholder={`Enter ${label}`} className='input-class' {...field} type={name ==='password' ? 'password': 'text'}/>
                    </FormControl>
                    <FormMessage className="mt-2 form-message" />
    
                </div>
             </div>
    
              )}
            />
  )
}

export default FormFields