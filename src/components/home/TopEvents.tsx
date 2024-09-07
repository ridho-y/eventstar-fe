import { Col, Row, Slider } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "Router";
import { Loading } from "@nextui-org/react";
import apiRequest from "utils/api";
import EventCard from "./cards/EventCard";

const TopEvents: React.FC = () => {
  const { getters } = useContext(Context);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const progressStep = 5; // Adjust this value as needed

  let cardWidth = 0;
  let containerWidth = 0;

  useEffect(() => {
    if (scrollRef.current) {
      const cardElement: HTMLElement =
        scrollRef.current.querySelector(".event-card");
      if (cardElement) {
        const computedStyles = window.getComputedStyle(cardElement);
        containerWidth = scrollRef.current.offsetWidth;
        const spaceBetweenCards =
          (containerWidth - parseInt(computedStyles.width) * 4) / 3;
        cardWidth = cardElement.offsetWidth + spaceBetweenCards;
      }
    }
  }, [scrollRef.current, trendingEvents]);

  useEffect(() => {
    const fetchTopEvents = async () => {
      setIsLoading(true);
      const response = await apiRequest(
        "GET", `/trending`);
      if (response.ok) {
        setTrendingEvents(response.eventListings);
      }
      setIsLoading(false);
    };
    fetchTopEvents();
  }, [getters.trendingTag]);

  // Function to calculate the progress based on scroll position
  const updateProgressBar = () => {
    if (scrollRef.current) {
      const containerScrollLeft = scrollRef.current.scrollLeft;
      const containerScrollWidth = scrollRef.current.scrollWidth;
      const containerClientWidth = scrollRef.current.clientWidth;
      const maxScrollLeft = containerScrollWidth - containerClientWidth;
      const percentage = (containerScrollLeft / maxScrollLeft) * 100;
      setProgressValue(percentage);
    }
  };

  useEffect(() => {
    // Add the scroll event listener when the component mounts
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", updateProgressBar);
    }
    return () => {
      // Clean up the event listener when the component unmounts
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", updateProgressBar);
      }
    };
  }, []);

  return (
    <div className="pb-6">
      <div className="flex flex-row items-center justify-between mt-4">
        <p className="text-h3 md:text-h3-md text-secondary">Explore Top Events</p>
      </div>
      <div className="overflow-x-auto bg-inherit rounded-lg hide-scroll" ref={scrollRef}>
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loading type="points" color="primary" size="md" />
          </div>
        ) : trendingEvents.length > 0 ? (
          <>
            {/* Cards */}
            <Row gutter={[24, 24]} className="my-4 flex flex-row flex-nowrap">
              {trendingEvents.map((card) => (
                <Col key={card.eventListingId} xs={24} sm={12} md={12} lg={8} xl={6}>
                  <EventCard {...card} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <div className="py-6 flex justify-center">
            <p className="text-h5 md:text-h5-md text-gray-500">No events found</p>
          </div>
        )}
      </div>
      {/* Progress Bar */}
      <div className="flex justify-center mt-4">
        <Slider
          value={progressValue}
          min={0}
          max={100}
          step={progressStep}
          style={{ width: "70%" }}
        />
      </div>
    </div>
  );
};

export default TopEvents;
