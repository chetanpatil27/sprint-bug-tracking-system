"use client"
import React from 'react'
import Input from '@/components/form/input/InputField'
import { useForm } from 'react-hook-form'

const SprintForm = () => {
  const { control, handleSubmit } = useForm()
  const onSubmit = (data: object) => {
    console.log("data", data)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" name="name" control={control} />
    </form>
  )
}

export default SprintForm