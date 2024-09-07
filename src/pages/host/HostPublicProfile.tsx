import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';
import { toast } from 'react-toastify';
import { Context } from 'Router';
import apiRequest, { cancelAllRequests } from 'utils/api';
import PrimaryButton from 'components/PrimaryButton';
import { Badge, Card, Select } from 'antd';
import Reviews from 'components/Reviews';
import EventDisplayer from 'components/event/EventDisplayer';
import Page404 from 'system/Page404';


const HostPublicProfile: React.FC = () => {
  const { getters } = useContext(Context);
  const { hostId } = useParams();
  const [loading, setLoading] = useState(true)
  const [currEvents, setCurrEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [hostInfo, setHostInfo] = useState(null)
  const [liveFollow, setLiveFollow] = useState(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(null)
  const [currSort, setCurrSort] = useState('relevance');
  const [pastSort, setPastSort] = useState('relevance');
  const [notExist, setNotExist] = useState(false);

  const getCurrEvents = async () => {
    const res = await apiRequest('POST', `/host/currEvents/${hostId}`, { sort: currSort })
    if (res.ok) {
      setCurrEvents(res.eventListings)
    }
  }

  const getPastEvents = async () => {
    const res = await apiRequest('POST', `/host/pastEvents/${hostId}`, { sort: pastSort })
    if (res.ok) {
      setPastEvents(res.eventListings)
    }
  }

  useEffect(() => {
    let ws: WebSocket = null;
    const getHostInfo = async () => {
      setLoading(true)
      cancelAllRequests();
      const res = await apiRequest('GET', `/host/${hostId}`)
      if (res.ok) {
        setHostInfo(res)
        setLiveFollow(res.noFollowers)
        setIsFollowing(res?.userInfo?.followsHost)
      } else {
        setNotExist(true)
      }
    }

    // Retrieve host information, current events and past events
    new Promise(async (res, rej) => {
      await getHostInfo()
      if (notExist) {
        rej('')
      } else {
        res('')
      }
    })
      .then(async () => {
        await getCurrEvents();
      })
      .then(async () => {
        await getPastEvents();
      })
      .then(() => {
        const url = `ws://localhost:8000/ws/followCount/${hostId}`;
        ws = new WebSocket(url);
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'connect' }))
        };

        ws.onmessage = e => {
          const data = JSON.parse(JSON.parse(e.data));
          setLiveFollow(data);
        };
        setLoading(false)
      })
      .catch(() => {})

    return () => ws?.close();
  }, [])

  useEffect(() => {
    getCurrEvents();
  }, [currSort])

  const changeFollow = async () => {
    const res = await apiRequest('PUT', `/follow/${hostId}`)
    setIsFollowing(f => !f)
    if (!res.ok) {
      toast.error('Unable to change follow')
      setIsFollowing(f => !f)
    }
  }

  if (loading) {
    return <LoadingPage />
  } else if (notExist) {
    return <Page404 />
  } else {
    return (
      <main className='flex flex-col items-center'>
        <div className='pt-[70px] w-[95%] md:w-[90%] flex flex-col items-center'>
          {/* Header */}
          <div className='h-[200px] w-full flex flex-row justify-end'>
            <div className='absolute z-10 float-right m-3 px-3 py-1 rounded bg-white'>
              <p className='text-gray-500 text-h5 md:text-h5-md'>Contact: <a href={`mailto: ${hostInfo.orgEmail}`} className='hover:underline hover:cursor-pointer hover:text-secondary-dark'>{hostInfo.orgEmail}</a></p>
            </div>
            <img src={hostInfo.banner} className='object-cover h-[200px] w-full'>
            </img>
          </div>
          <div className='bg-white z-10 rounded w-full flex flex-col items-start px-5 justify-center mt-[-10px] pb-5 relative'>
            <div className='mt-[-25px] bg-white rounded px-4 flex flex-row items-center'>
              <p className='text-h1 md:text-h1-md text-primary text-center'>{hostInfo.orgName}</p>
            </div>
            <p className='bg-white rounded text-h4 text-center md:text-h4-md text-gray-500'>{hostInfo.noEvents} Events • {hostInfo.rating} Star Rating {getters.isLoggedIn && !getters.isHost && <PrimaryButton className='ml-2' size='small' onClick={changeFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</PrimaryButton>}</p>
            <br></br>
            <p className='text-h5 md:text-h5-md text-center'>{hostInfo.description}</p>
            <div className='bg-white rounded px-4 flex flex-col items-center absolute right-4 z-10 top-[-25px] border-[1px] border-red-400'>
              <p className='text-h5 md:text-h5-md text-red-600'><Badge status="error" className='mr-2' />LIVE</p>
              <p className='text-h2 md:text-h2-md text-secondary-dark text-center'>{liveFollow}</p>
              <p className='text-h6 md:text-h6-md text-gray-600 text-center'>FOLLOWERS</p>
            </div>
          </div>
          <br></br><br></br><br></br>
          {/* Current Events */}
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
                  { label: 'Relevance', value: 'relevance' },
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
                  { label: 'Relevance', value: 'relevance' },
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
          <br />
          {hostInfo.reviews.length !== 0 &&
            <Card className='w-full'>
              <p className='text-h4 md:text-h4-md'>Reviews</p>
              <Reviews />
            </Card>
          }
          <br></br><br></br><br></br>
        </div>
      </main>
    )
  }
}

export default HostPublicProfile;
