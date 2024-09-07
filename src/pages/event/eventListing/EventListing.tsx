import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import LoadingPage from 'system/LoadingPage';
import Videos from './Videos';
import Faq from './Faq';
import Tags from './Tags';
import Page404 from 'system/Page404';
import Summary from './Summary';
import Details from './Details';
import MapLocation from './Map';
import BottomInfo from './BottomInfo';
import HostCard from './HostCard';
import { Context } from 'Router';
import SocialButtons from './SocialButtons';
import apiRequest, { cancelAllRequests } from 'utils/api';
import EventCreatorSettings from './EventCreatorSettings';
import Announcements from './Announcements';
import EventCancelled from './EventCancelled';
import ReviewInfo from './ReviewInfo';
import moment from 'moment';
import ReviewCard from './ReviewCard';

const EventListing: React.FC = () => {

  const { getters } = useContext(Context);
  const { eventListingId } = useParams();
  const [loading, setLoading] = useState(false);

  // Event details
  const [eventDetails, setEventDetails] = useState(null);
  const [hostDetails, setHostDetails] = useState(null);

  // User info
  const [isFollowingHost, setIsFollowingHost] = useState(null);
  const [reaction, setReaction] = useState('none');
  const [favourited, setFavourited] = useState(false);
  const [boughtTicket, setBoughtTicket] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    setLoading(true)
    const getEventListing = async () => {
      cancelAllRequests();
      const res = await apiRequest('GET', `/eventListing/${eventListingId}`)
      if (res.ok) {
        setEventDetails(res)
        setHostDetails(res.hostInfo)
        setReaction(res?.userInfo?.reaction);
        setFavourited(res?.userInfo?.favourited);
        setIsFollowingHost(res?.userInfo?.followsHost);
        setBoughtTicket(res?.userInfo?.boughtTicket);
        setHasReviewed(res?.userInfo?.hasReviewed);
        setAnnouncements(res.announcements.reverse());
      }
      setLoading(false)
    }
    getEventListing();
  }, [])

  if (loading) {
    return <LoadingPage />
  } else if (eventDetails === null) {
    return <Page404 />
  } else {
    return (
      <main className='pt-10 flex flex-col w-full items-center justify-start'>
        <EventCreatorSettings surveyMade={eventDetails.surveyMade} startDateTime={eventDetails.startDateTime} endDateTime={eventDetails.endDateTime} cancelled={eventDetails.cancelled} hostId={eventDetails.memberId} eventListingId={+eventListingId} setLoading={setLoading} editable={eventDetails.editable} />
        {eventDetails.cancelled && <EventCancelled />}
        {(getters.isLoggedIn && !getters.isHost && boughtTicket && !eventDetails.cancelled && moment(eventDetails.endDateTime).isBefore()) && <ReviewInfo setHasReviewed={setHasReviewed} eventListingId={+eventListingId} orgName={hostDetails.orgName} hasReviewed={hasReviewed} />}
        <ImageSlider images={eventDetails.images} />
        <section className='w-[90%] md:w-[80%] flex lg:flex-row flex-col md:gap-5'>
          <section className='md:basis-3/5'>
            <span className='lg:invisible visible float-right'>
              <SocialButtons reaction={reaction} noLikes={eventDetails.noLikes} noDislikes={eventDetails.noDislikes} eventListingId={+eventListingId} />
            </span>
            <p className='text-h1 md:text-h1-md text-primary-light mb-2'>{eventDetails.title}</p>
            {eventDetails.type === 'inpersonSeated' && <p className='text-h3 md:text-h3-md text-secondary-dark'>Seated Event</p>}
            {eventDetails.type === 'inpersonNonSeated' && <p className='text-h3 md:text-h3-md text-secondary-dark'>Non-Seated Event</p>}
            {eventDetails.type === 'online' && <p className='text-h3 md:text-h3-md text-secondary-dark'>Online Event</p>}
            <br></br><br></br>

            <Summary summary={eventDetails.summary} />

            <Details startDateTime={eventDetails.startDateTime} endDateTime={eventDetails.endDateTime} type={eventDetails.type} venue={eventDetails.inpersonSeated?.venue} location={eventDetails.inpersonNonSeated?.location} />

            <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>Description</p>
            <p className='text-h5 md:text-h5-md whitespace-pre-wrap'>{eventDetails.description}</p>
            <br></br><br></br>

            <Videos videos={eventDetails.youtubeLinks} />

            <MapLocation type={eventDetails.type} venue={eventDetails.inpersonSeated?.venue} location={eventDetails.inpersonNonSeated?.location} />

            {eventDetails.faq.length > 0 && (
              <>
                <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>FAQ</p>
                <Faq items={eventDetails.faq} />
                <br></br><br></br>
              </>
            )}
            <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>Tags</p>
            <Tags tags={eventDetails.tags} />
            <br></br><br></br>


            <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>Refund Policy</p>
            <p className='text-h5 md:text-h5-md mb-2'>EventStar values your satisfaction and offers a customer-friendly refund policy. Cancel your tickets up to 7 days before the event to receive a full refund. Trust us to provide convenience and peace of mind, ensuring your experience with EventStar is enjoyable from start to finish.</p>
            <br></br><br></br>
            {(eventDetails?.announcements?.length > 0 || eventDetails?.averageRating !== null) && <HostCard hostId={eventDetails.memberId} isFollowingHost={isFollowingHost} orgName={hostDetails.orgName} description={hostDetails.description} noFollowers={hostDetails.noFollowers} rating={hostDetails.rating} noEvents={hostDetails.noEvents} width='full' />}

          </section>
          <section className='md:basis-2/5 flex lg:items-end flex-col items-center lg:pt-0'>
            <span className='lg:visible invisible'>
              <SocialButtons reaction={reaction} noLikes={eventDetails.noLikes} noDislikes={eventDetails.noDislikes} eventListingId={+eventListingId} />
            </span>
            {(!eventDetails?.announcements || eventDetails?.announcements?.length == 0) && (!eventDetails?.averageRating) && <HostCard width='[80%]' hostId={eventDetails.memberId} isFollowingHost={isFollowingHost} orgName={hostDetails.orgName} description={hostDetails.description} noFollowers={hostDetails.noFollowers} rating={hostDetails.rating} noEvents={hostDetails.noEvents} />}
            {moment(eventDetails.endDateTime).isBefore() && eventDetails?.averageRating && <ReviewCard averageRating={eventDetails.averageRating} />}
            {(eventDetails?.announcements && eventDetails?.announcements?.length > 0) && <Announcements announcements={announcements} />}
            <br></br>
          </section>
        </section>
        <BottomInfo startDateTime={eventDetails.startDateTime} cancelled={eventDetails.cancelled} minimumCost={eventDetails.minimumCost} ticketsLeft={eventDetails.ticketsLeft} favourited={favourited} eventListingId={+eventListingId} />
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      </main>
    );
  }
};

export default EventListing;