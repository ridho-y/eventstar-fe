import React, { useContext, useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Card, Collapse } from 'antd';
import { CollapseProps } from 'antd/es/collapse/Collapse';
import LoadingPage from 'system/LoadingPage';
import EditBillingInfo from './EditBillingInfo';
import { toast } from 'react-toastify';
import apiRequest, { cancelAllRequests } from 'utils/api';
import PrimaryButton from 'components/PrimaryButton';
import DefaultModal from 'components/DefaultModal';
import NumberInput from 'components/NumberInput';
import SelectInput from 'components/SelectInput';
import { Validation } from '../Information';
import { Context } from 'Router';
import Transactions from './Transactions';
import { useLocation } from 'react-router-dom';

export type BillingAddress = {
  firstName: string,
  lastName: string,
  country: string,
  streetLine1: string,
  streetLine2: string,
  suburb: string,
  state: string,
  postcode: number,
  email: string,
  phone: string
}

export type BillingInfo = {
  billingNumDisplayed?: number
  billingId: number,
  cardNumber: string,
  expiryMonth: number,
  expiryYear: number,
  billingAddress: BillingAddress
}

type BillingInfoProps = {
  billingInfo: BillingInfo,
  isHost: boolean
}

type BillingProps = {
  isHost: boolean
}

