import React from 'react'
import { TextInputProps } from 'react-native'
import { Control, Controller } from 'react-hook-form'

import  { Input } from '../Input'

import { Container, Error } from './styles'

interface InputFormProps extends TextInputProps {
  name: string
  control: Control
  error: string
}

export const InputForm = ({ control, name, error, ...rest }: InputFormProps) => {
  return (
    <Container>
      <Controller 
        name={name}
        control={control} 
        render={({ field: { onChange, value } }) => (
          <Input value={value} onChangeText={onChange} {...rest} />
        )} 
      />  
      {error && <Error>{error}</Error>}
    </Container>
  )
}