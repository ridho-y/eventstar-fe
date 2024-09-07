import React, { useContext } from 'react';
import { Badge } from 'antd';
import { Context } from 'Router';
import EventChatSideBar from './EventChatSideBar';
import ChatRoom from './ChatRoom';

const EventChat: React.FC = () => {

  const { getters } = useContext(Context);

  return (
    <>
      <main className='border-t-[1px] border-secondary rounded-lg mt-5 h-[calc(100vh-134px)]'>
        <header className='flex flex-row'>
          <div className='h-[50px] border-b-[1px] border-gray-300 w-full flex flex-row px-5 items-center justify-between'>
            <p className='text-h4 md:text-h4-md text-secondary-dark'>Welcome {getters.name}</p>
            <Badge status="success" text={<span className='text-h5 md:text-h5-md'>You are online</span>} />
          </div>
        </header>
        <section className='flex flex-row h-full'>
          <EventChatSideBar />
          <ChatRoom />
        </section>
      </main>
    </>
  );
};

export default EventChat;
