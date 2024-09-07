import React from 'react'
import { CircularProgress } from '@mui/material'

const LoadingPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <CircularProgress />
    </div>
  )
}

export default LoadingPage
