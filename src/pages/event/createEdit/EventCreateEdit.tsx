import React, { useContext, useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Form } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Validation } from 'pages/profile/Information';
import moment from "moment";
import TagsAntd from './Tags';
import Faq from './Faq';
import YouTubeLinks from './YouTubeLinks';
import UploadMedia, { UploadFile2 } from './UploadMedia';
import Summary from './Summary';
import Description from './Description';
import TicketsAvailable from './TicketsAvailable';
import MinimumCost from './MinimumCost';
import DateTime from './DateTime';
import Title from './Title';
import Type from './Type';
import Venue from './Venue';
import Reserves from './Reserves';
import Location from './Location';
import OnlineLink from './OnlineLink';
import { toast } from 'react-toastify';
import LoadingPage from 'system/LoadingPage';
import { Context } from 'Router';
import PrimaryButton from 'components/PrimaryButton';
import DefaultButton from 'components/DefaultButton';
import apiRequest, { cancelAllRequests } from 'utils/api';
import Page403 from 'system/Page403';
import QudosMapPreview from './venuePreviews/QudosPreview';
import RodLaverPreview from './venuePreviews/RodLaverPreview';
import { uploadFiles } from 'utils/helpers';

type createEventDetails = {
  title: string
  startDateTime: string
  endDateTime: string
  type?: string
  summary?: string
  description: string
  images?: string[]
  tags: string[]
  youtubeLinks: string[]
  faq?: { question: string, answer: string }[]
  online?: {
    onlineLink: string,
    cost: number
    quantity: number
  }
  inpersonNonSeated?: {
    location: string
    locationCoord: string
    reserves: {
      name: string
      cost: number
      description: string
      quantity: number
    }[]
  }
  inpersonSeated?: {
    venueId: number
    reserves: {
      name: string
      cost: number
      description: string
      sections: string[]
    }[]
  }
}

