import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Divider, Button } from 'antd'

const Page404 = () => {
  const navigate = useNavigate();
  return <>
    <div className="w-full h-full flex items-center justify-center px-8 ">
      <div className="bg-white border flex flex-col items-center justify-center px-10 py-8 rounded-lg shadow-2xl w-96">
        <p className="text-h3-md md:text-h3-md">404: Page Not Found</p>
        <Divider />
        <p className="text-h5 md:text-h5-md text-center">Oh no! 404 Error: Looks like the page took a wrong turn, got lost in the digital wilderness. Sorry!</p>
        <br></br>
        <Button type="primary"
        onClick={() => {
          navigate('/')
        }}><p className="text-h5 md:text-h5-md text-center">Return Home</p></Button>
      </div>
    </div>
  </>
}

export default Page404
