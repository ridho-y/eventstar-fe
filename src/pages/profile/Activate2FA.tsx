import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { toast } from 'react-toastify';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Skeleton } from '@mui/material';
import apiRequest, { cancelAllRequests } from 'utils/api';

type Activate2FAProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>
}

const Activate2FA: React.FC<Activate2FAProps> = ({ setPage }) => {
  const get2faCode = async () => {
    setLoading(true)
    cancelAllRequests();
    const res = await apiRequest('GET', '/auth/2fa/link')
    if (res.ok) {
      setCode(res.code)
      setLoading(false)
    }
  }

  const [code, setCode] = useState(null);
  const [seperatedCode, setSeperatedCode] = useState(code);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    get2faCode();
  }, [])

  useEffect(() => {
    if (code !== null) {
      let s = ''
      for (let i = 0; i < code.length; i++) {
        if (i % 4 === 0) {
          s += ` ${code[i]}`
        } else {
          s += code[i]
        }
      }
      setSeperatedCode(s)
    }
  }, [code])

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.info('Linking code copied to clipboard');
  }

  return (
    <div className='pt-[22px] h-[300px]'>
      <span className='rounded bg-gray-200 hover:cursor-pointer px-3 py-1 text-h4 md:text-h4' onClick={() => setPage('')}>
        Back
      </span>
      <span className='flex flex-row items-center mt-6'>
        <GppGoodIcon className='text-green-600' fontSize='large' />
        <p className='text-h1 md:text-h1-md pl-2 text-green-700'>Activate 2FA</p>
      </span>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>Activating two-factor authentication will secure your account</p>
      <main className='w-full h-full flex justify-center items-center'>
        <Card bordered={false} className='md:w-[80%] w-[99%] flex justify-center py-10'>
          <p className='text-h4 md:text-h4-md text-center'>Enter the following code in any 2FA application</p>
          <br></br>
          <span className='flex flex-row justify-center items-center rounded bg-gray-100 px-3 py-1 gap-5'>
            <p className='text-h4 md:text-h4-md'>{loading ? <Skeleton variant="rectangular" className='w-full h-[30px] rounded' /> : seperatedCode}</p>
            {!loading && <ContentCopyIcon className='text-gray-700 text-h5 md:text-h5-md hover:cursor-pointer' onClick={copyCode}/>}
          </span>
        </Card>
      </main>

      <br></br>
    </div>
  )
}

export default Activate2FA;
