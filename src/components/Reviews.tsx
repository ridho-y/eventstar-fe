/* eslint-disable no-restricted-globals */

import { Rating } from '@mui/material';
import { Context } from 'Router';
import { Button, Divider, Form, Pagination } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import apiRequest from 'utils/api';
import { toast } from 'react-toastify';
import { Validation } from 'pages/profile/Information';
import LoadingPage from 'system/LoadingPage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export type Review = {
  reviewId: number
  eventListingId: number // the event listing ID for this review
  hostId: number // the host of the event for this review
  orgName: string // the orgName
  rating: number
  review: string
  firstName: string
  lastName: string
  memberId: number
  date: string
  edited: boolean
  likes: number
  host?: {
    date: string
    edited: boolean
    reply: string
  }
  eventInfo?: {
    thumbnail: string
    title: string
    type: string
  }
  userInfo?: {
    userLiked: boolean
  }
}

type ReviewsProps = {
}

const Reviews: React.FC<ReviewsProps> = () => {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [pagination, setPagination] = useState(true);
  const [pageNo, setPageNo] = useState(1)
  const { getters } = useContext(Context);
  const { eventListingId } = useParams();
  const { hostId } = useParams();
  useEffect(() => {
    const getReviews = async () => {
      if (location.pathname.startsWith('/event')) {
        setLoading(true)
        setPagination(false)
        const res = await apiRequest('GET', `/eventListing/review/${eventListingId}`);
        if (res.ok) {
          setReviews(res.reviews)
        }
        setLoading(false)
      } else if (location.pathname.startsWith('/host')) {
        setLoading(true)
        setPagination(true)
        const res = await apiRequest('GET', `/host/${hostId}`);
        if (res.ok) {
          setReviews(res.reviews)
        }
        setLoading(false)
      }

    }

    getReviews();
  }, [])


  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <>
        <div className=''>
          {pagination ?
            <>
              <Pagination
                defaultCurrent={1}
                total={reviews.length}
                pageSize={2}
                size='small'
                hideOnSinglePage
                className='float-right'
                onChange={(p) => setPageNo(p)}
              />
              <br></br>
              <Divider />
              {reviews.slice((pageNo - 1) * 2, pageNo * 2).map((r: Review, i: number) => <Review review={JSON.parse(JSON.stringify(r))} key={i} />)}
            </>
            :
            <>
              <Divider />
              {reviews.map((r: Review, i: number) => <Review review={r} key={i} />)}
            </>
          }
        </div>
      </>
    )
  }

};

