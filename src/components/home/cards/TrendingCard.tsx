import React, { useContext } from "react";
import { Card } from "antd";
import { Context } from "Router";

type TrendingCardProps = {
  title: string;
  icon: React.ReactNode;
  tag: string;
};

const TrendingCard: React.FC<TrendingCardProps> = ({ title, icon, tag }) => {
  const { setters} = useContext(Context);

  const handleCategoryClick = (tag: string, title: string) => {
    setters.setTrendingTag(tag);
    setters.setTrendingTitle(title);
  };

  return (
    <Card
      onClick={() => handleCategoryClick(tag, title)}
      hoverable
      className="flex items-center transition-all duration-300 ease-in-out transform-gpu hover:scale-105"
      style={{
        background: 'linear-gradient( 109.6deg, #34A0A4 11.2%, #1E6091 91.1% )',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Card.Meta
        avatar={
          <div
            style={{
              color: '#B5E48C',
              fontSize: '16px',
              marginRight: '8px',
            }}
          >
            {icon}
          </div>
        }
        title={
          <div
            style={{
              color: '#fff',
              fontSize: '16px',
            }}
          >
            {title}
          </div>
        }
      />
    </Card>
  );
};

export default TrendingCard;
