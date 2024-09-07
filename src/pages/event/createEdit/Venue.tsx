import React from 'react';
import { Validation } from 'pages/profile/Information';
import SelectInput from 'components/SelectInput';

type VenueProps = {
  venue: string
  setVenue: React.Dispatch<React.SetStateAction<string>>
  venueStatusMsg: Validation
  setVenueStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  setLocation: React.Dispatch<React.SetStateAction<string>>
  venueOptions: any[]
  createMode: boolean
}

const Venue: React.FC<VenueProps> = ({ createMode, venueOptions, venue, setVenue, venueStatusMsg, setLocation }) => {

  return (
    <>
      <SelectInput disabled={!createMode} name='Venue Location' placeholder='Venue Location' onChange={(v: string) => { setVenue(v); setLocation(v) }} value={venue} validation={venueStatusMsg} options={
        venueOptions}></SelectInput>
    </>
  )
};

export default Venue;
