import React, { useContext, useEffect, useState } from 'react';
import Page403 from 'system/Page403';
import { isMobileWidth } from 'utils/media';
import SideBar from './SideBar';
import Information from './Information';
import { userItems, hostItems } from 'utils/menu';
import Billing from './billing/Billing';
import HostInformation from '../host/HostInformation';
import AccountSettings from './AccountSettings';
import { Context } from 'Router';
import Following from './Following';
import Bookings from './Bookings';
import Favourites from './Favourites';
import { useNavigate } from 'react-router-dom';

type ProfileProps = {
    location: string
}

const ProfilePage: React.FC<ProfileProps> = ({ location }) => {
  const [deviceType, setDeviceType] = useState('');
  const { getters } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth()) setDeviceType('mobile');
      else setDeviceType('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  let locationPage = null;
  if (location === 'information') {
    locationPage = <Information />
  } else if (location === 'bookings' && !getters.isHost) {
    locationPage = <Bookings />
  } else if (location === 'billing') {
    locationPage = <Billing isHost={getters.isHost}/>
  } else if (location === 'host-profile' && getters.isHost) {
    locationPage = <HostInformation />
  } else if (location === 'account-settings') {
    locationPage = <AccountSettings />
  } else if (location === 'favourites' && !getters.isHost) {
    locationPage = <Favourites />
  } else if (location === 'following' && !getters.isHost) {
    locationPage = <Following />
  } else {
    locationPage = (
      <div className='h-full '>
        <Page403 />
      </div>
    )
  }

  return (
    <>
      {getters.isLoggedIn
        ? <section className='flex flex-row h-full'>
          {deviceType === 'desktop' ? (getters.isHost ? <SideBar items={hostItems} active={location} /> : <SideBar items={userItems} active={location} />) : <></>}
          <div className='md:basis-4/5 w-full pl-10 pr-10 h-full'>
            {locationPage}
          </div>
        </section>
        : <Page403 />}
    </>
  )
}

export default ProfilePage;
