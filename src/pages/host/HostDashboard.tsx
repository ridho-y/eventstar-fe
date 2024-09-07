import { Context } from 'Router';
import Billing from 'pages/profile/billing/Billing';
import React, { useContext } from 'react';
import Page403 from 'system/Page403';
import Referrals from './Referrals';
import Events from './Events';
import SideBar from 'pages/profile/SideBar';
import { hostDashboardItems } from 'utils/menu';
import HostInformation from 'pages/host/HostInformation';
import Analytics from './Analytics';
import { useNavigate } from 'react-router-dom';
import EventChat from 'pages/eventChat/EventChat';

type HostDashboardProps = {
  location: string
}

const HostDashboard: React.FC<HostDashboardProps> = ({ location }) => {
  const { getters } = useContext(Context);
  const navigate = useNavigate();

  let locationPage = null;
  if (location === '' && getters.isHost) {
    locationPage = <HostInformation />
  } else if (location === 'analytics' && getters.isHost) {
    locationPage = <Analytics />
  } else if (location === 'events' && getters.isHost) {
    locationPage = <Events />
  } else if (location === 'referrals' && getters.isHost) {
    locationPage = <Referrals />
  } else if (location === 'billing' && getters.isHost) {
    locationPage = <Billing isHost={getters.isHost} />
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
        ?
        <>
          <SideBar items={hostDashboardItems} active={location} type='row' />
          <div className='bg-gray-50 mx-7 mt-5 mb-7 rounded border-[1px] border-secondary-dark min-h-[70vh]'>
            <section className='flex flex-col'>
              <div className='w-full px-10 h-full'>
                {locationPage}
              </div>
            </section>
          </div>


        </>
        : <Page403 />}
      <br></br>

    </>
  )
}

export default HostDashboard;
