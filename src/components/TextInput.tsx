import { Form, Input } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Validation } from 'pages/profile/Information';
import React from 'react';

type TextInputProps = {
  name: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  value: string
  validation?: Validation
  disabled?: boolean
  size?: SizeType
}

const defaultProps: TextInputProps = {
  name: '',
  placeholder: '',
  onChange: () => { },
  value: '',
  validation: { status: '', msg: '' },
  disabled: false,
  size: 'large'
}

const TextInput: React.FC<TextInputProps> = ({ size, disabled, name, placeholder, onChange, value, validation }) => {
  return (
    <>
      <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>{name}</p>
      <Form.Item
        validateStatus={validation.status}
        help={validation.msg}
        hasFeedback
      >
        <Input disabled={disabled} size={size} placeholder={placeholder} className='text-h4 md:text-h4-md' onChange={onChange} value={value} />
      </Form.Item>
    </>
  )
}

TextInput.defaultProps = defaultProps;

export default TextInput;
