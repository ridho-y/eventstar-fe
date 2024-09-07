import React from 'react';
import { Validation } from 'pages/profile/Information';
import SelectInput from 'components/SelectInput';

type TypeProps = {
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
  typeStatusMsg: Validation
  setTypeStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  createMode: boolean
}

const Type: React.FC<TypeProps> = ({ createMode, type, setType, typeStatusMsg }) => {

  return (
    <SelectInput disabled={!createMode} name='Type of Event' placeholder='Event Type' onChange={(v: string) => setType(v)} value={type} validation={typeStatusMsg} options={
      [
        { value: 'inpersonSeated', label: 'Seated Event (Venue)' },
        { value: 'inpersonNonSeated', label: 'Non-Seated Event' },
        { value: 'online', label: 'Online Event' },
      ]
    }></SelectInput>
  )
};

export default Type;
