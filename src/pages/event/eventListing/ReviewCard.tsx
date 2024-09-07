import { Rating } from '@mui/material';
import { Button, Divider, Modal } from 'antd';
import Reviews from 'components/Reviews';
import React, { useState } from 'react';

type ReviewCardProps = {
  averageRating: number
}

const ReviewCard: React.FC<ReviewCardProps> = ({ averageRating }) => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className='mt-6 rounded flex flex-col justify-center bg-gray-200 w-[80%] shadow-sm p-4'>
        <p className='text-h4 md:text-h4-md text-primary-light'>Event Reviews</p>
        <span className='flex flex-col justify-center mt-5 items-center'>
         <Rating size='large' defaultValue={averageRating} precision={0.01} readOnly />
         <p className='text-h6 md:text-h6-md italic mt-1 text-gray-600'>{averageRating.toFixed(2)} Star Rating</p>
        </span>
        <Divider />
        <span className='flex flex-row justify-center mb-2'>
          <Button type='primary' size='small' onClick={() => setModalOpen(true)}><p className='text-h6 md:text-h6-md'>All Reviews</p></Button>
          <Modal
          title='Event Reviews'
          centered
          open={modalOpen}
          footer={[]}
          bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
          onCancel={() => setModalOpen(false)}
          width={750}>
          <section className='flex flex-col gap-5 mx-4'>
            <Reviews />
          </section>
        </Modal>
        </span>
      </div>
    </>
  )
};

export default ReviewCard;
