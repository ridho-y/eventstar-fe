import React, { useContext, useEffect, useState } from 'react';
import { isMobileWidth } from 'utils/media';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import apiRequest from 'utils/api';
import { Validation } from 'pages/profile/Information';
import { Form, Input, Button, Radio } from 'antd';
import LoadingPage from 'system/LoadingPage';
import { Context } from 'Router';

const RegisterPage: React.FC = () => {
  const [deviceType, setDeviceType] = useState('');
  const { setters } = useContext(Context);
  
  useEffect(() => {
    localStorage.removeItem('token');
    setters.setIsLoggedIn(false)
    
    const handleResize = () => {
      if (isMobileWidth()) setDeviceType('mobile');
      else setDeviceType('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {deviceType === 'mobile' && (
        <section className="bg-gray-100 flex items-center justify-center h-full">
          <div className="w-full max-w-md rounded-lg p-6">
            <RegisterBlock />
          </div>
        </section>
      )}
      {deviceType === 'desktop' && (
        <section className="h-full flex flex-row items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center justify-center px-[3%] w-[70%]">
            <RegisterBlock />
          </div>
        </section>
      )}
    </>
  );
};

const RegisterBlock = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [firstNameStatusMsg, setFirstNameStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [lastName, setLastName] = useState('');
  const [lastNameStatusMsg, setLastNameStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [email, setEmail] = useState('');
  const [emailStatusMsg, setEmailStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [username, setUsername] = useState('');
  const [usernameStatusMsg, setUsernameStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [password, setPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordStatusMsg, setConfirmPasswordStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [memberType, setMemberType] = useState('user');
  const [loading, setLoading] = useState(false)

  const submit = () => {
    new Promise<void>((res, rej) => {
      if (firstName.length > 0) {
        setFirstNameStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setFirstNameStatusMsg({ status: 'error', msg: 'First Name cannot be empty' });
      }

      if (lastName.length > 0) {
        setLastNameStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setLastNameStatusMsg({ status: 'error', msg: 'Last Name cannot be empty' });
      }

      if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setEmailStatusMsg({ status: 'error', msg: 'Invalid email' });
      }

      if (username.length > 0) {
        setUsernameStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setUsernameStatusMsg({ status: 'error', msg: 'Username cannot be empty' });
      }
      if (password.length >= 4 && password.length <= 255 || (password === confirmPassword && password === '')) {
        setPasswordStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setPasswordStatusMsg({ status: 'error', msg: 'Invalid password' });
      }
      if (password === confirmPassword) {
        setConfirmPasswordStatusMsg({ status: '', msg: '' });
      } else {
        rej()
        setConfirmPasswordStatusMsg({ status: 'error', msg: 'New passwords do not match' });
      }
      res();
    })
      .then(() => {
        if (
          firstNameStatusMsg.status === '' &&
          lastNameStatusMsg.status === '' &&
          emailStatusMsg.status === '' &&
          usernameStatusMsg.status === '' &&
          passwordStatusMsg.status === '' &&
          confirmPasswordStatusMsg.status === ''
        ) {
          handleRegister(firstName, lastName, email, username, password, confirmPassword, memberType);
        }
      })
      .catch(() => {});
  }

  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
    memberType: string
  ) => {
    // Check if password and confirm password are the same
    if (password !== confirmPassword) {
      toast.error('Password and confirm password are not the same');
      return;
    }
    const payload = {
      firstName,
      lastName,
      email,
      username,
      password,
      memberType,
    };
    setLoading(true)
    await apiRequest('POST', '/auth/signup', payload)
      .then((res) => {
        if (res.ok) {
          toast.success('Successfully registered');
          navigate('/sign-in');
        }
        setLoading(false)
      })
      .catch(() => {});
  };

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className="w-full bg-white rounded-lg shadow-xl">
        <div className="p-6 mt-2">
          <p className="text-h2 md:text-h2-md py-1 pb-5">Sign Up</p>
          <Form autoComplete='new-state'>
            <Radio.Group defaultValue="user" value={memberType} onChange={(e) => setMemberType(e.target.value)} buttonStyle="solid" className='!w-full '>
              <Radio.Button className='w-1/2 text-center' value="user">User</Radio.Button>
              <Radio.Button className='w-1/2 text-center' value="host">Host</Radio.Button>
            </Radio.Group>
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <label
                  htmlFor="firstName"
                  className="block text-h4 md:text-h4-md  font-medium mt-4"
                >
                  First Name
                </label>
                <Form.Item
                  validateStatus={`${firstNameStatusMsg.status}`}
                  help={firstNameStatusMsg.msg}
                  className='!text-h5 !md:text-h5-md'
                  hasFeedback
                >
                  <Input autoComplete="new-state" placeholder="First name" className='text-h4 md:text-h4-md' onChange={(e) => setFirstName(e.target.value)} value={firstName} />
                </Form.Item>
              </div>
              <div className="w-1/2 pl-2">
                <label
                  htmlFor="lastName"
                  className="block text-h4 md:text-h4-md  font-medium mt-4"
                >
                  Last Name
                </label>
                <Form.Item
                  validateStatus={`${lastNameStatusMsg.status}`}
                  help={lastNameStatusMsg.msg}
                  className='!text-h5 !md:text-h5-md'
                  hasFeedback
                >
                  <Input autoComplete="new-state" placeholder="Last name" className='text-h4 md:text-h4-md' onChange={(e) => setLastName(e.target.value)} value={lastName} />
                </Form.Item>
              </div>
            </div>
            <label
              htmlFor="email"
              className="block text-h4 md:text-h4-md  font-medium"
            >
              Email
            </label>
            <Form.Item
              validateStatus={`${emailStatusMsg.status}`}
              help={emailStatusMsg.msg}
              className='!text-h5 !md:text-h5-md'
              hasFeedback
            >
              <Input autoComplete="new-state" placeholder="Email" className='text-h4 md:text-h4-md' onChange={(e) => setEmail(e.target.value)} value={email} />
            </Form.Item>
            <label
              htmlFor="username"
              className="block text-h4 md:text-h4-md font-medium"
            >
              Username
            </label>
            <Form.Item
              validateStatus={`${usernameStatusMsg.status}`}
              help={usernameStatusMsg.msg}
              className='!text-h5 !md:text-h5-md'
              hasFeedback
            >
              <Input autoComplete="new-state" placeholder="Username" className='text-h4 md:text-h4-md' onChange={(e) => setUsername(e.target.value)} value={username} />
            </Form.Item>
            <div className="flex justify-between">
              <div className="w-1/2 pr-2">
                <label
                  htmlFor="password"
                  className="block text-h4 md:text-h4-md  font-medium"
                >
                  Password
                </label>
                <Form.Item
                  validateStatus={`${passwordStatusMsg.status}`}
                  help={passwordStatusMsg.msg}
                  className='!text-h5 !md:text-h5-md'
                  hasFeedback
                >
                  <Input.Password autoComplete="new-state" placeholder="Password" className='text-h4 md:text-h4-md' onChange={(e) => setPassword(e.target.value)} value={password} />
                </Form.Item>
              </div>
              <div className="w-1/2 pl-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-h4 md:text-h4-md  font-medium"
                >
                  Confirm Password
                </label>
                <Form.Item
                  validateStatus={`${confirmPasswordStatusMsg.status}`}
                  help={confirmPasswordStatusMsg.msg}
                  className='!text-h5 !md:text-h5-md'
                  hasFeedback
                >
                  <Input.Password autoComplete="new-state" placeholder="Confirm Password" className='text-h4 md:text-h4-md' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                </Form.Item>
              </div>
            </div>

            <Button
              type="primary"
              className="w-full h-10 flex items-center justify-center"
              onClick={submit}
            >
              <p className='text-h3 md:text-h3'>Register</p>
            </Button>
            <p className="text-h4 text-center pt-6 ">
              Already have an account?{' '}
              <a
                href="#"
                className="font-bold hover:underline"
                onClick={() => navigate('/sign-in')}
              >
                Sign In
              </a>
            </p>
          </Form>
        </div>
      </div>
    )
  }
}

export default RegisterPage;