type ReviewProps = {
  review: Review;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
  const { getters } = useContext(Context);
  const [liveRating, setLiveRating] = useState(review.rating)
  const [ratingEdit, setRatingEdit] = useState(review.rating)
  const [reviewText, setReviewText] = useState(review.review)
  const [reviewTextEdit, setReviewTextEdit] = useState(review.review)
  const [editReview, setEditReview] = useState(false)
  const [editSV, setEditSV] = useState<Validation>({ status: '', msg: '' })
  const [liveUserEdit, setLiveUserEdit] = useState(review.edited);
  const [liveUserDate, setLiveUserDate] = useState(review.date);
  const [hostReplyEditMode, setHostReplyEditMode] = useState(false);
  const [hostReply, setHostReply] = useState(review?.host?.reply);
  const [hostReplyEdit, setHostReplyEdit] = useState(review?.host?.reply);
  const [hostReplySV, setHostReplySV] = useState<Validation>({ status: '', msg: '' })
  const [liveHostEdit, setLiveHostEdit] = useState((review.host === null ? false : review.host.edited))
  const [liveHostDate, setLiveHostDate] = useState(review?.host?.date);

  const [hasLikedReview, setHasLikeReview] = useState((review?.userInfo?.userLiked) === null ? false : (review?.userInfo?.userLiked));
  const [likeCount, setLikeCount] = useState(review.likes)
  const [hasResponse, setHasResponse] = useState(review.host !== null)
  const [hostRespondMode, setHostRespondMode] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiveRating(review.rating);
    setRatingEdit(review.rating);
    setReviewText(review.review);
    setReviewTextEdit(review.review);
    setEditReview(false);
    setEditSV({ status: '', msg: '' });
    setLiveUserEdit(review.edited);
    setLiveUserDate(review.date);
    setHostReplyEditMode(false);
    setHostReply(review?.host?.reply);
    setHostReplySV({ status: '', msg: '' })
    setLiveHostEdit(review?.host?.edited)
    setLiveHostDate(review?.host?.date)
    setHasResponse(review.host !== null)
    setHostRespondMode(false);
    setHasLikeReview((review?.userInfo?.userLiked) === null ? false : (review?.userInfo?.userLiked))
    setLikeCount(review.likes)
  }, [review])

  const editOrReply = () => {
    if (getters.memberId === review.memberId) {
      setEditReview(true)
    } else if (getters.memberId === review.hostId) {
      setHostReplyEdit('');
      setHostRespondMode(true);
    }
  }

  const saveNewReviewEdit = async () => {
    if (ratingEdit === null || reviewTextEdit === '') {
      setEditSV({ status: 'error', 'msg': 'Rating cannot be 0 and/or review cannot be empty' })
    } else {
      setLoading(true)
      setEditSV({ status: '', 'msg': '' })
      setLiveUserEdit(true);
      setLiveUserDate(moment().toISOString())
      setReviewText(reviewTextEdit);
      setLiveRating(ratingEdit);
      setEditReview(false)
      const res = await apiRequest('PUT', `/review/${review.reviewId}`, { rating: ratingEdit, review: reviewTextEdit })
      if (res.ok) {
        toast.success('Successfully edited your review')
      }
      setLoading(false)
    }
  }

  const saveHostReplyEdit = async () => {
    if (hostReplyEdit === '') {
      setHostReplySV({ status: 'error', msg: 'Response cannot be empty' })
    } else {
      setHostReplySV({ status: '', msg: '' })
      setLiveHostEdit(true)
      setLiveHostDate(moment().toISOString())
      setHostReply(hostReplyEdit);
      setHostReplyEditMode(false);
      setHasResponse(true);
      setHostRespondMode(false);
      setLoading(true)

      if (hasResponse) {
        const res = await apiRequest('PUT', `/review/${review.reviewId}`, { review: hostReplyEdit })
        if (res.ok) {
          toast.success('Successfully edited your response')
        }
      } else {
        const res = await apiRequest('POST', `/review`, { reviewId: review.reviewId, response: hostReplyEdit })
        if (res.ok) {
          toast.success('Successfully responded to review')
        }
      }
      setLoading(false)
    }
  }

  const changeLike = async () => {
    const res = await apiRequest('POST', `/review/like/${review.reviewId}`)
    if (res.ok) {
      setLikeCount((c) => {
        if (hasLikedReview) {
          c -= 1
          return c
        } else {
          c += 1
          return c
        }
      })
      setHasLikeReview(r => !r)
    }
  }

  const navigate = useNavigate();

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <>
        <span className='flex flex-row justify-between mb-2 items-center gap-3'>
          <span>
            <span className='text-h4 md:text-h4-md bold text-secondary-dark'>{review.firstName} {review.lastName}</span>
            {location.pathname.startsWith('/host') && <span className='text-h4 md:text-h4-md text-gray-500'> @ <span onClick={() => navigate(`/event/${review.eventListingId}`)} className='hover:text-secondary-dark text-secondary hover:underline hover:cursor-pointer'>{review.eventInfo.title}</span></span>}
          </span>
          <p className='text-h6 md:text-h6-md italic text-gray-500'>{liveUserEdit && 'Edited •'} {moment(liveUserDate).fromNow()}</p>
        </span>
        {editReview ?
          <Form.Item
            validateStatus={editSV.status}
            help={editSV.msg}
            className='text-h6 md:text-h6-md'>
            <span className={`border-[1px] ${editSV.status === 'error' ? 'border-red-500' : 'border-gray-300'} flex items-center flex-row justify-start p-1 rounded mb-2 w-min`}>
              <Rating size='small' className='flex-1' onChange={(_, v) => setRatingEdit(v)} precision={1} value={ratingEdit} />
            </span>
            <TextArea className='whitespace-pre-wrap text-h6 md:text-h6-md' placeholder='Edit your review' value={reviewTextEdit} onChange={(e) => setReviewTextEdit(e.target.value)} rows={4}></TextArea>
            <span className='flex flex-row justify-end gap-3 mt-3'>
              <Button type='default' size='small'><p className='text-h5 md:text-h5-md' onClick={() => { setEditReview(false); setReviewTextEdit(reviewText); setRatingEdit(liveRating) }}>Cancel</p></Button>
              <Button type='primary' size='small'><p className='text-h5 md:text-h5-md' onClick={saveNewReviewEdit}>Save</p></Button>
            </span>
          </Form.Item>
          :
          <>
            <Rating size='small' defaultValue={liveRating} precision={1} readOnly />
            <span className='flex flex-row justify-between items-end ml-[3px]'>
              <p className='text-h6 md:text-h6-md w-10/12'>{reviewText}</p>
              <span className='flex flex-row w-2/12 justify-end gap-3'>
                <p className='text-h6 md:text-h6-md text-gray-500 hover:text-secondary-dark hover:underline hover:cursor-pointer' onClick={editOrReply}>{review.memberId === getters.memberId && 'Edit'}{review.hostId === getters.memberId && !hasResponse && 'Respond'}</p>
                <p className='text-h6 md:text-h6-md text-gray-500 hover:text-secondary-dark hover:underline hover:cursor-pointer' onClick={changeLike}>{hasLikedReview ? `Unlike (${likeCount})` : `Like (${likeCount})`}</p>
              </span>
            </span>
          </>
        }
        {(hasResponse || hostRespondMode) && <div className='ml-5 mt-4 border-l-[1px] border-secondary-light pl-2'>
          <span className='flex flex-row justify-between mb-2 items-center gap-3'>
            {hasResponse && <p className='text-h5 md:text-h5-md text-primary-light'><b>Response from {review.orgName}</b></p>}
            {hasResponse && <p className='text-h6 md:text-h6-md italic text-gray-500'>{liveHostEdit && 'Edited •'} {moment(liveHostDate).fromNow()}</p>}
          </span>
          {(hostReplyEditMode || hostRespondMode) &&
            <Form.Item
              validateStatus={hostReplySV.status}
              help={hostReplySV.msg}
              className='text-h6 md:text-h6-md'>
              <TextArea className='whitespace-pre-wrap text-h6 md:text-h6-md' placeholder='Your response' value={hostReplyEdit} onChange={(e) => setHostReplyEdit(e.target.value)} rows={4}></TextArea>
              <span className='flex flex-row justify-end gap-3 mt-3'>
                <Button type='default' size='small'><p className='text-h5 md:text-h5-md' onClick={() => { setHostRespondMode(false); setHostReplyEditMode(false); }}>Cancel</p></Button>
                <Button type='primary' size='small'><p className='text-h5 md:text-h5-md' onClick={saveHostReplyEdit}>Save</p></Button>
              </span>
            </Form.Item>
          }
          {
            (!hostReplyEditMode && !hostRespondMode) &&
            <span className='flex flex-row justify-between items-end'>
              <p className='text-h6 md:text-h6-md w-11/12'>{hostReply}</p>
              <p className='text-h6 md:text-h6-md w-1/12 text-gray-500 text-right hover:text-secondary-dark hover:underline hover:cursor-pointer' onClick={() => { setHostReplyEdit(hostReply); setHostReplyEditMode(true) }}>{review.hostId === getters.memberId && 'Edit'}</p>
            </span>
          }
        </div>}
        <Divider />
      </>
    )
  }
}

export default Reviews;
