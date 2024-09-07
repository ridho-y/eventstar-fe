import React, { useEffect, useState } from 'react';
import { Button, Divider, Modal } from 'antd';
import moment from 'moment';

type AnnouncementsProps = {
  announcements: {
    title: string
    date: string
    message: string
  }[]
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  const [modalOpen, setModalOpen] = useState(false)

  if (announcements.length === 0) {
    return <></>
  } else {
    return (
      <div className='mt-6 rounded flex flex-col justify-center bg-gray-200 w-[80%] shadow-sm p-4'>
        <Modal
          title='Event Announcements'
          centered
          open={modalOpen}
          footer={[]}
          bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
          onCancel={() => setModalOpen(false)}
          width={1000}>
          <br></br>
          <section className='flex flex-col gap-5 mx-4'>
            {announcements.map((a, i) =>
              <div key={i} className='rounded p-3 bg-gray-50 border-[0.5px] border-gray-300'>
                <span className='flex flex-row justify-between mb-2'>
                  <p className='text-h4 md:text-h4-md'>{a.title}</p>
                  <p className='text-h6 md:text-h6-md italic'>{moment(a.date).fromNow()}</p>
                </span>
                <p className='text-h5 md:text-h5-md'>{a.message}</p>
              </div>
            )}
          </section>
        </Modal>
        <p className='text-h4 md:text-h4-md text-primary-light'>Event Announcements</p>
        <p className='text-h6 md:text-h6-md text-gray-700 italic'>Last announcement about {moment(announcements[0].date).fromNow()}</p>
        <br></br>
        <p className='text-h5 text-grey-900 text-center md:text-h5-md italic overflow-ellipsis line-clamp-6'>{announcements[0].message}</p>
        <Divider />
        <span className='flex flex-row justify-center mb-2'>
          <Button type='primary' size='small' onClick={() => setModalOpen(true)}><p className='text-h6 md:text-h6-md'>All Announcements</p></Button>
        </span>
      </div>
    )
  }
};

export default Announcements;
