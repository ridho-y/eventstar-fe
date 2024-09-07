import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import { Form, Input, Button } from 'antd';
import { Validation } from 'pages/profile/Information';
import LoadingPage from 'system/LoadingPage';

const ResetRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const [emailStatusMsg, setEmailStatusMsg] = useState<Validation>({
    status: "",
    msg: "",
  });
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    if (email === "") {
      setEmailStatusMsg({
        status: "error",
        msg: "Email cannot be empty",
      });
    } else {
      setEmailStatusMsg({ status: "", msg: "" });
    }
    if (email !== '') {
      const payload = { email };
      setLoading(true)
      await apiRequest('POST', '/auth/reset/email', payload)
        .then((res) => {
          if (res.ok) {
            toast.success('Successfully sent reset password email');
            navigate(`/reset/password/complete/${email}`);
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
    setLoading(false)
  };

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="max-w-md p-8 bg-white shadow-m rounded-lg">
          <h2 className="text-h2 md:text-h2-md pt-10 font-semibold mb-6 text-center">
            Reset Your Password
          </h2>
          <p className="text-h4 md:text-h4-md text-left mb-10">
            Enter your email address associated with your account and we will send
            you a link to reset your password.
          </p>
  
          <form className="space-y-4" onSubmit={() => handleResetPassword(email)}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-h4 md:text-h4-md font-medium mt-6"
              >
                Email
              </label>
              <Form.Item
                validateStatus={`${emailStatusMsg.status}`}
                help={emailStatusMsg.msg}
                className="!text-h5 !md:text-h5-md"
                hasFeedback
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="text-h4 md:text-h4-md"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Form.Item>
            </div>
            <div className="pb-10">
              <Button
                type="primary"
                className="w-full h-10 flex items-center justify-center"
                onClick={() => handleResetPassword(email)}
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default ResetRequestPage;
