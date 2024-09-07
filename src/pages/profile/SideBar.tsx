import { Context } from 'Router';
import { signOutApi } from 'components/NavBar';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userNameLink, hostNameLink, hostDashboardNameLink } from 'utils/menu';

type SideBarProps = {
  items: string[]
  active?: string // index of items that is highlighted
  type?: 'row'
}

type SideBarItemProps = {
  name: string,
  active?: string,
  type?: 'row'
}

const SideBar: React.FC<SideBarProps> = ({ type, items, active }) => {
  const { setters } = useContext(Context);
  const navigate = useNavigate();
  if (type === 'row') {
    return (
      <div className='flex items-center flex-col '>
        <main className='flex flex-row md:gap-5 gap-2'>
          {items.map((n, i) => <SideBarItem key={i} name={n} active={active} type='row' />)}
        </main>
      </div>
    )
  } else {
    return (
      <div className='w-64 flex items-center min-h-full flex-col pt-20'>
        <main className='flex flex-col gap-2'>
          {items.map((n, i) => <SideBarItem key={i} name={n} active={active} />)}
          <div className='hover:bg-gray-200 p-1 px-3 rounded hover:cursor-pointer transition'>
            <p className='text-h5 md:text-h5-md text-red-600' onClick={() => {
              signOutApi();
              navigate('/');
              setters.setIsLoggedIn(false);
            }}>Sign Out</p>
          </div>
          <br /><br /><br />
        </main>
      </div>
    )
  }

}

const SideBarItem: React.FC<SideBarItemProps> = ({ name, active, type }) => {
  const { getters } = useContext(Context);
  const navigate = useNavigate();

  const links = (getters.isHost ? {...hostNameLink, ...hostDashboardNameLink} : {...userNameLink})
  if (links[name] === active) {
    return (
      <div className='bg-gray-200 p-1 md:px-3 px-1 rounded'>
        <span className='text-h5 md:text-h5-md'>{name}</span>
      </div>
    )
  } else if (type === 'row') {
    return (
      <div className='hover:bg-gray-200 p-1 md:px-3 px-1 rounded hover:cursor-pointer transition' onClick={() => navigate(`/host-dashboard/${links[name]}`)}>
        <span className='text-h5 md:text-h5-md'>{name}</span>
      </div>
    )
  } else {
    return (
      <div className='hover:bg-gray-200 p-1 md:px-3 px-1 rounded hover:cursor-pointer transition' onClick={() => navigate(`/profile/${links[name]}`)}>
        <span className='text-h5 md:text-h5-md'>{name}</span>
      </div>
    )
  }

}

export default SideBar;
