import React from 'react';
import { Form, DatePicker, Space } from 'antd';
import { Validation } from 'pages/profile/Information';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

type DateTimeProps = {
  startDateTime: string
  setStartDateTime: React.Dispatch<React.SetStateAction<string>>
  endDateTime: string
  setEndDateTime: React.Dispatch<React.SetStateAction<string>>
  dateTimeStatusMsg: Validation
  setDateTimeStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
}

const DateTime: React.FC<DateTimeProps> = ({ setStartDateTime, setEndDateTime, dateTimeStatusMsg }) => {
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };

  const onChange = (
    _value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    setStartDateTime(dateString[0].replace(' ', 'T'))
    setEndDateTime(dateString[1].replace(' ', 'T'))
  };

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Event Date and Time</p>
      <Form.Item
        name='Picker'
        validateStatus={`${dateTimeStatusMsg.status}`}
        help={dateTimeStatusMsg.msg}
        className='!text-h5 !md:text-h5-md'
        hasFeedback
      >
        <RangePicker
          size='large'
          disabledDate={disabledDate}
          className='!text-h4 !md:text-h4-md'
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
        />
      </Form.Item>
    </>
  )
};

export default DateTime;
