import React, { useContext, useState } from "react";
import { Card, Col, Row } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { FireTwoTone } from "@ant-design/icons";
import { toast } from "react-toastify";
import apiRequest from "utils/api";
import { Context } from "Router";
import { getFormattedDate, getFormattedType } from "utils/helpers";

type HorizontalEventCardProps = {
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

const HorizontalEventCard: React.FC<HorizontalEventCardProps> = ({
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
  const { getters } = useContext(Context);

  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    const target = e.target as HTMLDivElement;
    if (!target.classList.contains("heart-button")) {
      navigate(`/event/${eventListingId}`);
    }
  };

  const handleFavoriteButtonClick = async (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!isFavoriting) {
      try {
        setIsFavoriting(true);
        const favoriteEndpoint = `/eventListing/favourite/${eventListingId}`;
        const response = await apiRequest("PUT", favoriteEndpoint);
        if (response.ok) {
          setIsFavorited(!isFavorited); // Toggle the favorited state
        } else {
          toast.error(`Error ${response.detail}`);
        }
      } catch (error) {
        toast.error("Error occurred during API call:", error.message);
      } finally {
        setIsFavoriting(false);
      }
    }
  };

  return (
    <Card
      className="horizontal-event-card w-full"
      isHoverable
      isPressable
      variant="bordered"
      onClick={handleCardClick}
    >
      <Card.Body>
        <Row>
          <div className="h-[115px] w-[400px] pl-4">
            <img src={thumbnail} className="rounded-[20px] p-1 object-cover h-full w-full"></img>
          </div>
          <Col span={16}>
            <div className="flex flex-col pl-10 justify-between h-[100px]">
              <div className="flex flex-col items-stretch">
                <div>
                  <p className="text-h3 md:text-h3-md font-semibold text-secondary-dark line-clamp-1">{title}</p>
                  <p className="text-h5 md:text-h5-md text-gray-600 pt-2">{getFormattedType(type)}{(location !== null && location !== '') && ','} {location}</p>
                  <p className="text-h4 md:text-h4-md text-secondary pt-2">{getFormattedDate(startDateTime)}</p>
                  <p className="text-h5 md:text-h5-md text-primary pt-2">Starts at ${minimumCost}</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
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

export default HorizontalEventCard;
