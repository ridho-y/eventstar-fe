import React, { useContext, useState } from 'react';
import { FormOutlined, CloseCircleOutlined, NotificationOutlined, LineChartOutlined, SolutionOutlined } from '@ant-design/icons'
import { Context } from 'Router';
import { useNavigate } from 'react-router-dom';
import DangerModal from 'components/DangerModal';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import DefaultModal from 'components/DefaultModal';
import TextInput from 'components/TextInput';
import TextAreaInput from 'components/TextAreaInput';
import { Validation } from 'pages/profile/Information';
import moment from 'moment';
import LoadingPage from 'system/LoadingPage';

type EventCreatorSettingsProps = {
  hostId: number
  eventListingId: number
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  surveyMade: boolean
  editable: boolean
  cancelled: boolean
  endDateTime: string
  startDateTime: string
}

const EventCreatorSettings: React.FC<EventCreatorSettingsProps> = ({ surveyMade, startDateTime, endDateTime, cancelled, editable, setLoading, hostId, eventListingId }) => {
  const { getters } = useContext(Context);
  const navigate = useNavigate();
  const [modal2Open, setModal2Open] = useState(false);
  const [announceModal, setAnnounceModal] = useState(false);
  const [title, setTitle] = useState('');
  const [titleSV, setTitleSV] = useState<Validation>({ status: '', msg: '' });
  const [msg, setMsg] = useState('');
  const [msgSV, setMsgSV] = useState<Validation>({ status: '', msg: '' });
  const [liveSurveyMade, setLiveSurveyMade] = useState(surveyMade);
  const [announceLoading, setAnnounceLoading] = useState(false)

  const deleteEvent = async () => {
    setLoading(true);
    const res = await apiRequest('DELETE', `/eventListing/${eventListingId}`)
    if (res.ok) {
      navigate('/host-dashboard');
      setModal2Open(false);
      toast.success('Event cancelled');
    }
    setLoading(false)

  }

  const editEvent = () => {
    if (!editable) {
      toast.error('You can no longer edit this listing as tickets have been purchased for this event')
    } else if (cancelled) {
      toast.error('You cannot edit a cancelled event')
    } else if (moment(endDateTime).isBefore()) {
      toast.error('This event is over')
    } else {
      navigate(`/event/edit/${eventListingId}`)
    }
  }

  const tryCancel = () => {
    if (cancelled) {
      toast.error('This event is already cancelled')
    } else if (moment(startDateTime).isBefore()) {
      toast.error('This event has already started')
    } else {
      setModal2Open(true)
    }
  }

  const tryMakeAnnouncement = () => {
    if (cancelled) {
      toast.error('This event is cancelled')
    } else if (moment(endDateTime).isBefore()) {
      toast.error('This event is over')
    } else {
      setAnnounceModal(true)
    }
  }

  const createSurvey = () => {
    if (cancelled) {
      toast.error('This event is cancelled')
    } else if (moment(startDateTime).isBefore()) {
      toast.error('This event has already started')
    } else {
      navigate(`/event/survey/create/${eventListingId}`)
    }
  }

  const [delSurveyModal, setDelSurveyModal] = useState(false);
  const [delModalLoading, setDelModalLoading] = useState(false);
  const deleteSurvey = () => {
    if (cancelled) {
      toast.error('This event is cancelled')
    } else if (moment(startDateTime).isBefore()) {
      toast.error('This event has already started')
    } else {
      setDelSurveyModal(true);
    }
  }

  const deleteSurveyApi = async () => {
    setDelModalLoading(true)
    const res = await apiRequest('DELETE', `/survey/${eventListingId}`)
    if (res.ok) {
      toast.success('successfully deleted survey');
      setDelModalLoading(false);
      setLiveSurveyMade(false);
    }
    setDelModalLoading(false)
  }

  const tryNavigateAnalytics = () => {
    navigate(`/event/analytics/${eventListingId}`)
  }

  const makeAnnouncement = async () => {
    if (title !== '') {
      setTitleSV({ status: '', msg: '' })
    } else {
      setTitleSV({ status: 'error', msg: 'You must provide a subject' })
    }

    if (msg !== '') {
      setMsgSV({ status: '', msg: '' })
    } else {
      setMsgSV({ status: 'error', msg: 'You must provide a message' })
    }

    if (title !== '' && msg !== '') {
      setAnnounceLoading(true)
      const res = await apiRequest('POST', `/eventListing/announcement`, { title, message: msg, eventListingId: eventListingId })
      if (res.ok) {
        toast.success('Announcement successfully made')
        setAnnounceModal(false)
        setTitle('')
        setMsg('')
      }
      setAnnounceLoading(false)
    }
  }

  return (
    <>
      <DangerModal title='Confirm Cancel Event' open={modal2Open} onOk={deleteEvent} onCancel={() => setModal2Open(false)}>
        Cancelling your event is permanent. Confirm decision carefully.
      </DangerModal>
      <DefaultModal okText={<p><NotificationOutlined className='pr-2' />Share</p>} width={1000} title={<p className='text-h3 md:text-h3-md'>Make an Announcement</p>} open={announceModal} onOk={makeAnnouncement} onCancel={() => setAnnounceModal(false)}>
        {announceLoading ?
          <LoadingPage />
          :
          <>
            <br></br>
            <TextInput name='Subject' placeholder="Subject" onChange={(e) => setTitle(e.target.value)} value={title} validation={titleSV}></TextInput>
            <TextAreaInput rows={10} name={'Message'} placeholder={'Share a message to prospective customers and event attendees'} onChange={(e) => setMsg(e.target.value)} value={msg} validation={msgSV} ></TextAreaInput>
          </>
        }
      </DefaultModal>
      {(getters.isLoggedIn && getters.isHost && hostId === getters.memberId) &&
        <div className='flex justify-center p-4 w-[100%] bg-gray-200 mb-10 rounded flex-row'>
          <div className='w-[80%]'>
            <p className='text-h4 md:text-h4-md text-primary-light mb-4'>Event Listing Tools</p>
            <span className='flex flex-row justify-start md:gap-10 gap-5'>
              <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={editEvent}><FormOutlined className='pr-2' />Edit Event</p>
              <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={tryMakeAnnouncement}><NotificationOutlined className='pr-2' />Make Announcement</p>
              <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={tryNavigateAnalytics}><LineChartOutlined className='pr-2' />Event Analytics</p>
              {!liveSurveyMade ?
                <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={createSurvey}><SolutionOutlined className='pr-2' />Create Survey</p>
                :
                <>
                  <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={() => navigate(`/survey/${eventListingId}`)}><SolutionOutlined className='pr-2' />View Survey</p>
                  <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-secondary-dark' onClick={deleteSurvey}><SolutionOutlined className='pr-2' />Delete Survey</p>
                  <DangerModal title='Delete Survey' open={delSurveyModal} onOk={deleteSurveyApi} onCancel={() => setDelSurveyModal(false)}>
                    {delModalLoading ?
                      <LoadingPage />
                      :
                      'Deleting your survey is permanent and cannot be recovered. You can create a new survey after deleting your current survey.'
                    }
                  </DangerModal>
                </>
              }
              <p className='text-h5 md:text-h5-md hover:cursor-pointer hover:text-red-500' onClick={tryCancel}><CloseCircleOutlined className='pr-2' />Cancel Event</p>
            </span>
          </div>
        </div>
      }
    </>
  )
};

export default EventCreatorSettings;
