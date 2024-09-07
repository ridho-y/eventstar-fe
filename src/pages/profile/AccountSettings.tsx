import { Form  } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Validation } from './Information';
import GppGoodIcon from '@mui/icons-material/GppGood';
import GppBadIcon from '@mui/icons-material/GppBad';
import DeleteAccount from './DeleteAccount';
import { url } from 'utils/config';
import { toast } from 'react-toastify';
import { signOutApi } from 'components/NavBar';
import { Context } from 'Router';
import { useNavigate } from 'react-router-dom';
import Activate2FA from './Activate2FA';
import LoadingPage from 'system/LoadingPage';
import { Skeleton } from '@mui/material';
import DangerButton from 'components/DangerButton';
import apiRequest from 'utils/api';
import PasswordInput from 'components/PasswordInput';
import PrimaryButton from 'components/PrimaryButton';
import DangerModal from 'components/DangerModal';

const AccountSettings: React.FC = () => {
  const [form] = Form.useForm();
  const { getters, setters } = useContext(Context);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [page, setPage] = useState('');
  const [loading, setLoading] = useState(false);

  // Password1 validation
  const [password1, setPassword1] = useState('');
  const [password1StatusMsg, setPassword1StatusMsg] = useState<Validation>({ status: '', msg: '' });
  useEffect(() => {
    if (password1.length >= 4 && password1.length <= 255 || (password1 === password2 && password1 === '')) {
      setPassword1StatusMsg({ status: '', msg: '' });
    } else {
      setPassword1StatusMsg({ status: 'error', msg: 'Invalid password' });
    }
  }, [password1]);

  // Password2 validation
  const [password2, setPassword2] = useState('');
  const [password2StatusMsg, setPassword2StatusMsg] = useState<Validation>({ status: '', msg: '' });
  useEffect(() => {
    if (password1 === password2) {
      setPassword2StatusMsg({ status: '', msg: '' });
    } else {
      setPassword2StatusMsg({ status: 'error', msg: 'New passwords do not match' });
    }
  }, [password2]);

  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    if (password1 === '' || password2 === '') {
      setAllowSubmit(false);
    } else if (password1StatusMsg.status === '' && password2StatusMsg.status === '') {
      setAllowSubmit(true);
    } else {
      setAllowSubmit(false);
    }
  }, [password1StatusMsg, password2StatusMsg]);

  // 2FA
  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [loading2fa, setLoading2fa] = useState(false);
  useEffect(() => {
    if (page === '') {
      setLoading2fa(true)
      setModal2Open(false)
    }
    const check2fa = async () => {
      const res = await apiRequest('GET', '/auth/2fa/check')
      if (res.ok) {
        res.value ? setIs2faEnabled(true) : setIs2faEnabled(false);
      }
      setLoading2fa(false)

    }
    check2fa();
  }, [page])

  const changePassword = async () => {
    setLoading(true)
    const res = await apiRequest('POST', '/auth/reset/password/loggedIn', { old_password: oldPassword, new_password: password2 })
    if (res.ok) {
      signOutApi();
      navigate('/');
      setters.setIsLoggedIn(false);
      toast.success('Successfully changed password');
    }
    setLoading(false)
  }

  // Disable 2FA
  const [modal2Open, setModal2Open] = useState(false);
  const disable2fa = async () => {
    const res = await apiRequest('PUT', '/auth/2fa/disable')
    if (res.ok) {
      setLoading2fa(false);
      setIs2faEnabled(false);
      toast.success('2FA disabled')
    }
  }

  if (loading) {
    return <LoadingPage />
  } else if (page === 'delete-account') {
    return <DeleteAccount setPage={setPage} />
  } else if (page === 'activate-2fa') {
    return <Activate2FA setPage={setPage} />
  } else {
    return (
      <div className='pt-[70px]'>
        <p className='text-h1 md:text-h1-md text-primary'>Account Settings</p>
        <br />
        <br></br>
        <Form className='md:mr-48' form={form} autoComplete='off'>
          <p className='text-h3 md:text-h3-md mb-3'>Change Your Password</p>
          <p className='text-h5 md:text-h5-md mt-1'>Password requirements:</p>
          <div className='pl-3'>
            <ul className='list-disc ml-5'>
              <li><span className='text-h5 md:text-h5-md'>Between 8 and 255 characters in length</span></li>
              <li><p className='text-h5 md:text-h5-md'>Cannot contain a substring longer than 4 characters from your username</p></li>
              <li><p className='text-h5 md:text-h5-md'>Not be in a subset of common password breach databases</p></li>
            </ul>
          </div>
          <br></br>
          <PasswordInput name='Old Password' placeholder='Old Password' onChange={(e) => setOldPassword(e.target.value)} value={oldPassword}></PasswordInput>
          <PasswordInput name='New Password' placeholder='New Password' onChange={(e) => setPassword1(e.target.value)} value={password1} validation={password1StatusMsg}></PasswordInput>
          <PasswordInput name='Confirm Password' placeholder='Confirm Password' onChange={(e) => setPassword2(e.target.value)} value={password2} validation={password2StatusMsg}></PasswordInput>
          <PrimaryButton onClick={changePassword}>Change Password</PrimaryButton>
          <br></br><br></br>
        </Form>
        <hr></hr>
        <br></br>
        <p className='text-h3 md:text-h3-md'>Two Factor Authentication</p>
        <br></br>
        <section className='md:mr-48'>
          {loading2fa
            ? <Skeleton variant="rectangular" className='w-full !h-[50px] rounded' />
            : <>
              {is2faEnabled
                ? (
                  <span className='flex flex-row justify-between'>
                    <span className='flex flex-row items-center'>
                      <GppGoodIcon className='text-green-600' fontSize='large' />
                      <p className='text-h4 md:text-h4-md pl-3'>Two-factor authentication is <b>enabled</b> for your account</p>
                    </span>
                    <DangerButton onClick={() => setModal2Open(true)}>Disable 2FA</DangerButton>
                    <DangerModal title='Confirm Disable 2FA' open={modal2Open} onOk={disable2fa} onCancel={() => setModal2Open(false)}>
                      Disabling 2FA can compromise your account security. Proceed with caution and consider alternatives.
                    </DangerModal>
                  </span>
                  )
                : (<span className='flex flex-row justify-between'>
                  <span className='flex flex-row items-center'>
                    <GppBadIcon className='text-red-600' fontSize='large' />
                    <p className='text-h4 md:text-h4-md pl-3'>Two-factor authentication is <b>not enabled</b> for your account</p>
                  </span>
                  <PrimaryButton onClick={() => setPage('activate-2fa')}>Activate 2FA</PrimaryButton>
                </span>)
              }
            </>
          }

        </section>
        <br></br>
        {!getters.isHost && (
          <>
            <hr></hr>
            <br></br>
            <p className='text-h3 md:text-h3-md'>Delete Account</p>
            <br></br>
            <DangerButton onClick={() => setPage('delete-account')}>I Want To Delete My Account</DangerButton>
          </>
        )}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    )
  }
}

export default AccountSettings;
