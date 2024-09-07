import { Card } from 'antd';
import PrimaryButton from 'components/PrimaryButton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';
import apiRequest, { cancelAllRequests } from 'utils/api';

const Following: React.FC = () => {

  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowing = async () => {
      cancelAllRequests();
      setLoading(true)
      const res = await apiRequest('GET', '/profile/following')
      if (res.ok) {
        setFollowing(res.following)
      }
      setLoading(false)
    }
    getFollowing();
  }, [])

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className='pt-[70px]'>
        <p className='text-h1 md:text-h1-md text-primary'>Following</p>
        <br></br>
        {following.length === 0 && <p className='text-h5 md:text-h5-md text-gray-500'>You do not follow any hosts</p>}
        <div className='flex flex-col gap-5'>
          {following.map((f, i) =>
            <Card>
              <div key={i} className='flex flex-row justify-between items-center'>
                <p className='text-h4 md:text-h4-md text-secondary-dark'>{f.orgName}</p>
                <PrimaryButton onClick={() => navigate(`/host/${f.hostId}`)}>Profile</PrimaryButton>
              </div>
            </Card>
          )}
        </div>
      </div>
    )
  }
}

export default Following;
