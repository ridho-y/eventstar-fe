import { Context } from 'Router';
import LocationPicker from 'components/home/LocationPicker';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';
import apiRequest from 'utils/api';
import { isMobileWidth } from 'utils/media';

const EventChatSideBar: React.FC = () => {

  const [loading, setLoading] = useState(true);
  const [chatPreviews, setChatPreviews] = useState([]);
  const [denied, setDenied] = useState(false)
  useEffect(() => {
    const getChatPreviews = async () => {
      setLoading(true)
      setDenied(false)
      const res = await apiRequest('GET', '/eventChat')
      if (res.ok) {
        setChatPreviews(res.eventChatPreviews)
      } else {
        setDenied(true)
      }
      setLoading(false)
    }
    getChatPreviews();
  }, [])

  if (denied) {
    return <></>
  } else if (loading) {
    return <LoadingPage />
  } else {
    return (
      <main className='sm:p-3 flex flex-col items-start min-w-fit sm:basis-1/4 border-r-[1px] border-gray-300 h-full gap-3 overflow-y-scroll'>
        {chatPreviews.map((cp, i) => <EventChatPreview eventChatPreview={cp} key={i} />)}
      </main>
    );
  }
};

type EventChatPreview = {
  eventListingId: number
  title: string
  thumbnail: string
}

type EventChatPreviewProps = {
  eventChatPreview: EventChatPreview
}

const EventChatPreview: React.FC<EventChatPreviewProps> = ({ eventChatPreview }) => {

  const { eventListingId } = useParams();
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState('');
  useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth()) setDeviceType("mobile");
      else setDeviceType("desktop");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main onClick={() => { if (+eventListingId !== eventChatPreview.eventListingId) { navigate(`/event/chat/${eventChatPreview.eventListingId}`) } }} className={`h-[70px] w-full rounded-lg flex flex-row md:justify-start justify-center items-center gap-2 px-4 ${(+eventListingId === eventChatPreview.eventListingId) ? ' bg-gray-200' : 'hover:cursor-pointer  hover:bg-gray-200 transition'}`}>
      {/* Image */}
      <div className='flex justify-center items-center w-fit'>
        <img src={eventChatPreview.thumbnail} className='lg:w-12 lg:h-12 w-7 h-7 object-cover rounded-full'></img>
      </div>

      {/* Information */}
      {deviceType === 'desktop' &&
        <div className='overflow-hidden'>
          <p className='text-h4 md:text-h4-md text-secondary-dark max-w-[25ch] overflow-ellipsis overflow-hidden line-clamp-1'>{eventChatPreview.title}</p>
          <p className='text-h6 md:text-h6-md text-gray-600 overflow-hidden line-clamp-1'>View Chat Room</p>
        </div>
      }
    </main>
  )
}

export default EventChatSideBar;
