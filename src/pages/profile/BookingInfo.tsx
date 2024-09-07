import React, { useEffect, useState } from 'react';
import { Badge, Descriptions } from 'antd';
import { toast } from 'react-toastify';
import apiRequest from 'utils/api';
import moment from 'moment';
import QRCode from "react-qr-code";
import DangerModal from 'components/DangerModal';
import { useNavigate } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';

type BookingInfoProps = {
  setShowBooking: React.Dispatch<any>
  booking: any
}

const BookingInfo: React.FC<BookingInfoProps> = ({ setShowBooking, booking }) => {
  const [loading, setLoading] = useState(false);
  const [eventStatus, setEventStatus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (booking.cancelled) {
      setEventStatus(<Badge status="error" text='Booking Cancelled - REFUNDED' />)
    } else if (moment(booking.eventInfo.endDateTime).isBefore()) {
      setEventStatus(<Badge status="error" text='Expired' />)
    } else if (moment(booking.eventInfo.endDateTime).isAfter() && moment(booking.eventInfo.startDateTime).isBefore()) {
      setEventStatus(<Badge status="warning" text='Event Live!' />)
    } else {
      setEventStatus(<Badge status="success" text={`Commences at ${moment(new Date(booking.eventInfo.startDateTime)).format('HH:mm DD/MM/YYYY')}`} />)
    }
  }, [])

  const cancelBooking = async () => {
    setLoading(true)
    const res = await apiRequest('DELETE', `/book/${booking.bookingId}`)
    if (res.ok) {
      toast.success('You have successfully cancelled your booking')
    }
    setLoading(false)
    setShowBooking(null)
  }

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className='pt-[22px] h-[300px]'>
        <span className='rounded bg-gray-200 hover:cursor-pointer px-3 py-1 text-h4 md:text-h4' onClick={() => setShowBooking(null)}>
          Back
        </span>
        <br></br><br></br><br></br><br></br>
        <Descriptions bordered>
          <Descriptions.Item label="Event" span={3}><p className='text-secondary-dark underline hover:cursor-pointer' onClick={() => navigate(`/event/${booking.eventInfo.eventListingId}`)}>{booking.eventInfo.title}</p></Descriptions.Item>
          <Descriptions.Item label="Billing Mode" span={3}>EventStar Balance</Descriptions.Item>
          <Descriptions.Item label="Booking Time" span={3}>{moment(new Date(booking.bookingDate)).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Booking Status" span={3}>
            {eventStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Event Date and Time" span={3}>{moment(new Date(booking.eventInfo.startDateTime)).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
          <Descriptions.Item label="Admission Tickets" span={3}>{booking.totalQuantity}</Descriptions.Item>
          {booking.referralCode !== '' && <Descriptions.Item label="Referral Code" span={3}>{booking.referralCode}</Descriptions.Item>}
          {booking.amountSaved !== 0 && <Descriptions.Item label="You Saved" span={3}>${booking.amountSaved}</Descriptions.Item>}
          <Descriptions.Item label="Total" span={3}>${booking.totalCost}</Descriptions.Item>
          <Descriptions.Item label="Ticket Information" span={3}>
            {booking.reserves.map((r: any, i: any) =>
              <div key={i}>
                <p>{r.tickets} x {r.reserve} Admission Tickets {r.reserve !== 'GA' && `at Seats ${r.seats.join(', ')}`}</p>
              </div>)}
          </Descriptions.Item>
          <Descriptions.Item label="Booking QR Code" span={3}>
            <div className='flex flex-col items-start justify-start h-full w-full '>
              <span className='bg-white px-3 py-2 rounded-lg flex flex-col items-center'>
                <p className='text-h4 md:text-h4-md text-gray-500'>#ESB-{booking.bookingId}</p>
                <div className='md:h-[110px] md:w-[110px] h-[60px] w-[60px]'>
                  <QRCode value={`#ESB-${booking.bookingId}`} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                </div>
              </span>
            </div>
          </Descriptions.Item>
          {!booking.cancelled && moment(booking.eventInfo.startDateTime).isAfter() && <Descriptions.Item label="Cancel Booking" span={3}><p onClick={() => setModalOpen(true)} className='text-red-500 hover:cursor-pointer hover:underline'>Cancel Booking</p></Descriptions.Item>}
        </Descriptions>
        <DangerModal width={'1000px'} title={'Cancel Booking'} open={modalOpen} onOk={cancelBooking} onCancel={() => setModalOpen(false)}>
          <br></br>
          <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>Oh no! It seems you're about to cancel your booking. Just a friendly heads-up:</p>
                <br></br>
                <div className='pl-5'>
                    <ul className='list-decimal ml-5'>
                        <li><span className='text-h5 md:text-h5-md'>Cancellation may result in dreams of sandy beaches fading away.</span></li>
                        <li><p className='text-h5 md:text-h5-md'>EventStarfish shed a single tear each time a booking gets canceled.</p></li>
                        <li><p className='text-h5 md:text-h5-md'>Your money will be refunded to your EventStar balance, but the memories will be missed.</p></li>
                    </ul>
                </div>
                <br></br>
                <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>If you still wish to proceed, we'll be here, but we'll miss you and your adventurous spirit!</p>
        </DangerModal>
        <br></br>
      </div>
    )
  }
}

export default BookingInfo;
