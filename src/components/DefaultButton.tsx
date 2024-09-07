import { Button } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';

type DefaultButtonProps = {
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>
  className?: string
  children: React.ReactNode
  size?: SizeType
}

const defaultProps: DefaultButtonProps = {
  disabled: false,
  onClick: () => { },
  className: '',
  children: '',
  size: 'large'
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ className, onClick, disabled, children, size }) => {
  return (
    <Button size={size} type="default" className={className} disabled={disabled} onClick={onClick}><span className='text-h5 md:text-h5-md'>{children}</span></Button>
  )
}

DefaultButton.defaultProps = defaultProps;

export default DefaultButton;
