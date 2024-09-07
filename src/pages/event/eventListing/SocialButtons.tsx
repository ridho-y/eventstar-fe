import React, { useContext, useState } from 'react';
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import { Context } from 'Router';

type SocialButtonsProps = {
  reaction: string
  noLikes: number
  noDislikes: number
  eventListingId: number
}

const SocialButtons: React.FC<SocialButtonsProps> = ({ reaction, noLikes, noDislikes, eventListingId }) => {
  const { getters } = useContext(Context);
  const [liveLikes, setLiveLikes] = useState(noLikes)
  const [liveDislikes, setLiveDislikes] = useState(noDislikes)
  const [liveReaction, setLiveReaction] = useState(reaction)

  // API request to change event listing reaction status
  const react = async (reaction: 'like' | 'dislike' | 'none') => {
    const res = await apiRequest('PUT', `/eventListing/react/${eventListingId}`, { react: reaction })
    if (!res.ok) {
      toast.error('Unable to react')
    }
  }

  const changeLike = () => {
    if (getters.isLoggedIn && !getters.isHost) {
      setLiveReaction((r) => {
        if (r === 'like') {
          react('none')
          return 'none'
        } else {
          react('like')
          return 'like'
        }
      })
      setLiveLikes((liveLikes) => {
        if (liveReaction === 'like') {
          return liveLikes -= 1
        } else {
          return liveLikes += 1
        }
      })
      setLiveDislikes((liveDislikes) => {
        if (liveReaction === 'dislike') {
          return liveDislikes -= 1
        } else {
          return liveDislikes
        }
      })
    }
  }

  const changeDislike = () => {
    if (getters.isLoggedIn && !getters.isHost) {
      setLiveReaction((r) => {
        if (r === 'dislike') {
          react('none')
          return 'none'
        } else {
          react('dislike')
          return 'dislike'
        }
      })
      setLiveLikes((liveLikes) => {
        if (liveReaction === 'like') {
          return liveLikes -= 1
        } else {
          return liveLikes
        }
      })
      setLiveDislikes((liveDislikes) => {
        if (liveReaction === 'dislike') {
          return liveDislikes -= 1
        } else {
          return liveDislikes += 1
        }
      })
    }
  }

  return (
    <div className='mb-10 w-[80%] justify-end flex gap-5 items-center'>
      <div className='flex-col flex items-center'>
        {liveReaction === 'like'
          ? (getters.isLoggedIn && !getters.isHost
              ? <LikeFilled className='text-[25px] text-[#4381de] mb-1 hover:cursor-pointer hover:scale-125 transition' onClick={changeLike} />
              : <LikeFilled className='text-[25px] text-[#4381de] mb-1' />
            )
          : (getters.isLoggedIn && !getters.isHost
              ? <LikeOutlined className='text-[25px] text-[#4381de] mb-1 hover:cursor-pointer hover:scale-125 transition' onClick={changeLike} />
              : <LikeOutlined className='text-[25px] text-[#4381de] mb-1' />
            )
        }
        <p className='text-h6 md:text-h6-md text-gray-500 select-none'>{liveLikes}</p>
      </div>
      <div className='mr-3 flex-col flex items-center'>
        {liveReaction === 'dislike'
          ? (getters.isLoggedIn && !getters.isHost
              ? <DislikeFilled className='text-[25px] text-[#ff4c4c] mb-1 hover:cursor-pointer hover:scale-125 transition' onClick={changeDislike} />
              : <DislikeFilled className='text-[25px] text-[#ff4c4c] mb-1' />
            )
          : (getters.isLoggedIn && !getters.isHost
              ? <DislikeOutlined className='text-[25px] text-[#ff4c4c] mb-1 hover:cursor-pointer hover:scale-125 transition' onClick={changeDislike} />
              : <DislikeOutlined className='text-[25px] text-[#ff4c4c] mb-1' />
            )
        }
        <p className='text-h6 md:text-h6-md text-gray-500 select-none'>{liveDislikes}</p>
      </div>
    </div>
  )
};

export default SocialButtons;
