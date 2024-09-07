import { Loading } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import apiRequest from "utils/api";
import EventDisplayer from "components/event/EventDisplayer";
import PrimaryButton from "components/PrimaryButton";

const MoreEvents: React.FC = () => {
  const [start, setStart] = useState(-16)
  const [isLoading, setIsLoading] = useState(false);
  const [renderedCards, setRenderedCards] = useState([]);
  const [hideMore, setHideMore] = useState(false);

  const fetchMoreEvents = async () => {
    // Set loading to true before making the API request
    setIsLoading(true); 
    const res = await apiRequest("POST", "/", { start: start + 16 });
    if (res.ok) {
      if (res.eventListings.length === 0) {
        setHideMore(true)
      }
      setRenderedCards(events => { return [...events, ...res.eventListings] });
    }
    setStart(s => s + 16)
    setIsLoading(false)
  };

  useEffect(() => {
    setHideMore(false)
    fetchMoreEvents();
  }, []);

  if (isLoading) {
    return <Loading type="points" color="primary" size="md" />
  } else {
    return (
      <>
        <main className="flex flex-col">
          <p className="text-h3 md:text-h3-md text-secondary">Recommended For You...</p>
          <EventDisplayer events={renderedCards} />
          <div className="flex flex-row justify-center">
            {!hideMore && <PrimaryButton onClick={fetchMoreEvents}>See More</PrimaryButton>}
          </div>
        </main>
      </>
    )
  }
};

export default MoreEvents;
