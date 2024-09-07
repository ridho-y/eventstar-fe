import React from 'react';
import { Validation } from 'pages/profile/Information';
import TextInput from 'components/TextInput';

type OnlineLinkProps = {
  onlineLink: string
  setOnlineLink: React.Dispatch<React.SetStateAction<string>>
  onlineLinkStatusMsg: Validation
  setOnlineLinkStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  disabled: boolean
}

const OnlineLink: React.FC<OnlineLinkProps> = ({ disabled, onlineLink, setOnlineLink, onlineLinkStatusMsg }) => {
  return (
    <TextInput disabled={disabled} name='Online Event Link' placeholder='This link will be emailed to attendees right before the event' onChange={(e) => setOnlineLink(e.target.value)} value={onlineLink} validation={onlineLinkStatusMsg}></TextInput>
  )
};

export default OnlineLink;
