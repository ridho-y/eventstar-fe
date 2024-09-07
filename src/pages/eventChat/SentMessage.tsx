import { Input, Tooltip } from 'antd';
import PrimaryButton from 'components/PrimaryButton';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from 'Router';
import { EditOutlined, DeleteOutlined, LinkOutlined, DownloadOutlined } from '@ant-design/icons'
import DefaultButton from 'components/DefaultButton';
import { chatDateTime, findFirstURL } from 'utils/helpers';
import DangerModal from 'components/DangerModal';

type Message = {
  messageId: number
  memberId: number
  dateTime: string
  username: string
  message: string
  files: string[]
  replyMessageId: number
  edited: boolean
  pinned: boolean
  deleted: boolean
  noLikes: number
  userInfo: {
    liked: boolean
  }
}

type SentMessageProps = {
  chatInfo: any
  message: Message
  replyTo: number
  hostId: number
  setReplyTo: React.Dispatch<React.SetStateAction<number>>
  messages: any
  socket: WebSocket
}

const SentMessage: React.FC<SentMessageProps> = ({ chatInfo, socket, message, replyTo, hostId, setReplyTo, messages }) => {

  const [liveLike, setLiveLike] = useState(message.userInfo.liked)
  const { getters } = useContext(Context)
  const [editMode, setEditMode] = useState(false)
  const [editMessageInput, setEditMessageInput] = useState(message.message)
  const [urlInfo, setUrlInfo] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false)
  // Search message if it has a link or a youtube link that it can display
  useEffect(() => {
    const getUrlInfo = async (firstUrl: string) => {
      try {
        const response = await fetch(`https://api.linkpreview.net/?key=${process.env.REACT_APP_LINK_PREVIEW}=${firstUrl}`, { method: 'GET' })
        const data = await response.json()
        if (response.status === 200) {
          localStorage.setItem(`eventstar-url-${firstUrl}`, JSON.stringify(data))
          setUrlInfo(data)
        }
      } catch (error) {
      }
    }

    const firstUrl = findFirstURL(message.message)
    if (firstUrl !== null && firstUrl !== undefined) {
      if (localStorage.getItem(`eventstar-url-${firstUrl}`) === undefined || localStorage.getItem(`eventstar-url-${firstUrl}`) === null) {
        getUrlInfo(firstUrl);
      } else {
        setUrlInfo(JSON.parse(localStorage.getItem(`eventstar-url-${firstUrl}`)))
      }
    }
  }, [])

  const editMessage = () => {
    const data = {
      token: `${getters.token}`,
      requestType: 'editMessage',
      eventListingId: chatInfo.eventListingId,
      messageId: message.messageId,
      message: editMessageInput
    }
    socket.send(JSON.stringify(data));
    setEditMessageInput(message.message);
    setEditMode(false);
  }

  const deleteMessage = () => {
    const data = {
      token: `${getters.token}`,
      requestType: 'deleteMessage',
      eventListingId: chatInfo.eventListingId,
      messageId: message.messageId,
    }
    socket.send(JSON.stringify(data));
    setDeleteModal(false)
  }

  const toggleLike = () => {
    const data = {
      token: `${getters.token}`,
      requestType: 'toggleLike',
      eventListingId: chatInfo.eventListingId,
      messageId: message.messageId,
    }
    socket.send(JSON.stringify(data));
    setLiveLike(l => !l)
  }

  const togglePin = () => {
    const data = {
      token: `${getters.token}`,
      requestType: 'togglePin',
      eventListingId: chatInfo.eventListingId,
      messageId: message.messageId,
    }
    socket.send(JSON.stringify(data));
  }


  return (
    <>
      <div>
        <div className='border-b-[1px] border-gray-200 mb-1 mx-4 py-1'></div>
        <main className={`flex flex-row justify-between ${(replyTo === message.messageId ? 'bg-gray-200 rounded' : '')}'`}>
          <section className='flex flex-col w-full px-3'>
            <div className='px-2 py-1'>
              {/* Reply Information */}
              {!message.deleted && message.replyMessageId !== null &&
                <div className='flex flex-row items-center'>
                  <svg viewBox="0 0 24 24" className='w-4 h-4 '><path d="m 13.969703,6.46967 c -0.2929,0.29289 -0.2929,0.76777 0,1.06066 L 17.689343,11.25 H 9.5000025 c -0.9534,0 -2.3667,0.2798 -3.5632,1.1413 -1.2348,0.8891 -2.1868,2.3643 -2.1868,4.6087 0,0.4142 0.3358,0.75 0.75,0.75 0.4142,0 0.75,-0.3358 0.75,-0.75 0,-1.7556 0.7147,-2.7804 1.5632,-3.3913 0.8868,-0.6385 1.9735,-0.8587 2.6868,-0.8587 h 8.1893405 l -3.71964,3.7197 c -0.2929,0.2929 -0.2929,0.7677 0,1.0606 0.29286,0.2929 0.76774,0.2929 1.06063,0 l 4.999999,-5 c 0.29289,-0.2929 0.29289,-0.7677 0,-1.0606 L 15.030333,6.46967 c -0.29289,-0.29289 -0.76777,-0.29289 -1.06063,0 z" fill="rgb(161,161,170)" /> </svg>
                  <p className='line-clamp-1 text-h6 md:text-h6-md text-gray-400 gap-2 ml-1 w-[60ch]'>
                    @{messages[message.replyMessageId].username} {messages[message.replyMessageId].message}
                  </p>
                </div>}
              {/* Name Information */}
              <div className='flex flex-row items-center gap-2'>
                <p className='text-h5 md:text-h5-md text-secondary-dark mb-1'><Tooltip title="Event Host">{message.memberId === hostId ? '🚨 ' : ''}</Tooltip>@{message.username}</p>
                <p className='text-h6 md:text-h6-md text-gray-400 mb-1'>{chatDateTime(message.dateTime)}</p>
                {!message.deleted && hostId === getters.memberId && <p onClick={togglePin} className='text-secondary-dark text-h6 md:text-h6-md hover:cursor-pointer hover:underline mb-1'>{(message.pinned ? 'Unpin' : 'Pin')}</p>}
              </div>
              {/* Message */}
              {editMode ?
                // Edit Mode
                <div className='flex flex-row gap-3'>
                  <Input size='small' placeholder='Edit your message...' className='text-h6 md:text-h6-md' onPressEnter={editMessage} onChange={(e) => setEditMessageInput(e.target.value)} value={editMessageInput} />
                  <PrimaryButton size='small' onClick={editMessage}>Save</PrimaryButton>
                  <DefaultButton size='small' onClick={() => { setEditMode(false); setEditMessageInput(message.message) }}>Cancel</DefaultButton>
                </div>
                :
                // Message
                <div className='flex flex-col'>
                  {/* Message and if Edited */}
                  <p className='text-h6 md:text-h6-md text-gray-800'>{message.deleted ? <p className='text-gray-400 italic'>{message.message}</p> : message.message}{!message.deleted && message.edited && <span className='italic text-gray-400'> (Edited)</span>}</p>
                  {/* Attachments */}
                  {message.files.length > 0 &&
                    <div className='flex flex-row mt-3 gap-3'>
                      {message.files.map((f, i) =>
                        <div key={i} onClick={() => window.open(f)} className='hover:cursor-pointer bg-white flex flex-row gap-3 items-center rounded border-[1px] border-gray-300 px-2'>
                          <p className="text-h6 md:text-h6-md text-primary">
                            {f.match(/XEVENTSTARX(.+)\?sv=.*$/)[1].length >= 50
                              ? `${f.match(/XEVENTSTARX(.+)\?sv=.*$/)[1].slice(0, 50)}...`
                              : f.match(/XEVENTSTARX(.+)\?sv=.*$/)[1]}
                          </p>
                          <DownloadOutlined className='text-h6 md:text-h6-md text-secondary' />
                        </div>)}
                    </div>
                  }
                  {/* URL Display */}
                  {urlInfo !== null &&
                    <div onClick={() => window.open(urlInfo.url)} className='hover:cursor-pointer flex flex-row mt-3 gap-3 border-[1px] border-gray-300 rounded items-center bg-white pr-3 overflow-hidden'>
                      <img src={urlInfo.image} className='md:w-32 md:h-16 w-20 h-8 object-cover rounded'></img>
                      <div className='flex flex-col w-full'>
                        <span className='line-clamp-1 text-h5 md:text-h5-md text-primary-light'><LinkOutlined /> {urlInfo.title}</span>
                        <p className='line-clamp-2 text-h6 md:text-h6-md text-gray-500'>{urlInfo.description}</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </section>
          {/* Message Controls */}
          <section className='flex flex-col justify-between items-end pr-5'>
            <div className='flex flex-row justify-end gap-1 items-end'>
              {(!message.deleted && message.memberId === getters.memberId) && <EditOutlined onClick={() => setEditMode(true)} className='text-secondary hover:cursor-pointer hover:bg-gray-200 rounded !h-6 px-1 transition' />}
              <DangerModal title={'Delete Message'} open={deleteModal} onOk={deleteMessage} onCancel={() => setDeleteModal(false)}>
                Are you sure you would like to delete this message?
              </DangerModal>
              {(!message.deleted && (message.memberId === getters.memberId || hostId === getters.memberId)) && <DeleteOutlined onClick={() => setDeleteModal(true)} className='text-red-400 hover:cursor-pointer hover:bg-gray-200 rounded !h-6 px-1 transition' />}
            </div>
            {/* Message Reply / Edit */}
            {!message.deleted &&
              <div className='flex flex-row justify-end items-end gap-3'>
                <p className='text-secondary-dark text-h6 md:text-h6-md hover:cursor-pointer hover:underline' onClick={() => setReplyTo(message.messageId)}>Reply</p>
                <p className='text-secondary-dark text-h6 md:text-h6-md whitespace-nowrap'><span onClick={toggleLike} className='hover:cursor-pointer hover:underline'>{liveLike ? 'Unlike' : 'Like'}</span> ({message.noLikes})</p>
              </div>
            }
          </section>
        </main>
      </div>
    </>
  )
}

export default SentMessage;