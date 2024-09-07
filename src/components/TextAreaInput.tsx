import { Form } from 'antd';
import { Validation } from 'pages/profile/Information';
import React from 'react';
import TextArea from 'antd/es/input/TextArea';

type TextAreaInputProps = {
  name: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  value: string
  validation?: Validation
  rows: number
}

const defaultProps: TextAreaInputProps = {
  name: '',
  placeholder: '',
  onChange: () => { },
  value: '',
  validation: { status: '', msg: '' },
  rows: 4
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ name, placeholder, onChange, value, validation, rows }) => {
  return (
    <>
      <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>{name}</p>
      <Form.Item
        validateStatus={validation.status}
        help={validation.msg}
        hasFeedback
        className='!text-h4 !md:text-h4-md '
      >
        <TextArea rows={rows} placeholder={placeholder} className='whitespace-pre-wrap text-h4 md:text-h4-md' onChange={onChange} value={value}/>
      </Form.Item>
    </>
  )
}

TextAreaInput.defaultProps = defaultProps;

export default TextAreaInput;
