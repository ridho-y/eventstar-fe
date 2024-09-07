import { Button } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';

type PrimaryButtonProps = {
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>
  className?: string
  children: React.ReactNode
  size?: SizeType
}

const defaultProps: PrimaryButtonProps = {
  disabled: false,
  onClick: () => { },
  className: '',
  children: '',
  size: 'middle'
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ size, className, onClick, disabled, children }) => {
  return (
    <Button type="primary" size={size} className={className} disabled={disabled} onClick={onClick}><span className='text-h5 md:text-h5-md'>{children}</span></Button>
  )
}

PrimaryButton.defaultProps = defaultProps;

export default PrimaryButton;
