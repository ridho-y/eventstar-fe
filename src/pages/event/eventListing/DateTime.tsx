import React from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type DateTimeProps = {
  startDateTime: string
  endDateTime: string
}

const DateTime: React.FC<DateTimeProps> = ({ startDateTime, endDateTime }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  // Same day
  if (start.getDay() === end.getDay() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return (
      <>
      <span className='flex-1 flex flex-row items-center'><CalendarMonthIcon className='mr-3 text-primary-light'/><p className='text-h5 md:text-h5-md'>{days[start.getDay()]}, {start.getDate()} {months[start.getMonth()]} {start.getFullYear()}</p></span>
      <span className='flex-1 flex flex-row items-center'><AccessTimeIcon className='mr-3 text-primary-light'/><p className='text-h5 md:text-h5-md'>{start.getHours()}:{start.getMinutes().toString().length === 1 ? '0' + start.getMinutes().toString()  : start.getMinutes()} - {end.getHours()}:{end.getMinutes().toString().length === 1 ? '0' + end.getMinutes().toString() : end.getMinutes()}</p></span>
      </>
    );
  } else {
    return (
      <>
      <span className='flex-1 flex flex-row items-center'><p className='text-h5 md:text-h5-md' style={{ fontWeight: 500 }}>Starts: &nbsp;</p> <p className='text-h5 md:text-h5-md'>{start.getHours()}:{start.getMinutes().toString().length === 1 ? '0' + start.getMinutes().toString() : start.getMinutes()}, &nbsp;{start.getDate()} {months[start.getMonth()]} {start.getFullYear()}</p></span>
      <span className='flex-1 flex flex-row items-center'><p className='text-h5 md:text-h5-md' style={{ fontWeight: 500 }}>Ends: &nbsp;</p><p className='text-h5 md:text-h5-md'>{end.getHours()}:{end.getMinutes().toString().length === 1 ? '0' + end.getMinutes().toString() : end.getMinutes()}, &nbsp;{end.getDate()} {months[end.getMonth()]} {end.getFullYear()} </p></span>
      </>
    )
  }
};

export default DateTime;
