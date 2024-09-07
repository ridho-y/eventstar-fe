import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import LoadingPage from 'system/LoadingPage';
import { toast } from 'react-toastify';
import apiRequest, { cancelAllRequests } from 'utils/api';
import PrimaryButton from 'components/PrimaryButton';
import TextInput from 'components/TextInput';

export type Validation = {
  status: '' | 'error' | 'success' | 'warning' | 'validating',
  msg: string
}

const Information: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfileInformation = async () => {
      cancelAllRequests();
      const res = await apiRequest('GET', '/profile')
      if (res.ok) {
        setFirstName(res.firstName);
        setLastName(res.lastName);
        setEmail(res.email);
        setUsername(res.username);
      }
    }
    getProfileInformation();
  }, [])

  const [form] = Form.useForm();

  // First name validation
  const [firstName, setFirstName] = useState('')
  const [firstNameStatusMsg, setFirstNameStatusMsg] = useState<Validation>({ status: '', msg: '' })
  useEffect(() => {
    if (firstName.length > 0) {
      setFirstNameStatusMsg({ status: '', msg: '' })
    } else {
      setFirstNameStatusMsg({ status: 'error', msg: 'First name cannot be empty' })
    }
  }, [firstName])

  // Last name validation
  const [lastName, setLastName] = useState('')
  const [lastNameStatusMsg, setLastNameStatusMsg] = useState<Validation>({ status: '', msg: '' })
  useEffect(() => {
    if (lastName.length > 0) {
      setLastNameStatusMsg({ status: '', msg: '' })
    } else {
      setLastNameStatusMsg({ status: 'error', msg: 'First name cannot be empty' })
    }
  }, [lastName])

  // Email validation
  const [email, setEmail] = useState('');
  const [emailStatusMsg, setEmailStatusMsg] = useState<Validation>({ status: '', msg: '' });
  useEffect(() => {
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailStatusMsg({ status: '', msg: '' });
    } else {
      setEmailStatusMsg({ status: 'error', msg: 'Invalid email' });
    }
  }, [email]);

  // Username validation
  const [username, setUsername] = useState('')
  const [usernameStatusMsg, setUsernameStatusMsg] = useState<Validation>({ status: '', msg: '' })
  useEffect(() => {
    if (username.length > 0) {
      setUsernameStatusMsg({ status: '', msg: '' })
    } else {
      setUsernameStatusMsg({ status: 'error', msg: 'Username cannot be empty' })
    }
  }, [username])

  const [allowSubmit, setAllowSubmit] = useState(false);

  useEffect(() => {
    if (firstNameStatusMsg.status === '' && lastNameStatusMsg.status === '' && emailStatusMsg.status === '' && usernameStatusMsg.status === '') {
      setAllowSubmit(true)
    } else {
      setAllowSubmit(false)
    }
  }, [firstNameStatusMsg, lastNameStatusMsg, emailStatusMsg, usernameStatusMsg])

  // When to reveal form
  useEffect(() => {
    if (username !== '') {
      setLoading(false)
    }
  }, [username])

  // Submission
  const saveProfileInfo = async () => {
    const res = await apiRequest('POST', '/profile', { firstName, lastName, email, username })
    if (res.ok) {
      toast.success('Successfully updated your information');
    }
  }

  if (loading) {
    return (
      <div className='w-full min-h-full h-full flex justify-center items-center'>
        <LoadingPage />
      </div>)
  } else {
    return (
      <div className='pt-[70px]'>
        <p className='text-h1 md:text-h1-md text-primary'>My Information</p>
        <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>You can view and update your information here</p>
        <br />
        <Form className='md:mr-48' form={form}>
          <section className='flex flex-row gap-3 md:gap-16'>
            <div className='w-full'>
              <TextInput name='First Name' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} value={firstName} validation={firstNameStatusMsg}></TextInput>
            </div>
            <div className='w-full'>
              <TextInput name='Last Name' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} value={lastName} validation={lastNameStatusMsg}></TextInput>
            </div>
          </section>
          <TextInput name='Email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} validation={emailStatusMsg}></TextInput>
          <TextInput name='Username' placeholder='Username' onChange={(e) => setUsername(e.target.value)} value={username} validation={usernameStatusMsg}></TextInput>
          <br />
          <PrimaryButton disabled={!allowSubmit} onClick={saveProfileInfo}>Save Information</PrimaryButton>
        </Form>
      </div>
    )
  }
}

export default Information;