// Do create first
const EventCreateEdit: React.FC = () => {

  const { getters } = useContext(Context);
  const { pathname } = useLocation();
  const { eventListingId } = useParams();
  const [createMode, setCreateMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [eventCreator, setEventCreator] = useState(null)
  const [venueOptions, setVenueOptions] = useState([])
  const [venueMapping, setVenueMapping] = useState<{ [key: string]: number }>({})
  useEffect(() => {
    setLoading(true);
    const getVenues = async () => {
      cancelAllRequests()
      const res = await apiRequest('GET', '/venue')
      if (res.ok) {
        setVenueOptions(res.venues.map((v: { venueId: number; name: string; }) => { return { label: v.name, value: v.name, venueId: v.venueId } }))
        setVenueMapping(() => {
          let venueMapping = {}
          res.venues.forEach((v: { name: string; venueId: number; }) => {
            venueMapping = { ...venueMapping, [v.name]: v.venueId }
          })
          return venueMapping
        })
      }
    }
    getVenues();
    if (pathname === '/event/create') {
      setCreateMode(true);
    } else {
      setCreateMode(false);
    }
  }, [])

  useEffect(() => {
    if (!createMode) {
      const getEditInformation = async () => {
        setLoading(true)
        const res = await apiRequest('GET', `/eventListing/${eventListingId}`)
        if (res.ok) {
          setTitle(res.title)
          setEventCreator(res.memberId)
          setType(res.type)
          setStartDateTime(res.startDateTime)
          setEndDateTime(res.endDateTime)
          form.setFieldsValue({
            'Picker': [moment(res.startDateTime), moment(res.endDateTime)],
          })
          setSummary(res.summary === null ? '' : res.summary)
          setDescription(res.description)
          setTags(res.tags === null ? [] : res.tags);
          setImages(res.images === null ? [] : res.images)
          setYouTubeLinks(res.youtubeLinks === null ? [] : res.youtubeLinks)
          setFaqs(res.faq === null ? [] : res.faq);


          setVenue(null)
          if (res.inpersonSeated !== null) {
            setReserves(res.inpersonSeated?.reserves)
          } else if (res.inpersonNonSeated !== null) {
            setReserves(res.inpersonNonSeated?.reserves)
          } else {
            setReserves([])
          }

          setLocation(res.inpersonNonSeated === null ? '' : res.inpersonNonSeated.location)
          setMinimumCost(res.inpersonNonSeated === null ? '' : res.inpersonNonSeated.reserves[0].cost)
          setTicketsAvailable(res.inpersonNonSeated === null ? '' : res.inpersonNonSeated.reserves[0].quantity)

          setOnlineLink(res.online === null ? '' : res.online.onlineLink)
          setMinimumCost(res.online === null ? '' : res.online.cost)
          setTicketsAvailable(res.online === null ? '' : res.online.tickets)
        }
        setLoading(false)
      }
      getEditInformation();
    } else {
      setLoading(false)
    }
  }, [createMode])


  const [form] = Form.useForm();

  // Title validation
  const [title, setTitle] = useState('');
  const [titleStatusMsg, setTitleStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Type validation
  const [type, setType] = useState('online');
  const [typeStatusMsg, setTypeStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Date and time
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [dateTimeStatusMsg, setDateTimeStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Tickets available
  const [ticketsAvailable, setTicketsAvailable] = useState(null);
  const [ticketsAvailableStatusMsg, setTicketsAvailableStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Ticket price
  const [minimumCost, setMinimumCost] = useState(null);
  const [minimumCostStatusMsg, setMinimumCostStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Venue if in person seated
  const [venue, setVenue] = useState<string>(null);
  const [venueStatusMsg, setVenueStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Location if in person non seated
  const [location, setLocation] = useState('');
  const [latLon, setLatLon] = useState('');
  const [locationStatusMsg, setLocationStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Online link if online event
  const [onlineLink, setOnlineLink] = useState('');
  const [onlineLinkStatusMsg, setOnlineLinkStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Reserves
  const [reserves, setReserves] = useState([]);
  const [reserveItems, setReserveItems] = useState([]);
  const [reservesStatusMsg, setReservesStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Summary
  const [summary, setSummary] = useState('');

  // Description
  const [description, setDescription] = useState('');
  const [descriptionStatusMsg, setDescriptionStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile2[]>([]);
  const [imagesStatusMsg, setImagesStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // YouTube Links validation
  const [youTubeLinks, setYouTubeLinks] = useState([]);

  // Faq
  const [faqs, setFaqs] = useState([]);
  const [faqItems, setFaqItems] = useState<CollapseProps['items']>([])

  // Tags
  const [tags, setTags] = useState([]);
  const [tagsStatusMsg, setTagsStatusMsg] = useState<Validation>({ status: '', msg: '' });

  const submit = async () => {
    new Promise<void>((res, rej) => {
      if (title.length === 0) {
        rej('No title');
        setTitleStatusMsg({ status: 'error', msg: 'Title cannot be empty' });
      } else {
        setTitleStatusMsg({ status: '', msg: '' });
      }
      if (startDateTime.length === 0 || endDateTime.length === 0) {
        rej('No start/end date time');
        setDateTimeStatusMsg({ status: 'error', msg: 'You must select the date and time of the event' });
      } else {
        setDateTimeStatusMsg({ status: '', msg: '' });
      }

      if (description === '') {
        rej('No description');
        setDescriptionStatusMsg({ status: 'error', msg: 'You must write a description' });
      } else {
        setDescriptionStatusMsg({ status: '', msg: '' });
      }
      if (fileList.length === 0) {
        rej('Need at least 1 image');
        setImagesStatusMsg({ status: 'error', msg: 'You must upload at least 1 image' });
      } else {
        setImagesStatusMsg({ status: '', msg: '' });
      }
      if (tags.length === 0) {
        rej('Need at least 1 tag');
        setTagsStatusMsg({ status: 'error', msg: 'You must add at least 1 tag' });
      } else {
        setTagsStatusMsg({ status: '', msg: '' });
      }

      if (type === 'online' && onlineLink === '') {
        rej('No online link');
        setOnlineLinkStatusMsg({ status: 'error', msg: 'You must provide an online event link' });
      } else {
        setOnlineLinkStatusMsg({ status: '', msg: '' });
      }

      if (type === 'online') {
        if (ticketsAvailable === null) {
          rej('No tickets');
          setTicketsAvailableStatusMsg({ status: 'error', msg: 'You must have tickets available' })
        } else if (!/^\d+$/g.test(ticketsAvailable) || ticketsAvailable === 0) {
          rej('Invalid tickets');
          setTicketsAvailableStatusMsg({ status: 'error', msg: 'Invalid number of tickets' });
        } else {
          setTicketsAvailableStatusMsg({ status: '', msg: '' });
        }

        if (minimumCost === null) {
          rej('No min cost');
          setMinimumCostStatusMsg({ status: 'error', msg: 'You must have set a ticket price' })
        } else if (minimumCost < 0) {
          rej('No ticket price');
          setMinimumCostStatusMsg({ status: 'error', msg: 'Invalid ticket price' });
        } else {
          setMinimumCostStatusMsg({ status: '', msg: '' });
        }
      }

      if ((type === 'inpersonNonSeated' || type === 'inpersonSeated') && reserveItems.length === 0) {
        rej('No reserves');
        setReservesStatusMsg({ status: 'error', msg: 'You must allocate at least one reserve' })
      } else {
        setReservesStatusMsg({ status: '', msg: '' });
      }

      res();
    })
      .then(() => {
        submitDataApi();
      })
      .catch(() => { });
  }

  const cancel = () => {
    navigate(`/event/${eventListingId}`)
    toast.info('Cancelled')
  }


  // Collate data except FAQ
  const submitDataApi = async () => {
    setLoading(true)
    const faqs = faqItems.map((fq) => { return { question: fq.label.toString(), answer: fq.children.toString() } })

    let dataJSON: createEventDetails = {
      title: title,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      summary: summary,
      description: description,
      tags: tags,
      youtubeLinks: youTubeLinks,
      faq: faqs
    }

    // Upload images to Azure blob server
    const images = await uploadFiles(fileList)
    dataJSON = { ...dataJSON, images: [...images] }

    if (createMode) {
      if (type === 'online') {
        dataJSON = {
          ...dataJSON,
          type: type,
          online: {
            onlineLink: onlineLink,
            cost: minimumCost,
            quantity: ticketsAvailable
          }
        }
      } else if (type === 'inpersonNonSeated') {
        dataJSON = {
          ...dataJSON,
          type: type,
          inpersonNonSeated: {
            location: location,
            locationCoord: latLon,
            reserves: reserveItems.map((r) => { return { name: r.reserve, cost: r.cost, quantity: r.tickets, description: r.description } })
          }
        }
      } else {
        dataJSON = {
          ...dataJSON,
          type: type,
          inpersonSeated: {
            venueId: venueMapping[venue],
            reserves: reserveItems.map((r) => { return { name: r.reserve, cost: r.cost, sections: r.sections, description: r.description } })
          }
        }
      }
    }
    console.log(JSON.stringify(dataJSON))
    if (createMode) {
      const res = await apiRequest('POST', '/eventListing', dataJSON)
      if (res.ok) {
        toast.success('Your event is now live!')
        navigate(`/event/${res.eventListingId}`)
      }
    } else {
      const res = await apiRequest('PUT', `/eventListing/${eventListingId}`, dataJSON)
      if (res.ok) {
        toast.success('Your event has been updated')
        navigate(`/event/${eventListingId}`)
      }
    }
    setLoading(false)
  }

  if (loading) {
    return <LoadingPage />
  } else if (!getters.isHost || (!createMode && getters.memberId != eventCreator)) {
    return <Page403 />
  } else {
    return (
      <>
        <main className='flex flex-col items-center'>
          <div className='pt-[70px] w-[90%] md:w-[75%]'>
            <p className='text-h1 md:text-h1-md text-primary'>{createMode ? "Create an Event" : "Edit Your Event"}</p>
            <p className='text-h4 md:text-h4-md pt-2 pl-[3px]'>{createMode ? "In a few moments time, your event will be up and running" : "You can edit your event here"}</p>
            <br />
            <Form className='' form={form} >

              <Title title={title} setTitle={setTitle} setTitleStatusMsg={setTitleStatusMsg} titleStatusMsg={titleStatusMsg} />

              <DateTime startDateTime={startDateTime} setStartDateTime={setStartDateTime} endDateTime={endDateTime} setEndDateTime={setEndDateTime} dateTimeStatusMsg={dateTimeStatusMsg} setDateTimeStatusMsg={setDateTimeStatusMsg} />

              <Type createMode={createMode} type={type} setType={setType} setTypeStatusMsg={setTypeStatusMsg} typeStatusMsg={typeStatusMsg} />
              {type === 'inpersonSeated' && <Venue createMode={createMode} venueOptions={venueOptions} venue={venue} setVenue={setVenue} setVenueStatusMsg={setVenueStatusMsg} venueStatusMsg={venueStatusMsg} setLocation={setLocation} />}
              {type === 'inpersonNonSeated' && <Location setLatLon={setLatLon} createMode={createMode} location={location} setLocation={setLocation} setLocationStatusMsg={setLocationStatusMsg} locationStatusMsg={locationStatusMsg} />}
              {type === 'online' && <OnlineLink disabled={!createMode} onlineLink={onlineLink} setOnlineLink={setOnlineLink} setOnlineLinkStatusMsg={setOnlineLinkStatusMsg} onlineLinkStatusMsg={onlineLinkStatusMsg} />}


              {type === 'online' &&
                <section className='w-full flex flex-row gap-10 justify-center'>
                  <div className='flex-1 w-full'>
                    <TicketsAvailable disabled={!createMode} ticketsAvailable={ticketsAvailable} setTicketsAvailable={setTicketsAvailable} ticketsAvailableStatusMsg={ticketsAvailableStatusMsg} setTicketsAvailableStatusMsg={setTicketsAvailableStatusMsg} />
                  </div>
                  <div className='flex-1 w-full'>
                    <MinimumCost disabled={!createMode} minimumCost={minimumCost} setMinimumCost={setMinimumCost} setMinimumCostStatusMsg={setMinimumCostStatusMsg} minimumCostStatusMsg={minimumCostStatusMsg} />
                  </div>
                </section>
              }

              {(type === 'inpersonNonSeated' || type === 'inpersonSeated') &&
                <>
                  {type === 'inpersonSeated' && (venue !== null) &&
                    <>
                      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Venue Map</p>
                      {venue === 'Qudos Bank Arena' && <QudosMapPreview />}
                      {venue === 'Rod Laver Arena' && <RodLaverPreview />}
                      <br></br><br></br>
                    </>}
                  <Reserves createMode={createMode} type={type} venue={venue} reserves={reserves} setReserves={setReserves} reserveItems={reserveItems} setReserveItems={setReserveItems} reservesStatusMsg={reservesStatusMsg} setReservesStatusMsg={setReservesStatusMsg} />
                </>
              }


              <Summary summary={summary} setSummary={setSummary} />

              <Description description={description} setDescription={setDescription} descriptionStatusMsg={descriptionStatusMsg} setDescriptionStatusMsg={setDescriptionStatusMsg} />

              <UploadMedia images={images} setImages={setImages} fileList={fileList} setFileList={setFileList} setImagesStatusMsg={setImagesStatusMsg} imagesStatusMsg={imagesStatusMsg} />

              <YouTubeLinks youTubeLinks={youTubeLinks} setYouTubeLinks={setYouTubeLinks} />

              <Faq faqs={faqs} setFaqs={setFaqs} faqItems={faqItems} setFaqItems={setFaqItems} />

              <TagsAntd tags={tags} setTags={setTags} tagsStatusMsg={tagsStatusMsg} setTagsStatusMsg={setTagsStatusMsg} />

              <br />
              <span className='flex flex-row justify-between gap-6'>
                <PrimaryButton onClick={submit}>{createMode ? 'Create Event' : 'Save Information'}</PrimaryButton>
                <DefaultButton onClick={cancel}>Cancel</DefaultButton>
              </span>

            </Form>
          </div>
          <br></br><br></br><br></br><br></br><br></br>
        </main>
      </>
    )

  };
}

export default EventCreateEdit;