import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { Validation } from 'pages/profile/Information';
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

type LocationProps = {
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  setLatLon: React.Dispatch<React.SetStateAction<string>>
  locationStatusMsg: Validation
  setLocationStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  createMode?: boolean
}

const Location: React.FC<LocationProps> = ({ createMode, setLocation, setLatLon, locationStatusMsg, location }) => {
  const [searchLocation, setSearchLocation] = useState(location);
  const [searchLocationBox, setSearchLocationBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchLocationBox(ref);
  };

  const handlePlaceSelect = () => {
    const selectedPlace = searchLocationBox?.getPlaces()[0];
    if (selectedPlace) {
      setSearchLocation(selectedPlace.name);
      setLocation(selectedPlace.name)
      setLatLon(`${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`)
    }
  };

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Location</p>
      <Form.Item
        validateStatus={`${locationStatusMsg.status}`}
        help={locationStatusMsg.msg}
        className='!text-h5 !md:text-h5-md'
        hasFeedback
      >
        <LoadScript
          googleMapsApiKey={
            process.env.REACT_APP_GOOGLE_PLACE_API_KEY
          }
          libraries={["places"]}
          region="au"
        >
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={handlePlaceSelect}
          >
            <Input
              disabled={!createMode}
              className="text-h4 md:text-h4-md w-96"
              placeholder="Choose a location"
              size='large'
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </StandaloneSearchBox>
        </LoadScript>
        <br></br>
      </Form.Item>
    </>
  )
};

export default Location;
