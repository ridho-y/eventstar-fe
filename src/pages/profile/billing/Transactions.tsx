import React, { useEffect, useState } from 'react';
import apiRequest from 'utils/api';
import { Button, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import LoadingPage from 'system/LoadingPage';

type TransactionsProps = {
  transModal: boolean
  setTransModal: React.Dispatch<React.SetStateAction<boolean>>
}

interface DataType {
  key: string;
  dateTime: string;
  description: string;
  credit: number;
  debit: number;
  balance: number;
}

const Transactions: React.FC<TransactionsProps> = ({ transModal, setTransModal }) => {

  const [trans, setTrans] = useState([])
  const [loading, setLoading] = useState(true)
  const [currPage, setCurrPage] = useState(0)

  const columns: ColumnsType<DataType> = [
    {
      title: 'Date Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      render: (text) => <p className='text-h4 md:text-h4'>{moment(new Date(text)).format('HH:mm DD/MM/YYYY')}</p>,
      width: 200
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <p className='text-h4 md:text-h4'>{text}</p>,
      width: 400
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      key: 'credit',
      render: (text) => {
        if (text === 0) {
          return <></>
        } else {
          return <p className='text-h4 md:text-h4 text-green-600'>+${Number(text).toFixed(2)}</p>
        }
      },
      width: 100
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      key: 'debit',
      render: (text) => {
        if (text === 0) {
          return <></>
        } else {
          return <p className='text-h4 md:text-h4 text-red-500'>-${Number(text).toFixed(2)}</p>
        }
      },
      width: 100
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (text) => <p className='text-h4 md:text-h4'>${Number(text).toFixed(2)}</p>,
      width: 100
    },
  ];

  const getNext10 = () => {
    setCurrPage(c => c += 10)
  }

  const getPrev10 = () => {
    setCurrPage(c => c -= 10)
  }

  // Retrieve transactions
  useEffect(() => {
    const getTrans = async () => {
      setLoading(true)
      const res = await apiRequest('PUT', '/profile/transactions', { start: currPage })
      if (res.ok) {
        setTrans(res.transactions)
      }
      setLoading(false)
    }
    getTrans();
  }, [currPage])

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <Modal
        title='Transactions'
        centered
        open={transModal}
        footer={[]}
        bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
        onCancel={() => setTransModal(false)}
        width={1000}>
        <br></br>
        <Table pagination={false} size='small' columns={columns} dataSource={trans} />
        <br></br>
        <div className='flex flex-row justify-between items-center'>
          <Button disabled={currPage === 0} type='primary' size='small'><p className='text-h5 md:text-h5-md' onClick={getPrev10}>Prev 10</p></Button>
          <p className='text-h5 md:text-h5-md text-secondary-dark'>Page {currPage / 10}</p>
          <Button type='primary' size='small' disabled={trans.length === 0}><p className='text-h5 md:text-h5-md' onClick={getNext10}>Next 10</p></Button>
        </div>
      </Modal>
    )
  }
}

export default Transactions;
