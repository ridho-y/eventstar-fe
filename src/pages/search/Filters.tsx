import React, { useContext, useEffect, useState } from "react";
import { DatePicker, Divider, Modal, Select, Space } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { Context } from "Router";
import { Button, Input, Loading, Radio } from "@nextui-org/react";
import { LocationOnOutlined } from "@mui/icons-material";
import HorizontalEventCard from "components/search/HorizontalEventCard";
import dayjs from "dayjs";
import { Rating, Slider } from "@mui/material";
import CheckableTag from "antd/es/tag/CheckableTag";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { toast } from "react-toastify";
import apiRequest from "utils/api";
import { useParams } from "react-router-dom";
import PrimaryButton from "components/PrimaryButton";
const { RangePicker } = DatePicker;

const Filters: React.FC = () => {
  const { searchQuery } = useParams();
  const { setters } = useContext(Context);
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [renderedCards, setRenderedCards] = useState([]);
  const [renderedSearchedCards, setRenderedSearchedCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState(8);
  const [displayedSearchedCards, setDisplayedSearchedCards] = useState(8);
  const [hasSearched, setHasSearched] = useState(false);

  // Location Picker
  const [searchLocation, setSearchLocation] = useState("");
  const [searchLocationBox, setSearchLocationBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [locationCoord, setLocationCoord] = useState("");

  // Sorting
  const [sort, setSort] = useState("relevance");

  // Filtering Section
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [priceStart, setPriceStart] = useState<number>(0);
  const [priceEnd, setPriceEnd] = useState<number>(500);

  const [type, setType] = useState(null);
  const [tagsData, setTagsData] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [kmNearMe, setKmNearMe] = useState(0);
  const [ratingAtLeast, setRatingAtLeast] = useState<number>(0);

  useEffect(() => {
    setters.setIsSearchPage(true);
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await apiRequest("GET", "/allTags");
      if (response.ok) {
        setTagsData(response.tags);
      }
    };

    fetchTags();
  }, [tagsData.length]);

  // Fetch all events
  useEffect(() => {
    const fetchMoreEvents = async () => {
      setIsFirstLoading(true); // Set loading to true before making the API request
      const response = await apiRequest("GET", "/allEvents");
      if (response.ok) {
        setAllEvents(response.eventListings);
      }
      setIsFirstLoading(false); // Set loading to false after the API request is complete
    };

    fetchMoreEvents();
  }, [allEvents.length, locationCoord]);

  useEffect(() => {
    const renderCards = () => {
      setRenderedCards(allEvents.slice(0, displayedCards));
    };
    renderCards();
  }, [displayedCards, allEvents]);

  useEffect(() => {
    const renderSearchedCards = () => {
      setRenderedSearchedCards(searchedEvents.slice(0, displayedSearchedCards));
    };
    renderSearchedCards();
  }, [displayedSearchedCards, searchedEvents]);

  const populateEvents = () => {
    setIsLoading(true);

    // Simulate an asynchronous data fetching process
    setTimeout(() => {
      setDisplayedCards(displayedCards + 8);
      setIsLoading(false);
    }, 2000);
  };

  const populateSearchedEvents = () => {
    setIsLoading(true);

    // Simulate an asynchronous data fetching process
    setTimeout(() => {
      setDisplayedSearchedCards(displayedSearchedCards + 8);
      setIsLoading(false);
    }, 2000);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const handleDateChange = (
    _value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setDateStart(dateString[0].replace(" ", "T"));
    setDateEnd(dateString[1].replace(" ", "T"));
  };

  const handleSelectedTags = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...tags, tag]
      : tags.filter((t) => t !== tag);
    setTags(nextSelectedTags);
  };

  // Location Picker
  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchLocationBox(ref);
  };

  const handlePlaceSelect = () => {
    const selectedPlace = searchLocationBox?.getPlaces()[0];
    if (selectedPlace) {
      setSearchLocation(selectedPlace.formatted_address);
    }
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
              setSearchLocation(results[0].formatted_address);
            }
          });
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }
  };

  const handleSearch = async () => {
    setLocationCoord("");
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (
        status === google.maps.GeocoderStatus.OK &&
        results &&
        results.length > 0
      ) {
        const { lat, lng } = results[0].geometry.location;
        setLocationCoord(`${lat()},${lng()}`); // Call lat() and lng() methods
      } else {
        setLocationCoord("");
      }
    });
    // Prepare the request data object
    const requestData = {
      searchQuery: searchQuery,
      locationCoord: locationCoord,
      start: 0, // Change this to the appropriate start value
      filter: {
        dateStart: dateStart,
        dateEnd: dateEnd,
        priceStart: priceStart,
        priceEnd: priceEnd,
        type: type,
        tags: tags, // Assuming you have stored the selected tags in the selectedTags state
        kmNearMe: kmNearMe,
        ratingAtLeast: ratingAtLeast,
      },
      sort: sort,
    };
    setHasSearched(false);
    setSearchedEvents([]);
    const response = await apiRequest("POST", "/search", requestData);
    if (response.ok) {
      setHasSearched(true);
      setSearchedEvents(response.eventListings);
    }
  };

  // Filters: price
  useEffect(() => {
    setPriceStart(priceRange[0]);
    setPriceEnd(priceRange[1]);
  }, [priceRange]);

  const handleDateRangeChange = (value: string) => {
    if (value === "today") {
      const today = dayjs().format("YYYY-MM-DD");
      setDateStart(`${today}`);
      setDateEnd(`${today}`);
    } else if (value === "tomorrow") {
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      setDateStart(`${tomorrow}`);
      setDateEnd(`${tomorrow}`);
    } else if (value === "weekly") {
      const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");
      const endOfWeek = dayjs().endOf("week").format("YYYY-MM-DD");
      setDateStart(`${startOfWeek}`);
      setDateEnd(`${endOfWeek}`);
    } else if (value === "monthly") {
      const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");
      setDateStart(`${startOfMonth}`);
      setDateEnd(`${endOfMonth}`);
    }
  };

  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <section className="content">
        {/* Filter Modal */}
        <Modal footer={[]} centered width={'90%'} title={<p className='text-h3 md:text-h3-md'>Confirm Purchase</p>} open={openModal} onCancel={() => setOpenModal(false)}>
          <div className="flex flex-col flex-wrap mt-2 pb-10">
            <div className="flex flex-row items-center justify-start mb-4">
              <div>
                <div className="flex flex-row items-center pt-6">
                  {/* Search Location */}
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
                        className="mx-1"
                        size="lg"
                        underlined
                        placeholder="Choose a location"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                      />
                    </StandaloneSearchBox>
                    <Button
                      className="ml-4"
                      icon={<LocationOnOutlined fill="currentColor" />}
                      color="success"
                      shadow
                      auto
                      onClick={handleCurrentLocation}
                    ></Button>
                  </LoadScript>
                </div>
              </div>
              <Button
                className="ml-16"
                size="md"
                shadow
                color="success"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            <div className="w-[20%]">
              {/* Filter by Date */}
              <p className="text-h3 md:text-h3-md text-secondary-dark mt-6 mb-2">Date</p>
              <Radio.Group
                labelColor="default"
                size="xs"
                onChange={(e) => handleDateRangeChange(e.toString())}
              >
                <Radio value="today">Today</Radio>
                <Radio value="tomorrow">Tomorrow</Radio>
                <Radio value="weekly">This Week</Radio>
                <Radio value="monthly">This Month</Radio>
              </Radio.Group>
              {/* Date Picker */}
              <RangePicker
                className="mt-4"
                size="small"
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                onChange={handleDateChange}
              />
              {/* Filter by  Type */}
              <p className="text-h3 md:text-h3-md text-secondary-dark  mt-6 mb-2">Type</p>
              <Radio.Group
                labelColor="default"
                size="xs"
                onChange={(e) => setType(e.toString())}
              >
                <Radio value="online">Online</Radio>
                <Radio value="inpersonSeated">Seated</Radio>
                <Radio value="inpersonNonSeated">Non-Seated</Radio>
              </Radio.Group>
              {/* Filter by ratingAtLeast */}
              <p className="text-h3 md:text-h3-md text-secondary-dark  mt-6 mb-2">Rating</p>
              <Rating
                name="ratingAtLeast"
                value={ratingAtLeast}
                onChange={(_e, newValue) => {
                  setRatingAtLeast(newValue as number);
                }}
              />
              {/* Filter by Price */}
              <p className="text-h3 md:text-h3-md text-secondary-dark  mt-6 mb-2">Price</p>
              <Slider
                className="ml-2"
                size="small"
                getAriaLabel={() => "Price range"}
                value={priceRange}
                onChange={(_e, newValue) =>
                  setPriceRange(newValue as number[])
                }
                valueLabelDisplay="auto"
                getAriaValueText={(value) => `${value}`}
                min={0}
                max={500}
                marks={[
                  { value: 0, label: "$0" },
                  { value: 500, label: "$500" },
                ]}
              />
              {/* Filter by kmNearMe */}
              <p className="text-h3 md:text-h3-md text-secondary-dark  mt-6 mb-2">Distance</p>
              <Slider
                className="ml-2"
                size="small"
                getAriaLabel={() => "Distance range"}
                value={kmNearMe}
                onChange={(_e, newValue) => setKmNearMe(newValue as number)}
                valueLabelDisplay="auto"
                getAriaValueText={(value) => `${value}km`}
                min={0}
                max={50}
                marks={[
                  { value: 0, label: "0km" },
                  { value: 50, label: "50" },
                ]}
              />
              {/* Filter by Tags */}
              <p className="text-h3 md:text-h3-md text-secondary-dark  mt-6 mb-2">Tags</p>
              <Space size={[0, 8]} wrap>
                {tagsData.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={tags.includes(tag)}
                    onChange={(checked) => handleSelectedTags(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </div>

            {/* Right side */}

          </div>
        </Modal>
        <br></br><br></br>
        <main className="flex flex-col w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <div className="flex flex-row justify-between">
            {/* Filters */}
            <PrimaryButton onClick={() => setOpenModal(true)}>Filters</PrimaryButton>
            {/* Sort */}
            <div className="w-full flex flex-row justify-end">
              <Select
                className='!text-h6 !md:text-h6-md'
                size='large'
                style={{ width: 150 }}
                onChange={(e) => setSort(e)}
                value={sort}
                options={[
                  { label: 'Relevance', value: 'relevance' },
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Popular', value: 'mostLiked' },
                  { label: 'Lowest Price', value: 'lowestPrice' },
                  { label: 'Highest Price', value: 'highestPrice' },
                  { label: 'A-Z', value: 'alphabetical' },
                  { label: 'Z-A', value: 'alphabeticalReverse' },
                ]}
              />
            </div>
          </div>
        </main>
        {/* Main Contain */}
        <div className="flex flex-row mx-auto">
          <div className="flex flex-col px-6 pt-6 xl:px-[75px] 2xl:px-[200px] w-full">
            <div>
            </div>
            {/* Search field */}
            <div className="w-[80%] flex flex-col">

              {/* Event Cards */}
              <div className="flex flex-col ml-4 items-center">
                {isFirstLoading ? (
                  <div className="py-6">
                    <Loading type="points" color="primary" size="md" />
                  </div>
                ) : (
                  <>
                    {!hasSearched &&
                      allEvents.map((card) => (
                        <div className="mt-4" key={card.eventListingId}>
                          <HorizontalEventCard {...card} />
                        </div>
                      ))}

                    {/* Render cards when search is clicked */}
                    {hasSearched &&
                      searchedEvents.map((card) => (
                        <div className="mt-4" key={card.eventListingId}>
                          <HorizontalEventCard {...card} />
                        </div>
                      ))}
                  </>
                )}
                {isLoading ? (
                  <div className="pt-9 pb-10">
                    <Loading type="points" color="primary" size="md" />
                  </div>
                ) : !hasSearched ? (
                  displayedCards < allEvents.length ? (
                    <div className="pt-9 pb-10">
                      <Button
                        shadow
                        color="success"
                        size="md"
                        onClick={populateEvents}
                      >
                        See More
                      </Button>
                    </div>
                  ) : null
                ) : displayedSearchedCards < searchedEvents.length ? (
                  <div className="pt-9 pb-10">
                    <Button
                      shadow
                      color="success"
                      size="md"
                      onClick={populateSearchedEvents}
                    >
                      See More
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            {/* Divider */}
            <Divider />

            {/* Filtering */}

          </div>
        </div>
      </section>
    </>
  );
};

export default Filters;
