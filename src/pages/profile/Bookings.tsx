import { DatePicker, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import LoadingPage from 'system/LoadingPage';
import apiRequest, { cancelAllRequests } from 'utils/api';
import QRCode from "react-qr-code";
import moment from 'moment';
import BookingInfo from './BookingInfo';

const Bookings: React.FC = () => {

  const [showBooking, setShowBooking] = useState(null);
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')

  const getBookings = async (dateStart: string, searchstr: string) => {
    setLoading(true)
    cancelAllRequests();
    let body = {}
    if (dateStart !== '') {
      body = { ...body, dateStart }
    }
    if (searchstr !== '') {
      body = { ...body, searchstr }
    }
    const res = await apiRequest('POST', '/book/all', body)
    if (res.ok) {
      console.log(res.bookings)
      setBookings(res.bookings)
    }
    setLoading(false)
  }

  useEffect(() => {
      const i = setTimeout(() => {
        const isoDate = date.split(('/')).reverse().join('-')
        getBookings(isoDate, search)
      }, 1000)
      return () => clearTimeout(i)
  }, [search, date])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (showBooking !== null) {
    return <BookingInfo setShowBooking={setShowBooking} booking={bookings[showBooking]} />
  } else {
    return (
      <div className='pt-[70px]'>
        <p className='text-h1 md:text-h1-md text-primary'>My Bookings</p>
        <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>View all your bookings here</p>
        <br></br><br></br>
        <div className='flex flex-row justify-between items-center'>
          <span className='flex flex-row gap-3 items-center'>
            <Input placeholder="Search bookings" value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
          <span className='flex flex-row gap-3 items-center'>
            <p className='text-gray-500 text-h5 md:text-h5-md'>Bookings After: </p><DatePicker format={'DD/MM/YYYY'} onChange={(_, d) => setDate(d)} />
          </span>
        </div>
        <br></br>
        {loading ? <LoadingPage /> :
          <main className='flex flex-col gap-10'>
            {bookings.length === 0 && <p className='pl-[3px] text-h5 md:text-h5-md text-gray-500'>No bookings!</p>}
            {bookings.map((b, i) =>
              <div key={i} onClick={() => setShowBooking(i)} className={`bg-[#ffffff] ${b.cancelled && 'cancelled-bg'} rounded-2xl ${moment(b.eventInfo.endDateTime).isBefore() && 'expired-bg'} shadow-lg h-[170px] justify-between w-full flex flex-row gap-5 hover:scale-[1.01] hover:cursor-pointer transition`}>
                <span className='flex flex-row gap-5'>
                  <section className='md:w-[200px] w-[100px] h-full'>
                    <img src={b.eventInfo.thumbnail} className='object-cover w-full h-full rounded-l-2xl'></img>
                  </section>
                  <section className='flex flex-col py-3 justify-center'>
                    <div className='text-h2 md:text-h2-md text-secondary-dark'>{(b.eventInfo.title)}</div>
                    {b.cancelled ? <p className='text-h4 md:text-h4-md text-red-500'>BOOKING CANCELLED - REFUNDED</p> : <br></br>}
                    <div className='text-h5 md:text-h5-md'>{(new Date(b.eventInfo.startDateTime)).getHours()}:{(new Date(b.eventInfo.startDateTime)).getMinutes().toString().length === 1 ? (new Date(b.eventInfo.startDateTime)).getMinutes().toString() + '0' : (new Date(b.eventInfo.startDateTime)).getMinutes()} {days[(new Date(b.eventInfo.startDateTime)).getDay()]}, {(new Date(b.eventInfo.startDateTime)).getDate()} {months[(new Date(b.eventInfo.startDateTime)).getMonth()]} {(new Date(b.eventInfo.startDateTime)).getFullYear()}</div>
                    <div className='text-h5 md:text-h5-md'>{b.eventInfo?.location ? b.eventInfo?.location : 'Online'}</div>
                    <div className='text-h5 md:text-h5-md text-gray-600'>{b.totalQuantity} Admission Ticket{b.totalQuantity > 1 && 's'}</div>
                  </section>
                </span>
                <section className='w-1/3 flex flex-col justify-start items-center h-full border-l-[1px] border-dashed border-gray-300 p-5'>
                  <div className='flex flex-col items-center justify-center h-full w-full '>
                    <span className='bg-white px-3 py-2 rounded-lg flex flex-col items-center'>
                      <p className='text-h4 md:text-h4-md text-gray-500'>#ESB-{b.bookingId}</p>
                      <div className='md:h-[110px] md:w-[110px] h-[60px] w-[60px]'>
                        <QRCode value={`#ESB-${b.bookingId}`} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                      </div>
                    </span>
                  </div>
                </section>
              </div>
            )}
          </main>
        }
        <br></br><br></br>
      </div>
    )
  }
}

export default Bookings;
