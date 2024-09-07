import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Select, Space, Input } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { Radio } from "@nextui-org/react";
import HorizontalEventCard from "components/search/HorizontalEventCard";
import dayjs from "dayjs";
import { Rating, Slider } from "@mui/material";
import CheckableTag from "antd/es/tag/CheckableTag";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import apiRequest from "utils/api";
import { useParams } from "react-router-dom";
import PrimaryButton from "components/PrimaryButton";
import DefaultButton from "components/DefaultButton";
const { RangePicker } = DatePicker;

const SearchPage: React.FC = () => {
  const { searchQuery } = useParams();
  const [searchedEvents, setSearchedEvents] = useState([]);

  // Search Params
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [priceStart, setPriceStart] = useState<number>(0);
  const [priceEnd, setPriceEnd] = useState<number>(500);
  const [type, setType] = useState(null);
  const [tags, setTags] = useState<string[]>([]);
  const [kmNearMe, setKmNearMe] = useState(5);
  const [ratingAtLeast, setRatingAtLeast] = useState<number>(0);
  const [sort, setSort] = useState('relevance');
  const [start, setStart] = useState(0);
  const [getMore, setGetMore] = useState(true);

  const getData = (start: number): any => {
    let requestData: any = {
      searchQuery: searchQuery,
      start: start,
      filter: {
        priceStart: priceStart,
        priceEnd: priceEnd,
        tags: tags,
        ratingAtLeast: ratingAtLeast,
      },
      sort: sort,
    };

    if (latLon !== '') {
      requestData = { ...requestData, locationCoord: latLon, filter: { ...requestData.filter, kmNearMe: kmNearMe } }
    }

    if (dateStart !== '' && dateEnd !== '') {
      requestData = { ...requestData, filter: { ...requestData.filter, dateStart: dateStart, dateEnd: dateEnd } }
    }

    if (type !== null) {
      requestData = { ...requestData, filter: { ...requestData.filter, type: type } }
    }
    return requestData;
  }

  // Retrieve items
  const getNewItems = async () => {
    setGetMore(true);
    const requestData = getData(0);
    const response = await apiRequest("POST", "/search", requestData);
    if (response.ok) {
      setSearchedEvents([...response.eventListings]);
      setStart(16)
    }
  }

  const getMoreItems = async () => {
    const requestData = getData(start);
    const response = await apiRequest("POST", "/search", requestData);
    if (response.ok) {
      setSearchedEvents(s => [...s, ...response.eventListings]);
      setStart(s => s + 16)
      if (response.eventListings.length === 0) {
        setGetMore(false);
      }
    }
  }

  useEffect(() => {
    getNewItems();
  }, [searchQuery, sort])

  // Location
  const [searchLocation, setSearchLocation] = useState('');
  const [searchLocationBox, setSearchLocationBox] = useState<google.maps.places.SearchBox | null>(null);
  const [latLon, setLatLon] = useState('');

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchLocationBox(ref);
  };

  const handlePlaceSelect = () => {
    const selectedPlace = searchLocationBox?.getPlaces()[0];
    if (selectedPlace) {
      setSearchLocation(selectedPlace.name);
      setLatLon(`${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`)
    }
  };

  // Clear location if not placed
  useEffect(() => {
    if (searchLocation === '') {
      setLatLon('');
    }
  }, [searchLocation])

  // Date
  const [radioDate, setRadioDate] = useState<string>(null);
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  const handleDateChange = (
    _value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setRadioDate(null);
    setDateStart(dateString[0].replace(" ", "T"));
    setDateEnd(dateString[1].replace(" ", "T"));
  };

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

  useEffect(() => {
    handleDateRangeChange(radioDate)
  }, [radioDate])

  // Price Range
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);

  // Get Tags
  const [tagsData, setTagsData] = useState<string[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      const response = await apiRequest("GET", "/allTags");
      if (response.ok) {
        setTagsData((response.tags.length > 15) ? response.tags.sort(() => Math.random() - 0.5).slice(0, 15) : response.tags)
      }
    };
    fetchTags();
  }, [tagsData.length]);

  const handleSelectedTags = (tag: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...tags, tag]
      : tags.filter((t) => t !== tag);
    setTags(nextSelectedTags);
  };

  useEffect(() => {
    setPriceStart(priceRange[0]);
    setPriceEnd(priceRange[1]);
  }, [priceRange]);

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="content">
      <Modal footer={[]} centered width={'90%'} title={<p className='text-h3 md:text-h3-md'>Confirm Purchase</p>} open={modalOpen} onCancel={() => setModalOpen(false)}>
        {/* Location */}
        <div className="flex flex-col items-start">
          <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Location</p>
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
                className="text-h4 md:text-h4-md w-52"
                placeholder="Choose a location"
                size='middle'
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </StandaloneSearchBox>
          </LoadScript>
        </div>
        {/* Date */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Date</p>
          <Radio.Group
            labelColor="default"
            size="xs"
            value={radioDate}
            onChange={(e) => setRadioDate(e)}
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
        </div>
        {/* Filter by  Type */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Type</p>
          <Radio.Group
            labelColor="default"
            size="xs"
            onChange={(e) => setType(e.toString())}
          >
            <Radio value="online">Online</Radio>
            <Radio value="inpersonSeated">Seated</Radio>
            <Radio value="inpersonNonSeated">Non-Seated</Radio>
          </Radio.Group>
        </div>
        {/* Filter by ratingAtLeast */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Rating</p>
          <Rating
            name="ratingAtLeast"
            value={ratingAtLeast}
            onChange={(_e, newValue) => {
              setRatingAtLeast(newValue as number);
            }}
          />
        </div>
        {/* Filter by Price */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Price</p>
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
        </div>

        {/* Filter by kmNearMe */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Distance</p>
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
        </div>
        {/* Filter by Tags */}
        <div>
          <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Tags</p>
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

        <br></br>
        <PrimaryButton onClick={getNewItems}>Filter</PrimaryButton>
      </Modal>
      <br></br><br></br>
      <section className="flex flex-row w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5 gap-10">
        {/* Filters */}
        <section className="hidden lg:flex flex-col basis-1/4 border-r-[1px] border-gray-300 mr-10 pr-20">
          {/* Location */}
          <div className="flex flex-col items-start">
            <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Location</p>
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
                  className="text-h4 md:text-h4-md w-52"
                  placeholder="Choose a location"
                  size='middle'
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </StandaloneSearchBox>
            </LoadScript>
          </div>
          {/* Date */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Date</p>
            <Radio.Group
              labelColor="default"
              size="xs"
              value={radioDate}
              onChange={(e) => setRadioDate(e)}
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
          </div>
          {/* Filter by  Type */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Type</p>
            <Radio.Group
              labelColor="default"
              size="xs"
              onChange={(e) => setType(e.toString())}
            >
              <Radio value="online">Online</Radio>
              <Radio value="inpersonSeated">Seated</Radio>
              <Radio value="inpersonNonSeated">Non-Seated</Radio>
            </Radio.Group>
          </div>
          {/* Filter by ratingAtLeast */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Rating</p>
            <Rating
              name="ratingAtLeast"
              value={ratingAtLeast}
              onChange={(_e, newValue) => {
                setRatingAtLeast(newValue as number);
              }}
            />
          </div>
          {/* Filter by Price */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark mt-6 mb-2">Price</p>
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
          </div>

          {/* Filter by kmNearMe */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Distance</p>
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
          </div>
          {/* Filter by Tags */}
          <div>
            <p className="text-h4 md:text-h4-md text-secondary-dark  mt-6 mb-2">Tags</p>
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

          <br></br>
          <PrimaryButton onClick={getNewItems}>Filter</PrimaryButton>
        </section>
        {/* Search Items */}
        <section className="flex flex-col w-full">
          <div className="flex flex-row lg:justify-end justify-between">
            <PrimaryButton onClick={() => setModalOpen(true)} className="md:hidden block">Filters</PrimaryButton>
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
          <section className="flex flex-col gap-10 basis-3/4 ">
            <div></div>
            {searchedEvents.map((s, i) => <HorizontalEventCard {...s} key={i} />)}
            <div className="w-full flex flex-col items-start">
              {getMore && <DefaultButton size="middle" onClick={getMoreItems}>See More</DefaultButton>}
              {!getMore && <p className="text-gray-400 italic text-h6 md:text-h6-md">No more results</p>}
            </div>
          </section>
        </section>

      </section>
      <br></br><br></br><br></br>
    </main>
  )
};

export default SearchPage;
