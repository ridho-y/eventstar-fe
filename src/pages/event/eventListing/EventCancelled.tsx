import { Alert } from 'antd';
import React from 'react';

type EventCancelledProps = {
}

const EventCancelled: React.FC<EventCancelledProps> = ({ }) => {
  return (
    <Alert
      className='md:w-[80%] w-[90%] mb-7'
      message="Event Cancelled"
      description="We regret to inform that, due to unforeseen circumstances, the event host has made the difficult decision to cancel this highly anticipated event. We understand that this news may come as a disappointment, and we sincerely apologise for any inconvenience caused."
      type="error"
      showIcon
    />
  )
};

export default EventCancelled;
