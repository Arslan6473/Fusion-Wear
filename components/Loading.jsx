import { Loader2 } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className='flex justify-center items-center '><Loader2 className='w-16 animate-spin h-16'/></div>
  )
}

export default Loading