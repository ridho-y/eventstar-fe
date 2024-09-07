import React, { useEffect, useState } from 'react';
import { Card, Divider, Modal } from 'antd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PrimaryButton from 'components/PrimaryButton';
import DefaultModal from 'components/DefaultModal';
import { toast } from 'react-toastify';
import LoadingPage from 'system/LoadingPage';
import OrderPreview from './OrderPreview';
import DefaultButton from 'components/DefaultButton';
import apiRequest from 'utils/api';
import { useNavigate } from 'react-router-dom';
import HorizontalEventCard from 'components/search/HorizontalEventCard';

export type ConfirmPurchaseModalProps = {
  order: {
    reserveName: string
    quantity: number
    priceEach: number
    section?: string
  }[]
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  eventListingId: number
  percentageOff?: number,
  referralCode?: string
}

const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({ order, openModal, setOpenModal, eventListingId, percentageOff, referralCode }) => {

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await apiRequest('GET', '/profile')
      if (res.ok) {
        setUserInfo(res);
      }
      setLoading(false)
    }
    getUserInfo()
  }, [])

  if (loading) {
    return <></>
  } else {
    return (
      <Modal footer={[]} centered width={'90%'} title={<p className='text-h3 md:text-h3-md'>Confirm Purchase</p>} open={openModal} onCancel={() => setOpenModal(false)}>
        <br></br>
        <main className='flex lg:flex-row flex-col gap-5 px-5 py-5 justify-between'>
          <div className='shrink basis-2/3'>
            <p className='text-h4 md:text-h4-md mb-2'>1. Your Information</p>
            <section className='flex flex-row gap-3'>
              <div>
                <p className='text-h5 md:text-h5-md'><b>Name:</b></p>
                <p className='text-h5 md:text-h5-md'><b>E-mail:</b></p>
              </div>
              <div>
                <p className='text-h5 md:text-h5-md'>{userInfo.firstName} {userInfo.lastName}</p>
                <p className='text-h5 md:text-h5-md'>{userInfo.email}</p>
              </div>
            </section>
            <br></br><br></br>
            <p className='text-h4 md:text-h4-md mb-2'>2. Payment Information</p>
            <section className='flex flex-row'>
              {userInfo.balance < order.reduce((a, c) => c.priceEach * c.quantity + a, 0) ?
                <>
                  <p className='text-h5 md:text-h5-md text-red-500 mb-1'>You do not have sufficient funds in your balance.</p>
                  <p className='text-h5 md:text-h5-md text-red-500 hover:cursor-pointer underline ml-1' onClick={() => navigate('/profile/billing')}>Top Up Balance</p>
                </>
                :
                <p className='text-h5 md:text-h5-md'>You have sufficient funds in your balance.</p>
              }
            </section>
            <br></br>
            <br></br>
          </div>
          <div className='shrink flex-none'>
            <OrderPreview order={order} checkout={false} balance={userInfo.balance} eventListingId={eventListingId} percentageOff={percentageOff} referralCode={referralCode} isConfirmPage={true} />
          </div>
        </main>
      </Modal>
    )
  }
};



export default ConfirmPurchaseModal;
