import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import {Control, FieldPath} from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

 const formSchema = authFormSchema('sign-up')

 type FormSchemaType = z.infer<typeof formSchema>;

interface CustomInput {
  control: Control<FormSchemaType>;
  name: FieldPath<FormSchemaType>;
  label: string;
}
// interface CustomInput {
//     control : Control<z.infer<typeof formSchema>>,
//     name:FieldPath<z.infer<typeof formSchema>>,
//     label:string,
    
// }
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