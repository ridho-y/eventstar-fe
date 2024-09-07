import { Modal } from 'antd';
import React from 'react';

type DefaultModalProps = {
  title: React.ReactNode
  open: boolean
  onOk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  children: React.ReactNode
  okText?: React.ReactNode
  width?: number
}

const defaultProps: DefaultModalProps = {
  title: '',
  open: false,
  onOk: () => { },
  onCancel: () => { },
  children: '',
  okText: 'Ok'
}

const DefaultModal: React.FC<DefaultModalProps> = ({ title, open, onOk, onCancel, children, okText, width }) => {
  return (
    <Modal
      title={title}
      centered
      open={open}
      onOk={onOk}
      okText={okText}
      onCancel={onCancel}
      width={width}
    >
      <>
        {children}
        <br></br>
      </>
    </Modal>
  )
}

DefaultModal.defaultProps = defaultProps;

export default DefaultModal;
