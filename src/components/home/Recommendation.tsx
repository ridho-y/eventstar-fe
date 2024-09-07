import { Col, Row, Slider } from "antd";
import React, { memo, useEffect, useRef, useState } from "react";
import EventCard from "./cards/EventCard";
import { Loading } from "@nextui-org/react";
import apiRequest from "utils/api";

type defaultProps = {
  deviceType: string;
};

const Recommendation: React.FC<defaultProps> = memo(({ deviceType }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
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
  }, [scrollRef.current, recommendedEvents]);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      const response = await apiRequest(
        "GET",
        "/home/0"
      );
      if (response.ok) {
        setRecommendedEvents(response.eventListings);
      }
      setIsLoading(false);
    };
    fetchRecommendation();
  }, [recommendedEvents.length]);

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
        {deviceType === "desktop" ? (
          <p className="text-h2 font-bold" style={{ fontSize: "1.5rem" }}>
            Recommendations
          </p>
        ) : (
          <p className="text-h3-md font-bold">Recommendations</p>
        )}
      </div>
      <div className="overflow-x-auto bg-inherit rounded-lg" ref={scrollRef}>
        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loading type="points" color="primary" size="md" />
          </div>
        ) : recommendedEvents.length > 0 ? (
          <>
            {/* Cards */}
            <Row gutter={[16, 16]} className="my-4 flex flex-row flex-nowrap">
              {recommendedEvents.map((card) => (
                <Col key={card.eventListingId} xs={24} sm={12} md={6}>
                  <EventCard {...card} />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <div className="py-6 flex justify-center">
            <p className="text-h3-md font-bold">No events found</p>
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
});

export default Recommendation;
