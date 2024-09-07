import React, { memo } from "react";
import { Row, Col } from "antd";
import {
  FileTextOutlined,
  CustomerServiceOutlined,
  TrophyOutlined,
  CalendarOutlined,
  HeartOutlined,
  LineChartOutlined,
  CoffeeOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import TrendingCard from "./cards/TrendingCard";

const trendingCards = [
  { id: 1, title: "Top", icon: <FileTextOutlined />, tag: "top" },
  { id: 2, title: "Music", icon: <CustomerServiceOutlined />, tag: "music" },
  {
    id: 3,
    title: "Sports & Fitness",
    icon: <TrophyOutlined />,
    tag: "sports",
  },
  { id: 4, title: "Seasonal", icon: <CalendarOutlined />, tag: "seasonal" },
  { id: 5, title: "Health", icon: <HeartOutlined />, tag: "health" },
  { id: 6, title: "Business", icon: <LineChartOutlined />, tag: "business" },
  { id: 7, title: "Food & Drink", icon: <CoffeeOutlined />, tag: "food" },
  { id: 8, title: "Tech", icon: <LaptopOutlined />, tag: "tech" },
];

type defaultProps = {
  deviceType: string;
};

const TrendingCategories: React.FC<defaultProps> = memo(({ deviceType }) => {
  return (
    <>
      {deviceType === "desktop" ? (
        <div>
          <p className="text-h2 font-bold" style={{ fontSize: "1.5rem" }}>
            Check out trending categories
          </p>
          <div className="mx-8">
            <Row gutter={[16, 16]} className="mt-4 pb-10">
              {trendingCards.map((card) => (
                <Col key={card.id} xs={24} sm={12} md={6}>
                  <TrendingCard {...card} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      ) : (
        <div>
          <p className="font-bold text-h3-md">Check out trending categories</p>
          <div className="mx-4">
            <Row gutter={[8, 8]} className="mt-4 pb-10">
              {trendingCards.map((card) => (
                <Col key={card.id} xs={24} sm={12} md={6} lg={6}>
                  <TrendingCard {...card} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </>
  );
});

export default TrendingCategories;
