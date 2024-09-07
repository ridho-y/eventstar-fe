import React, { useContext, useState } from 'react';
import PrimaryButton from 'components/PrimaryButton';
import { Card } from 'antd';
import { Context } from 'Router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiRequest from 'utils/api';

type HostCardProps = {
  orgName: string
  description: string
  noFollowers: number
  rating: number
  noEvents: number
  isFollowingHost: boolean
  hostId: number
  width: string
}

const HostCard: React.FC<HostCardProps> = ({ orgName, description, noFollowers, rating, noEvents, isFollowingHost, hostId, width }) => {

  const { getters } = useContext(Context);
  const navigate = useNavigate();

  if (description !== null && description.length > 200) {
    description = description.slice(0, 200) + '...'
  }

  const [liveFollow, setLiveFollow] = useState(isFollowingHost)
  const [liveFollowerCount, setLiveFollowerCount] = useState(noFollowers);
  const follow = async () => {
    setLiveFollow(f => !f)
    if (liveFollow) {
      setLiveFollowerCount(c => {
        c -= 1
        return c
      })
    } else {
      setLiveFollowerCount(c => {
        c += 1
        return c
      })
    }
    const res = await apiRequest('PUT', `/follow/${hostId}`)
    if (!res.ok) {
      toast.error('Unable to change follow')
      setLiveFollow(f => !f)
      if (liveFollow) {
        setLiveFollowerCount(c => {
          c -= 1
          return c
        })
      } else {
        setLiveFollowerCount(c => {
          c += 1
          return c
        })
      }
    }
  }

  return (
    <>
      <Card bordered={true} className={`flex justify-center items-center text-center w-${width} shadow-sm py-4`}>
        <p className='text-h1 md:text-h1 hover:text-secondary-dark transition line-animation hover:cursor-pointer select-none' onClick={() => navigate(`/host/${hostId}`)} >{orgName}</p>
        <p className='text-h4 md:text-h4'>{liveFollowerCount} Followers • {noEvents} Events • {rating} Star Rating </p>
        <p className='text-h4 md:text-h4 my-6'>{description}</p>
        {(!getters.isLoggedIn || (getters.isLoggedIn && getters.isHost)) && <PrimaryButton onClick={() => navigate(`/host/${hostId}`)}>Visit Profile</PrimaryButton>}
        {getters.isLoggedIn && !getters.isHost && <PrimaryButton onClick={follow}>{liveFollow ? 'Unfollow' : 'Follow'}</PrimaryButton>}
      </Card>
      <br></br><br></br>
    </>
  )

};

export default HostCard;