import React from 'react';
import { Validation } from 'pages/profile/Information';
import TextInput from 'components/TextInput';

type TitleProps = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  titleStatusMsg: Validation
  setTitleStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
}

const Title: React.FC<TitleProps> = ({ title, setTitle, titleStatusMsg }) => {
  return (
    <TextInput name='Title' placeholder='Give your event a catchy title' onChange={(e) => setTitle(e.target.value)} value={title} validation={titleStatusMsg}></TextInput>
  )
};

export default Title;
