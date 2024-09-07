import React from 'react';
import { Validation } from 'pages/profile/Information';
import TextAreaInput from 'components/TextAreaInput';

type DescriptionProps = {
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  descriptionStatusMsg: Validation
  setDescriptionStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
}

const Description: React.FC<DescriptionProps> = ({ description, setDescription, descriptionStatusMsg }) => {
  return (
    <TextAreaInput name='Event Description' placeholder='Describe your event' onChange={(e) => setDescription(e.target.value)} value={description} rows={10} validation={descriptionStatusMsg}></TextAreaInput>
  )
};

export default Description;