const Billing: React.FC<BillingProps> = ({ isHost }) => {

  const { getters } = useContext(Context);
  const [billingData, setBillingData] = useState<BillingInfo[]>([]);
  const [liveBalance, setLiveBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [topUpModal, setTopUpModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  // if -1: not edit mode, if 3: edit billing id 3!
  const [editBillingId, setEditBillingId] = useState<number[]>(null);
  const [amount, setAmount] = useState(null);
  const [amountSV, setAmountSV] = useState<Validation>({ status: '', msg: '' })
  const [billingIdInput, setBillingIdInput] = useState(null);
  const [billingIdInputSV, setBillingIdInputSV] = useState<Validation>({ status: '', msg: '' })
  const [balLoading, setBalLoading] = useState(false)
  const [transModal, setTransModal] = useState(false)
  const location = useLocation();

  const checks = () => {
    return new Promise((res, rej) => {
      if (amount === null || amount <= 0) {
        setAmountSV({ status: 'error', msg: 'Invalid amount' })
        rej('Invalid amount');
      } else {
        setAmountSV({ status: '', msg: '' })
      }

      if (billingIdInput === null) {
        setBillingIdInputSV({ status: 'error', msg: 'You must select a billing ID' })
        rej('You must select a billing ID')
      } else {
        setBillingIdInputSV({ status: '', msg: '' })
      }
      res('');
    })
  }

  const topUp = () => {
    checks()
      .then(async () => {
        if (amountSV.status === '' && billingIdInputSV.status === '') {
          setBalLoading(true)
          const res = await apiRequest('PUT', '/profile/balance', { billingId: +billingIdInput, amount })
          if (res.ok) {
            toast.success(`Successfully topped up ${amount} to balance`)
            setBillingIdInput(null);
            setAmount(0);
            setLiveBalance(b => b += amount)
            setTopUpModal(false)
          }
          setBalLoading(false)
        }
      })
      .catch(() => { })
  }

  const withdraw = () => {
    checks()
      .then(async () => {
        if (amountSV.status === '' && billingIdInputSV.status === '') {
          setBalLoading(true)
          const res = await apiRequest('POST', '/profile/balance', { billingId: +billingIdInput, amount })
          if (res.ok) {
            toast.success(`Successfully withdrew ${amount}`)
            setBillingIdInput(null);
            setAmount(0);
            setLiveBalance(b => b -= amount)
            setWithdrawModal(false)
          }
          setBalLoading(false)
        }
      })
      .catch(() => { })
  }

  useEffect(() => {
    if (editBillingId === null) {
      setLoading(true)
    }
    const getAllBillingInfo = async () => {
      cancelAllRequests();
      const res = await apiRequest('GET', '/profile/billingInformation')
      if (res.ok) {
        setBillingData(res.billingInfo);
        setLiveBalance(res.balance);
        setLoading(false);
      }
    }
    getAllBillingInfo();
  }, [editBillingId])

  const editBillingInfo = (billingId: number, billingNumDisplayed: number) => (
    <>
      <EditOutlined
        onClick={(event) => {
          event.stopPropagation();
          setEditBillingId([billingId, billingNumDisplayed]);
        }}
        className='hover:bg-gray-300 rounded p-1 transition text-h4 md:text-h4-md'
      />
    </>
  );

  const newBilling = () => {
    setEditBillingId([null, null]);
  }

  // Billing Items for Collapse
  const billingItems: CollapseProps['items'] = []

  for (let i = 0; i < billingData.length; i++) {
    billingItems.push({
      key: `${i + 1}`,
      label: `${isHost ? 'Payment' : 'Billing'} Information ${i + 1}`,
      children: <BillingInfo billingInfo={{ ...billingData[i], billingNumDisplayed: i + 1 }} isHost={isHost} />,
      extra: editBillingInfo(billingData[i].billingId, i + 1)
    })
  }

  if (loading) {
    return <LoadingPage />
  } else if (editBillingId !== null) {
    return <EditBillingInfo billingId={editBillingId[0]} billingNumDisplayed={editBillingId[1]} setEditBillingId={setEditBillingId} isHost={isHost} />
  } else {
    return (
      <div className={`pt-[${(location.pathname.startsWith('/host-dashboard') ? '30px' : '70px')}]`}>
        <p className='text-h1 md:text-h1-md text-primary'>Balance and {isHost ? 'Payment Information' : 'Billing Information'}</p>
        <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>You can view, update, or edit your {isHost ? 'payment information' : 'billing information'} here</p>
        <br /><br />
        <Card className='max-w-[400px]'>
          <div className='flex flex-col justify-center'>
            <span className='flex flex-row justify-between items-center'>
              <p className='text-h4 md:text-h4-md text-primary-dark'>Your EventStar Balance</p>
              <p className='text-h6 md:text-h6-md text-gray-600 hover:cursor-pointer hover:underline' onClick={() => setTransModal(true)}>View Transactions</p>
              <Transactions transModal={transModal} setTransModal={setTransModal} />
            </span>
            <br></br><br></br>
            <p className='text-h1 md:text-h1-md text-secondary-light'>${Number(liveBalance).toFixed(2)}</p>
            <br></br><br></br>
            <div className='flex flex-row justify-between'>
              <p className='text-h4 md:text-h4 text-secondary-dark hover:cursor-pointer hover:underline' onClick={() => setTopUpModal(true)}>Top Up Balance</p>
              <p className='text-h4 md:text-h4 text-red-500 hover:cursor-pointer hover:underline' onClick={() => setWithdrawModal(true)}>Withdraw Balance</p>
            </div>
          </div>
        </Card>
        <DefaultModal title={'Top Up Balance'} open={topUpModal} okText='Top Up' onOk={topUp} onCancel={() => { setTopUpModal(false); setAmount(null); setBillingIdInput(null); setAmountSV({ status: '', msg: '' }); setBillingIdInputSV({ status: '', msg: '' }) }}>
          {balLoading ?
            <LoadingPage />
            :
            <>
              <br></br>
              <NumberInput validation={amountSV} name={'Top Up Amount'} placeholder={'Amount'} addonBefore='$' onChange={(v) => setAmount(v)} value={amount} />
              <SelectInput validation={billingIdInputSV} name={`Select ${getters.isHost ? 'Payment Information' : 'Billing Information'}`} placeholder={`Select ${getters.isHost ? 'Payment' : 'Billing'}`} onChange={(v: string) => setBillingIdInput(v)} value={billingIdInput} options={billingData.map((b, i) => { return { label: `${getters.isHost ? 'Payment' : 'Billing'} ${i + 1}`, value: b.billingId.toString() } })}></SelectInput>
            </>}
        </DefaultModal>
        <DefaultModal title={'Withdraw Balance'} open={withdrawModal} okText='Withdraw' onOk={withdraw} onCancel={() => { setWithdrawModal(false); setAmount(null); setBillingIdInput(null); setAmountSV({ status: '', msg: '' }); setBillingIdInputSV({ status: '', msg: '' }) }}>
          {balLoading ?
            <LoadingPage />
            :
            <>
              <br></br>
              <NumberInput validation={amountSV} name={'Withdraw Amount'} placeholder={'Amount'} addonBefore='$' onChange={(v) => setAmount(v)} value={amount} />
              <SelectInput validation={billingIdInputSV} name={`Select ${getters.isHost ? 'Payment Information' : 'Billing Information'}`} placeholder={`Select ${getters.isHost ? 'Payment' : 'Billing'}`} onChange={(v: string) => setBillingIdInput(v)} value={billingIdInput} options={billingData.map((b, i) => { return { label: `${getters.isHost ? 'Payment' : 'Billing'} ${i + 1}`, value: b.billingId.toString() } })}></SelectInput>
            </>}
        </DefaultModal>
        <br></br><br></br>
        <main className='md:max-w-3xl w-full'>
          {billingItems.length > 0 &&
            <>
              <Collapse
                defaultActiveKey={['1']}
                items={billingItems}
              />
              <br />
            </>
          }
        </main>
        <PrimaryButton onClick={newBilling}>Add New {isHost ? 'Payment Information' : 'Billing Information'}</PrimaryButton>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    )
  }
}

const BillingInfo: React.FC<BillingInfoProps> = ({ billingInfo, isHost }) => {
  const { cardNumber, expiryMonth, expiryYear, billingAddress } = billingInfo
  const { firstName, lastName, country, streetLine1, streetLine2, suburb, state, postcode, email, phone } = billingAddress;
  return (
    <main className='flex flex-row ml-2'>
      <div className='basis-2/3'>
        <p className='text-h4 md:text-h4-md'>Card Information</p>
        <p className='text-h5 md:text-h5-md'>Card Number: {cardNumber}</p>
        <p className='text-h5 md:text-h5-md'>Expiry: {expiryMonth}/{expiryYear}</p>
        <br />
        <p className='text-h4 md:text-h4-md'>Contact Information</p>
        <p className='text-h5 md:text-h5-md'>Email: {email}</p>
        <p className='text-h5 md:text-h5-md'>Phone: {phone}</p>
      </div>
      <div className='basis-1/3'>
        <p className='text-h4 md:text-h4-md'>{isHost ? '' : 'Billing '}Address</p>
        <p className='text-h5 md:text-h5-md'>{firstName} {lastName}</p>
        <p className='text-h5 md:text-h5-md'>{streetLine1}</p>
        <p className='text-h5 md:text-h5-md'>{streetLine2}</p>
        <p className='text-h5 md:text-h5-md'>{suburb} {state} {postcode}</p>
        <p className='text-h5 md:text-h5-md'>{country}</p>
      </div>
    </main>
  )
}

export default Billing;
