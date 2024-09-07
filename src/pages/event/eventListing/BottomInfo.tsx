import React, { useContext, useEffect, useState } from 'react';
import PrimaryButton from 'components/PrimaryButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Bookmark } from '@mui/icons-material';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import { Context } from 'Router';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

type BottomInfoProps = {
  minimumCost: number
  ticketsLeft: number
  favourited: boolean
  eventListingId: number
  startDateTime: string
  cancelled: boolean
}

const BottomInfo: React.FC<BottomInfoProps> = ({ cancelled, startDateTime, minimumCost, ticketsLeft, favourited, eventListingId }) => {
  const { getters } = useContext(Context);
  const navigate = useNavigate();
  const [liveFavourite, setLiveFavourite] = useState(favourited)

  const favourite = async () => {
    setLiveFavourite(f => !f)
    const res = await apiRequest('PUT', `/eventListing/favourite/${eventListingId}`)
    if (!res.ok) {
      toast.error('Unable to change favourite')
      setLiveFavourite(f => !f)
    }
  }

  const tryBuyTickets = () => {
    if (cancelled) {
      toast.error('This event has been cancelled, you can no longer buy tickets')
    } else if (moment(startDateTime).isBefore()) {
      toast.error('This event has already started, you can no longer buy tickets')
    } else {
      navigate(`/event/book/${eventListingId}`)
    }
  }

  return (
    <section className='z-10 fixed bottom-0 h-16 bg-white border-t-[1px] border-gray-200 w-full flex flex-col justify-center items-center'>
      <div className='w-[90%] md:w-[80%] m-10 flex flex-row min-h-96 justify-between items-center py-2'>
        <span className='flex flex-col lg:flex-row lg:items-center justify-start w-full lg:gap-10'>
          <span className='text-h4 lg:text-h4-md'>🎟️&nbsp;&nbsp; Tickets starting at ${minimumCost}</span>
          <span className='text-h4 lg:text-h4-md'>🔥&nbsp;&nbsp; {ticketsLeft} tickets left</span>
          <span className='text-h4 lg:text-h4-md'>💰&nbsp;&nbsp; Hassle-free ticket refunds</span>
        </span>
        <span className='flex flex-row items-center gap-1 sm:gap-5'>
          {getters.isLoggedIn && !getters.isHost && moment(new Date(startDateTime)).isAfter() && <PrimaryButton onClick={tryBuyTickets}>Buy Tickets</PrimaryButton>}
          {(getters.isLoggedIn && !getters.isHost) &&
            (!liveFavourite ? <BookmarkBorderIcon titleAccess='Favourite this event' onClick={() => favourite()} fontSize='large' className='hover:cursor-pointer text-gray-400' /> : <Bookmark titleAccess='Un-favourite this event' onClick={() => favourite()} fontSize='large' className='hover:cursor-pointer text-[#ffc942]' />)
          }
        </span>
      </div>
    </section>
  )
};

export default BottomInfo;
