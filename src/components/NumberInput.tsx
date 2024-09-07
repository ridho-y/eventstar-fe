import { Form, InputNumber } from 'antd';
import { Validation } from 'pages/profile/Information';
import React from 'react';

type NumberInputProps = {
  name: string
  placeholder: string
  onChange: (value: string) => void
  value: string
  validation?: Validation
  addonBefore?: string
  disabled?: boolean
}

const defaultProps: NumberInputProps = {
  name: '',
  placeholder: '',
  onChange: () => { },
  value: '',
  validation: { status: '', msg: '' },
  addonBefore: null,
  disabled: false
}

const NumberInput: React.FC<NumberInputProps> = ({ disabled, name, placeholder, onChange, value, validation, addonBefore }) => {
  return (
    <>
      <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>{name}</p>
      <Form.Item
        validateStatus={validation.status}
        help={validation.msg}
        hasFeedback
      >
        <InputNumber disabled={disabled} addonBefore={addonBefore} size="large" placeholder={placeholder} className='text-h4 md:text-h4-md w-full' type='number' onChange={onChange} value={value} />
      </Form.Item>
    </>
  )
}

NumberInput.defaultProps = defaultProps;

export default NumberInput;
