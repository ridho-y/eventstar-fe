import React, { useState, memo, useEffect, useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import { LocationOnOutlined } from "@mui/icons-material";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { Context } from "Router";

type defaultProps = {
  deviceType: string;
};

const LocationSearchComponent: React.FC = memo(() => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const { setters } = useContext(Context);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handlePlaceSelect = () => {
    const selectedPlace = searchBox?.getPlaces()[0];
    if (selectedPlace) {
      setSearchText(selectedPlace.formatted_address);
    }
  };

  const handleSearch = () => {
    setters.setHomeCoord("");
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchText }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        setters.setHomeCoord(`${lat()},${lng()}`); // Call lat() and lng() methods
      } else {
        toast.error("Invalid location");
      }
    });
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const geocoder = new google.maps.Geocoder();
          const latLng = new google.maps.LatLng(latitude, longitude);

          geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
              setSearchText(results[0].formatted_address);
            } else {
              toast.error("Invalid location");
            }
          });
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  useEffect(() => {
    if (!searchText) {
      // Reset the search text when it becomes empty
      setSearchText(""); 
    }
  }, [searchText]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_PLACE_API_KEY}
      libraries={["places"]}
      region="au"
    >
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={handlePlaceSelect}>
        <Input
          className="mx-1"
          size="lg"
          underlined
          placeholder="Search for a location"
          value={searchText}
          onChange={handleInput}
        />
      </StandaloneSearchBox>
      <Button
        className="ml-4"
        icon={<LocationOnOutlined fill="currentColor" />}
        color="success"
        auto
        shadow
        onClick={handleCurrentLocation}
      ></Button>
      <Button
        className="ml-4"
        size="md"
        shadow
        color="success"
        onClick={handleSearch}
      >
        Search
      </Button>
    </LoadScript>
  );
});

const LocationPicker: React.FC<defaultProps> = memo(({ deviceType }) => {
  return (
    <div className="pb-10 flex flex-row items-center">
      {deviceType === "desktop" ? (
        <p className="font-bold mr-2" style={{ fontSize: "2rem" }}>
          Location:{" "}
        </p>
      ) : (
        <p className="font-bold mr-2 text-h2-md">Location: </p>
      )}
      <LocationSearchComponent />
    </div>
  );
});

export default LocationPicker;
