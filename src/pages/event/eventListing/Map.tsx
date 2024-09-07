import React from 'react';

type MapLocationProps = {
  type: string
  location?: string
  venue?: string
}

const MapLocation: React.FC<MapLocationProps> = ({ type, location, venue }) => {
  if (type !== 'online') {
    return (
      <>
        <p className='text-h4 md:text-h4-md pb-2' style={{ fontWeight: 500 }}>Map Location</p>
        <iframe id='map-ggmp' className='aspect-video w-full' src={`https://maps.google.com/maps?q=${(type === 'inpersonSeated') ? `${venue}` : `${location.replace(' ', '%26')}`}&hl=en&z=17&amp;&output=embed`}></iframe>
        <br></br><br></br>
      </>
    )
  } else {
    return <></>
  }
};

export default MapLocation;
