import React from 'react';
import DateTime from './DateTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

type DetailsProps = {
  startDateTime: string
  endDateTime: string
  type: string
  venue?: string
  location?: string
}

const Details: React.FC<DetailsProps> = ({ startDateTime, endDateTime, type, venue, location }) => {
  return (
    <>
      <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>Details</p>
      <div className='flex flex-row bg-gray-200 rounded justify-between gap-5 px-5 py-4'>
        <div className='flex-1 flex flex-col gap-5'>
          <DateTime startDateTime={startDateTime} endDateTime={endDateTime} />
        </div>
        <div className='flex-1 flex flex-col gap-5'>
          <span className='flex-1 flex flex-row items-center'><LocationOnIcon className='mr-3 text-primary-light' /><p className='text-h5 md:text-h5-md'>{(type === 'online' || type === 'inpersonSeated') ? (type === 'online' ? 'Online' : venue) : location}</p></span>
          <span className='flex-1 flex flex-row items-center'><BookOnlineIcon className='mr-3 text-primary-light' /><p className='text-h5 md:text-h5-md'>Mobile E-Ticket</p></span>
        </div>
      </div>
      <br></br><br></br>
    </>
  )
};

export default Details;
