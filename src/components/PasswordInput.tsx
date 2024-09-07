import { Form, Input } from 'antd';
import { Validation } from 'pages/profile/Information';
import React from 'react';

type PasswordInputProps = {
  name: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
  validation?: Validation
}

const defaultProps: PasswordInputProps = {
  name: '',
  placeholder: '',
  onChange: () => { },
  value: '',
  validation: { status: '', msg: '' }
}

const PasswordInput: React.FC<PasswordInputProps> = ({ name, placeholder, onChange, value, validation }) => {
  return (
    <>
      <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>{name}</p>
      <Form.Item
        validateStatus={validation.status}
        help={validation.msg}
        hasFeedback
      >
        <Input.Password size="large" placeholder={placeholder} className='text-h4 md:text-h4-md' onChange={onChange} value={value} />
      </Form.Item>
    </>
  )
}

PasswordInput.defaultProps = defaultProps;

export default PasswordInput;
