"use client"
import React, { useEffect } from 'react'
import SignInForm from './form'
import Card from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import useReduxStore from '@/store/usestore.hook'

const Page = () => {
  const router = useRouter()
  const isAuthenticated = useReduxStore()?.auth?.isAuthenticated

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [router, isAuthenticated])

  return (
    <div className='h-screen'>
      <div className='flex items-center justify-center h-full'>
        <Card className='m-auto w-fit h-fit'>
          <SignInForm />
        </Card>
      </div>
    </div>
  )
}

export default Page