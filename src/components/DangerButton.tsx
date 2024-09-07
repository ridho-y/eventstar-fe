import { Button } from 'antd';
import React from 'react';

type DangerButtonProps = {
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>
    className?: string
    children: React.ReactNode
}

const defaultProps: DangerButtonProps = {
  disabled: false,
  onClick: () => {},
  className: '',
  children: ''
}

const DangerButton: React.FC<DangerButtonProps> = ({ className, onClick, disabled, children }) => {
  return (
    <Button danger className={className} onClick={onClick} disabled={disabled}><p className='text-h5 md:text-h5-md'>{children}</p></Button>
  )
}

DangerButton.defaultProps = defaultProps;

export default DangerButton;
