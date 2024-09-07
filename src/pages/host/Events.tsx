import { Context } from 'Router';
import { Select } from 'antd';
import PrimaryButton from 'components/PrimaryButton';
import EventDisplayer from 'components/event/EventDisplayer';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';
import apiRequest, { cancelAllRequests } from 'utils/api';

const Events: React.FC = () => {

  const { getters } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const [hostInfo, setHostInfo] = useState(null)
  const [currEvents, setCurrEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [currSort, setCurrSort] = useState('upcoming');
  const [pastSort, setPastSort] = useState('upcoming');
  
  const getHostInfo = async () => {
    setLoading(true)
    cancelAllRequests();
    const res = await apiRequest('GET', `/host/${getters.memberId}`)
    if (res.ok) {
      setHostInfo(res)
    }
    setLoading(false)
  }

  const getCurrEvents = async () => {
    const res = await apiRequest('POST', `/host/currEvents/${getters.memberId}`, { sort: currSort })
    if (res.ok) {
      setCurrEvents(res.eventListings)
    }
  }

  const getPastEvents = async () => {
    const res = await apiRequest('POST', `/host/pastEvents/${getters.memberId}`, { sort: pastSort })
    if (res.ok) {
      setPastEvents(res.eventListings)
    }
  }

  useEffect(() => {
    getHostInfo()
    getCurrEvents();
    getPastEvents();
  }, [])

  useEffect(() => {
    getCurrEvents();
    getPastEvents();
  }, [currSort, pastSort])

  const hostHasNotFilledProfile = () => {
    return (hostInfo?.orgName === '' || hostInfo?.orgEmail === '' || hostInfo?.description === '' || hostInfo?.banner === '' )
  }

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className='pt-[30px]'>
        <p className='text-h1 md:text-h1-md text-primary'>My Events</p>
        <br></br>
        <PrimaryButton onClick={() => navigate('/event/create')} disabled={hostHasNotFilledProfile()}>Create Event</PrimaryButton>
        {hostHasNotFilledProfile() && <p className='text-h6 text-red-500 md:text-h6-md'>You must complete your <span onClick={() => navigate('/host-dashboard')} className='hover:cursor-pointer underline '>Host Profile</span> before creating an event.</p>}
        <br></br><br></br><br></br>
        <div className='w-full'>
            <div className='flex flex-row justify-between'>
              <p className='text-h3 md:text-h3-md mb-3'>Current Event Listings</p>
              <Select
                className='!text-h6 !md:text-h6-md'
                size='large'
                style={{ width: 150 }}
                onChange={(e) => setCurrSort(e)}
                value={currSort}
                options={[
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Popular', value: 'mostLiked' },
                  { label: 'Lowest Price', value: 'lowestPrice' },
                  { label: 'Highest Price', value: 'highestPrice' },
                ]}
              />
            </div>
            {currEvents.length === 0 && <p className='text-h5 md:text-h5-md text-gray-500'>You have no current event listings!</p>}
            <EventDisplayer events={currEvents} />
            <br></br>
            {/* Past Events */}
            <div className='flex flex-row justify-between'>
              <p className='text-h3 md:text-h3-md mb-3'>Past Event Listings</p>
              <Select
                className='!text-h6 !md:text-h6-md'
                size='large'
                style={{ width: 150 }}
                onChange={(e) => setPastSort(e)}
                value={pastSort}
                options={[
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Popular', value: 'mostLiked' },
                  { label: 'Lowest Price', value: 'lowestPrice' },
                  { label: 'Highest Price', value: 'highestPrice' },
                ]}
              />
            </div>
            {pastEvents.length === 0 && <p className='text-h5 md:text-h5-md text-gray-500'>No past event listings!</p>}
            <EventDisplayer events={pastEvents} />
          </div>
      </div>
    )
  }
}

export default Events;
