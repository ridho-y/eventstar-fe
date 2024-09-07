import React, { useState } from "react";
import { Card, Col, Row } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { FireTwoTone } from "@ant-design/icons";
import { getFormattedDate, getFormattedType } from "utils/helpers";

type EventCardProps = {
  eventListingId: number;
  thumbnail: string;
  title: string;
  startDateTime: string;
  location: string;
  minimumCost: number;
  orgName: string;
  noFollowers: number;
  type: string;
};

const EventCard: React.FC<EventCardProps> = ({
  eventListingId,
  thumbnail,
  title,
  startDateTime,
  location,
  minimumCost,
  orgName,
  noFollowers,
  type,
}) => {
  const navigate = useNavigate();
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("heart-button")) {
      navigate(`/event/${eventListingId}`);
    }
  };
  
  return (
    <Card
      className="event-card"
      css={{ w: "100%", h: "400px" }}
      isHoverable
      isPressable
      variant="bordered"
      onClick={handleCardClick}
    >
      <Card.Body>
        <Card.Image
          className="rounded-lg"
          src={thumbnail}
          objectFit="cover"
          width="100%"
          height="300px"
          alt="Event Image"
        />
        <div className="flex flex-col px-1 mt-6">
          <p className="text-h3 md:text-h3-md font-semibold text-secondary-dark line-clamp-2">{title}</p>
          <p className="text-h5 md:text-h5-md text-gray-600 pt-2">{getFormattedType(type)}{(location !== null && location !== '') && ','} {location}</p>
          <p className="text-h4 md:text-h4-md text-secondary pt-2">{getFormattedDate(startDateTime)}</p>
          <p className="text-h5 md:text-h5-md text-primary pt-2">Starts at ${minimumCost}</p>
        </div>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Row justify="space-between" align="center">
          <Col>
            <p className="text-h4 md:text-h4-md font-bold">{orgName}</p>
            <div className="flex flex-row">
              <FireTwoTone twoToneColor="red" />
              <p className="text-h6 md:text-h6-md font-bold ml-2">Followers: {noFollowers}</p>
            </div>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default EventCard;
