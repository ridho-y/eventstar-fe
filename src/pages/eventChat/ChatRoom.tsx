import { Button, Divider, Input, Modal, Upload } from 'antd';
import PrimaryButton from 'components/PrimaryButton';
import LocationPicker from 'components/home/LocationPicker';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from 'Router';
import ReplyIcon from '@mui/icons-material/Reply';
import { PushpinOutlined, DeleteOutlined, CloseOutlined, LikeOutlined, LikeFilled, UploadOutlined } from '@ant-design/icons'
import { BorderColorOutlined, DeleteOutlineOutlined, ModeEditOutlineOutlined } from '@mui/icons-material';
import TextInput from 'components/TextInput';
import { UploadFile2 } from 'pages/event/createEdit/UploadMedia';
import { generateUniqueFileName, uploadFiles } from 'utils/helpers';
import SentMessage from './SentMessage';
import DefaultModal from 'components/DefaultModal';
import { chatUrl } from 'utils/config';
import apiRequest from 'utils/api';
import LoadingPage from 'system/LoadingPage';
import { toast } from 'react-toastify';
import Page403 from 'system/Page403';

const ChatRoom: React.FC = () => {

  const { getters } = useContext(Context)
  const { eventListingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState(null)
  const [messages, setMessages] = useState(null)
  const [replyTo, setReplyTo] = useState<number>(null)
  const [message, setMessage] = useState('');
  const [fileList, setFileList] = useState<UploadFile2[]>([]);
  const [pinnedModal, setPinnedModal] = useState(false);
  const [socket, setSocket] = useState<WebSocket>();
  const [denied, setDenied] = useState(false)
  const [pick, setPick] = useState(false)
  const messagesEnd = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    setPick(false)
    let ws: WebSocket = null;
    if (eventListingId === undefined) {
      setPick(true)
    } else {
      new Promise(async (res, rej) => {
        setLoading(true)
        const response = await apiRequest('GET', `/eventChat/${eventListingId}`)
        if (response.ok) {
          setMessages(response.messages);
          setChatInfo(response.eventInfo)
          setDenied(false)
          res('');
        } else {
          rej('');
          setDenied(true)
        }
      })
        .then(() => {
          const url = `${chatUrl}/${eventListingId}`;
          ws = new WebSocket(url);

          // Connect once connection established
          ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'connect' }))
          };

          // Receive information from backend
          ws.onmessage = e => {
            const data = JSON.parse(JSON.parse(e.data));
            if (data.type === 'POST') {
              setMessages((messages: any) => { return { ...messages, [data.messageId]: { ...data.message, userInfo: { liked: false } } } })
            } else if (data.type === 'PUT' || data.type === 'DELETE') {
              setMessages((messages: { [x: string]: { userLiked: boolean; }; }) => { return { ...messages, [data.messageId]: { ...messages[data.messageId], ...data.message } } })
            }
          };
          setSocket(ws);
        })
        .finally(() => {
          setLoading(false)
          scrollToBottom();
        })
        .catch(() => { })
    }


    return () => {
      ws?.close();
    }
  }, [eventListingId]);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView();
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, replyTo])

  const sendMessage = async () => {
    if (message !== '' || fileList.length !== 0) {
      const fileUrls = await uploadFiles(fileList)
      const data = {
        token: `${getters.token}`,
        requestType: 'newMessage',
        eventListingId: chatInfo.eventListingId,
        message: message,
        files: fileUrls,
        replyMessageId: replyTo
      }
      socket.send(JSON.stringify(data))
      setMessage('');
      setFileList([]);
      setReplyTo(null);
    }
  }


  const newUpload = (info: any) => {
    let fileList = [...info.fileList];
    setFileList(fileList);
  };

  if (pick) {
    return (
      <div className='h-full w-full justify-center items-center'>
      </div>
    )
  } else if (loading) {
    return (
      <>
        <div className='w-full h-full justify-center items-center'>
          <LoadingPage />
        </div>
      </>
    )
  } else if (denied) {
    return <Page403 />
  } else {
    return (
      <main className='w-full h-full'>
        {/* Header */}
        <header className='flex flex-row justify-between items-center h-[60px] border-b-[1px] border-gray-200 px-5 gap-3 bg-gray-200'>
          <div className='flex justify-center items-center'>
            <img src={chatInfo.thumbnail} className='w-[40px] h-[40px] object-cover rounded-full'></img>
          </div>
          <div className='flex w-full justify-between items-center'>
            <p className='flex flex-row text-h3 md:text-h3-md text-secondary-dark'>{chatInfo.title}</p>
            <span className='flex flex-row gap-3'>
              <PushpinOutlined onClick={() => setPinnedModal(true)} className='text-secondary hover:cursor-pointer hover:bg-gray-300 px-1 rounded transition' />
              <Modal
                title='Pinned Messages'
                centered
                open={pinnedModal}
                footer={[]}
                bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
                onCancel={() => setPinnedModal(false)}
                width={1000}>
                <br></br>
                <section className='flex flex-col gap-5 mx-4'>
                  {Object.keys(messages).map((m) => messages[m]).filter(m => m.pinned && !m.deleted).map((m, i) => <SentMessage chatInfo={chatInfo} messages={messages} setReplyTo={setReplyTo} hostId={chatInfo.hostId} replyTo={replyTo} key={i} message={m} socket={socket} />)}
                </section>
                <div className='border-b-[1px] border-gray-200 mb-1 mx-7 mt-3 py-1'></div>
              </Modal>
              <PrimaryButton size='small' onClick={() => navigate(`/event/${chatInfo.eventListingId}`)}>View Event Listing</PrimaryButton>
            </span>
          </div>
        </header>
        {/* Messages Block */}
        <section className='justify-between flex flex-col h-[calc(100vh-200px)]'>
          {/* Messages */}
          <div className='h-full flex flex-col overflow-y-scroll'>
            {Object.keys(messages).map((messageId, i) => <SentMessage socket={socket} messages={messages} setReplyTo={setReplyTo} hostId={chatInfo.hostId} replyTo={replyTo} key={i} message={messages[messageId]} chatInfo={chatInfo} />)}
            <br ref={messagesEnd}></br>
          </div>
          {/* Reply To */}
          {replyTo !== null &&
            <section className='bg-gray-200 rounded-t-lg px-3 py-1 flex flex-row justify-between items-center'>
              <p className='text-h5 md:text-h5-md text-gray-700'>Replying to <span className='text-primary-dark'>@{messages[replyTo].username}</span></p>
              <CloseOutlined className='text-gray-500 hover:cursor-pointer' onClick={() => setReplyTo(null)} />
            </section>
          }
          {/* Message Bar */}
          <section className='border-t-[1px] border-gray-200 p-3'>
            {fileList.length > 0 && <div className='mb-5'>
              <Upload
                customRequest={({ onSuccess }) =>
                  onSuccess('ok')
                }
                onChange={newUpload}
                fileList={fileList}
                accept="image/png, image/jpeg, .pdf, .docx"
              >
              </Upload>
            </div>}
            <div className='flex flex-row items-center gap-3'>
              <Upload
                customRequest={({ onSuccess }) =>
                  onSuccess('ok')
                }
                listType="picture"
                onChange={newUpload}
                fileList={fileList}
                accept="image/png, image/jpeg, .pdf, .docx"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} disabled={fileList.length >= 3}></Button>
              </Upload>
              <Input size='middle' placeholder='Send a message...' className='text-h4 md:text-h4-md' onPressEnter={sendMessage} onChange={(e) => setMessage(e.target.value)} value={message} />
              <PrimaryButton size='middle' onClick={sendMessage}>Send</PrimaryButton>
            </div>
          </section>
        </section>
      </main>
    );
  }
};



export default ChatRoom;
