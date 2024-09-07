import { Form, Select } from 'antd';
import { Validation } from 'pages/profile/Information';
import React from 'react';

type SelectInputProps = {
  name: string
  placeholder: string
  onChange: (value: string) => void
  value: string
  validation?: Validation
  options: {
    value: string;
    label: string;
    }[],
  disabled?: boolean
}

const defaultProps: SelectInputProps = {
  name: '',
  placeholder: '',
  onChange: () => { },
  value: '',
  validation: { status: '', msg: '' },
  options: [],
  disabled: false
}

const SelectInput: React.FC<SelectInputProps> = ({ disabled, name, placeholder, onChange, value, validation, options }) => {
  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>{name}</p>
      <Form.Item
        validateStatus={validation.status}
        help={validation.msg}
        className='!text-h5 !md:text-h5-md'
        hasFeedback
      >
        <Select
          disabled={disabled}
          className='!text-h4 !md:text-h4-md'
          size='large'
          style={{ width: 200 }}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          options={options}
        />
      </Form.Item>
    </>
  )
}

SelectInput.defaultProps = defaultProps;

export default SelectInput;
