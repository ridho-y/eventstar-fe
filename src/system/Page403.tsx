import { Button, Divider } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Page403 = () => {
  const navigate = useNavigate()
  return <>
    <div className="w-full h-full relative flex items-center justify-center px-8 ">
      <div className="bg-white border flex flex-col items-center justify-center px-10 py-8 rounded-lg shadow-2xl w-96">
        <p className="text-h3-md md:text-h3-md">403: Access Denied</p>
        <Divider />
        <p className="text-h5 md:text-h5-md text-center">Oops, 403 Error: You&apos;ve stumbled upon a secret treasure chest that&apos;s forbidden to mere mortals!</p>
        <br></br>
        <Button type="primary"
        onClick={() => {
          navigate('/')
        }}><p className="text-h5 md:text-h5-md text-center">Return Home</p></Button>
      </div>
    </div>
  </>
}

export default Page403
