import { Button, Modal } from 'antd';
import React from 'react';

type DangerModalProps = {
  title: string
  open: boolean
  onOk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
  width?: string | number
}

const defaultProps: DangerModalProps = {
  title: '',
  open: false,
  onOk: () => { },
  onCancel: () => { },
  children: ''
}

const DangerModal: React.FC<DangerModalProps> = ({ title, open, onOk, onCancel, children, width}) => {
  return (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      width={width}
      okText={'Confirm'}
      okType={'danger'}
      onCancel={onCancel}
    >
      <>
        <p>{children}</p>
        <br></br>
      </>
    </Modal>
  )
}

DangerModal.defaultProps = defaultProps;

export default DangerModal;
