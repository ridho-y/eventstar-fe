import React from "react";
import { Col, Row } from 'antd';
import EventCard from "components/home/cards/EventCard";

type EventDisplayerProps = {
  events: any[]
};

const EventDisplayer: React.FC<EventDisplayerProps> = ({ events }) => {

  return (
    <Row gutter={[24, 24]} className="mt-4 mb-8">
      {events.map((card, i) => (
        <Col key={i} xs={24} sm={12} md={12} lg={8} xl={6}>
          <EventCard {...card} />
        </Col>
      ))}
    </Row>
  );
};

export default EventDisplayer;
