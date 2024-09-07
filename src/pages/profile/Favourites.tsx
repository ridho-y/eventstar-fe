import { Col, Row } from 'antd';
import EventCard from 'components/home/cards/EventCard';
import React, { useEffect, useState } from 'react';
import LoadingPage from 'system/LoadingPage';
import apiRequest, { cancelAllRequests } from 'utils/api';

const Favourites: React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [favs, setFavs] = useState([])

  useEffect(() => {
    setLoading(true)
    const getFavs = async () => {
      cancelAllRequests();
      const res = await apiRequest('GET', `/profile/favourites`)
      if (res.ok) {
        setFavs(res.eventListings);
      }
      setLoading(false)
    }
    getFavs();
  }, [])

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className='pt-[70px]'>
        <p className='text-h1 md:text-h1-md text-primary'>My Favourites</p>
        <br></br>
        {favs.length === 0 && <p className='text-h5 md:text-h5-md text-gray-500'>You have no favourites!</p>}
        <Row gutter={[24, 24]} className="mt-4 mb-8">
          {favs.map((card, i) => (
            <Col key={i} xs={24} sm={12} md={6}>
              <EventCard {...card} />
            </Col>
          ))}
        </Row>
        <br></br>
      </div>
    )
  }
}

export default Favourites;
