import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiRequest from 'utils/api';
import { Form, Input, Button } from 'antd';
import { Validation } from 'pages/profile/Information';
import LoadingPage from 'system/LoadingPage';

const ResetEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useParams();
  const [otpCode, setOtpCode] = useState('');
  const [otpStatusMsg, setOtpStatusMsg] = useState<Validation>({
    status: '',
    msg: '',
  });
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<Validation>({
    status: '',
    msg: '',
  });
  const [confirmPasswordStatusMsg, setConfirmPasswordStatusMsg] = useState<Validation>({
    status: '',
    msg: '',
  });

  const handleResetPassword = async (
    otpCode: string,
    password: string,
    confirmedPassword: string
  ) => {
    if (otpCode === '') {
      setOtpStatusMsg({
        status: 'error',
        msg: 'OTP cannot be empty',
      });
    } else {
      setOtpStatusMsg({ status: '', msg: '' });
    }
    if (password === '') {
      setPasswordStatusMsg({
        status: 'error',
        msg: 'Password cannot be empty',
      });
    } else {
      setPasswordStatusMsg({ status: '', msg: '' });
    }
    if (confirmedPassword === '') {
      setConfirmPasswordStatusMsg({
        status: 'error',
        msg: 'Password cannot be empty',
      });
    } else {
      setConfirmPasswordStatusMsg({ status: '', msg: '' });
    }
    if (otpCode.trim() === '') {
      toast.error('Please enter OTP code');
    } else if (password.trim() === '') {
      toast.error('Please enter password');
    } else if (confirmedPassword.trim() === '') {
      toast.error('Please enter confirmed password');
    } else if (password !== confirmedPassword) {
      toast.error('Password and confirmed password are not matched');
    } else {
      setLoading(true)
      const payload = {
        email: email,
        code: otpCode,
        new_password: password,
      };
      await apiRequest('POST', '/auth/reset/password/loggedOut', payload)
        .then((res) => {
          if (res.ok) {
            toast.success('Successfully reset password');
            navigate('/sign-in');
          }
        })
        .catch((err) => {
          toast.error(err);
        });
      setLoading(false)
    }
  };

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="py-8 px-24 bg-white shadow-md rounded-lg">
          <h2 className="text-h2 md:text-h2-md pt-10 font-semibold mb-6 text-center">
            Reset Password with OTP
          </h2>
  
          <form className="space-y-4">
            <div>
              <label
              htmlFor='otpCode'
              className="block mb-1 text-h4 md:text-h4-md mt-6"
              >
              OTP Code
              </label>
              <Form.Item
                validateStatus={`${otpStatusMsg.status}`}
                help={otpStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
              <Input
                size="large"
                placeholder='Enter your OTP code'
                className="text-h4 md:text-h4-md w-full"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              </Form.Item>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-h4 md:text-h4-md mt-6"
              >
                New Password
              </label>
              <Form.Item
                validateStatus={`${passwordStatusMsg.status}`}
                help={passwordStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
              <Input.Password
                size="large"
                placeholder='Enter your password'
                className="text-h4 md:text-h4-md w-full"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </Form.Item>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-h4 md:text-h4-md mt-6"
              >
                Confirm Password
              </label>
              <Form.Item
                validateStatus={`${confirmPasswordStatusMsg.status}`}
                help={confirmPasswordStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
              <Input.Password
                size="large"
                placeholder='Enter your confirmed password'
                className="text-h4 md:text-h4-md w-full"
                required
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
              </Form.Item>
            </div>
            <div className="flex justify-center">
              <Button
                type="primary"
                className="w-full h-10 flex items-center justify-center mb-10 mt-4"
                onClick={() => handleResetPassword(otpCode, password, confirmedPassword)}
              >
                Reset Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default ResetEditPage;
