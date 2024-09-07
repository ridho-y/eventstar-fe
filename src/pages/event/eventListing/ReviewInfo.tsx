import { Alert, Form, Rate } from 'antd';
import DefaultModal from 'components/DefaultModal';
import PrimaryButton from 'components/PrimaryButton';
import React, { useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons'
import TextAreaInput from 'components/TextAreaInput';
import { Validation } from 'pages/profile/Information';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import LoadingPage from 'system/LoadingPage';

type ReviewInfoProps = {
  orgName: string
  hasReviewed: boolean
  eventListingId: number
  setHasReviewed: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewInfo: React.FC<ReviewInfoProps> = ({ setHasReviewed, orgName, hasReviewed, eventListingId }) => {

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <ReviewPopUp setHasReviewed={setHasReviewed} hasReviewed={hasReviewed} modalOpen={modalOpen} setModalOpen={setModalOpen} eventListingId={eventListingId} />
      <Alert
        className='md:w-[80%] w-[90%] mb-7'
        message={<p className='text-h4 md:text-h4-md'>Thank you for attending {orgName}'s event</p>}
        description={<span className='flex flex-row justify-between'>
          <p className='text-h5 md:text-h5-md'>{orgName} cordially invites you to share your valuable review of the event. Your feedback holds immense significance, enabling continuous improvement and the delivery of exceptional experiences.</p>
          {hasReviewed ? <PrimaryButton className='ml-10'>Thank you for your review</PrimaryButton> : <PrimaryButton className='ml-10' onClick={() => setModalOpen(true)}>Review Event</PrimaryButton>}
        </span>}
        type="info"
      />
    </>
  )
};

export default ReviewInfo;

type ReviewPopUpProps = {
  hasReviewed: boolean
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  eventListingId: number
  setHasReviewed: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewPopUp: React.FC<ReviewPopUpProps> = ({ modalOpen, setModalOpen, setHasReviewed, eventListingId }) => {

  const [rating, setRating] = useState(0);
  const [ratingSV, setRatingSV] = useState<Validation>({ status: '', msg: '' })
  const [review, setReview] = useState('');
  const [reviewSV, setReviewSV] = useState<Validation>({ status: '', msg: '' })
  const [loading, setLoading] = useState(false);

  const makeReview = async () => {
    if (rating !== 0) {
      setRatingSV({ status: '', msg: '' })
    } else {
      setRatingSV({ status: 'error', msg: 'Rating must be between 1 and 5 stars' })
    }

    if (review !== '') {
      setReviewSV({ status: '', msg: '' })
    } else {
      setReviewSV({ status: 'error', msg: 'You must provide a review' })
    }

    if (rating !== 0 && review !== '') {
      setLoading(true)
      const res = await apiRequest('POST', `/eventListing/review`, {rating, review, eventListingId})
      if (res.ok) {
        toast.success('Thank you for your review')
        setModalOpen(false)
        setReview('')
        setRating(0)
        setHasReviewed(true)
      }
      setLoading(false)
    }
  }

  return (
    <DefaultModal okText={<p><FileTextOutlined className='pr-2' />Review</p>} width={1000} title={<p className='text-h3 md:text-h3-md'>Review</p>} open={modalOpen} onOk={makeReview} onCancel={() => setModalOpen(false)}>
      {loading ? <LoadingPage /> : 
      <>
      <br></br>
      <p className='text-h5 md:text-h5-md text-primary-light'>Rating</p>
      <Form.Item
        validateStatus={ratingSV.status}
        help={ratingSV.msg}
        hasFeedback
      >
        <Rate className='text-[20px] md:text-[40px]' value={rating} onChange={v => setRating(v)} />
      </Form.Item>

      <TextAreaInput rows={10} name={'Review'} placeholder={'Share your thoughts'} onChange={(e) => setReview(e.target.value)} value={review} validation={reviewSV} ></TextAreaInput>
      </>
      }
      
    </DefaultModal>
  )
}