import React, { useContext, useEffect, useState } from 'react';
import { Context } from 'Router';
import LoadingPage from 'system/LoadingPage';
import Page403 from 'system/Page403';
import ReservesCard from './ReservesCard';
import { useParams } from 'react-router-dom';
import OrderPreview from './OrderPreview';
import QudosMapPreview from 'pages/event/createEdit/venuePreviews/QudosPreview';
import { getReservesAndSections } from 'utils/helpers';
import ReservesCardSeated from './ReservesSeated';
import RodLaverPreview from 'pages/event/createEdit/venuePreviews/RodLaverPreview';
import apiRequest from 'utils/api';

const Booking: React.FC = () => {

  const { getters } = useContext(Context);
  const { eventListingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [preBookingInfo, setPreBookingInfo] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [orderInfo, setOrderInfo] = useState([]);
  const [percentageOff, setPercentageOff] = useState(0);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    setLoading(true)
    const getPreBookingInfo = async () => {
      const res = await apiRequest('GET', `/eventListing/book/${eventListingId}`)
      if (res.ok) {
        if (res?.seated) {
          setOriginalData(res);
          setPreBookingInfo({ seated: { ...getReservesAndSections(res.seated.sections) }, eventInfo: { ...res.eventInfo } })
        } else {
          setPreBookingInfo(res);
        }
      }
      setLoading(false)
    }
    getPreBookingInfo();
  }, [])

  if (loading) {
    return <LoadingPage />
  } else if (!getters.isLoggedIn || getters.isHost) {
    return <Page403 />
  } else {
    return (
      <>
        <main className='flex flex-col items-center'>
            <div className='pt-[40px] w-[90%] md:w-[90%]'>
              <div className='flex lg:flex-row flex-col md:gap-0 gap-10'>
                <div className='lg:w-7/12 lg:border-r-[1px] border-gray-200 lg:pr-10 lg:pb-10'>
                  <p className='text-h1 md:text-h1-md text-primary'>Buy Tickets</p>
                  <p className='text-h4 md:text-h4-md pt-2 pl-[3px]'>Let's confirm your spot at {preBookingInfo.eventInfo.title} by {preBookingInfo.eventInfo.orgName}</p>
                  <br></br><br></br>
                  {preBookingInfo?.nonSeated && <ReservesCard setOrderInfo={setOrderInfo} reserves={preBookingInfo.nonSeated.reserves} />}
                  {preBookingInfo?.seated && (preBookingInfo.eventInfo.location === 'Qudos Bank Arena' ? <QudosMapPreview bookingMode={true} /> : <RodLaverPreview />)}
                </div>
                <div className='lg:w-5/12 lg:pl-10'>
                  {preBookingInfo?.seated && <><ReservesCardSeated orderInfo={orderInfo} setOrderInfo={setOrderInfo} reserves={preBookingInfo.seated} sections={originalData.seated.sections} /><br></br></>}
                  <OrderPreview order={orderInfo} checkout={true} eventListingId={preBookingInfo.eventInfo.eventListingId} percentageOff={percentageOff} setPercentageOff={setPercentageOff} isConfirmPage={false} referralCode={referralCode} setReferralCode={setReferralCode} />
                </div>
              </div>
            </div>
          <br></br><br></br>
        </main>
      </>
    )

  };
}

export default Booking;
