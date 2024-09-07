import React, { useState } from "react";
import { Carousel } from "antd";
import LoadingPage from "system/LoadingPage";
import SalesSummaryLine from "../../components/host/charts/SalesSummaryLine";
import styled from "@emotion/styled";
import FollowersLine from "../../components/host/charts/FollowersLine";

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const onChange = () => {};

  const CarouselWrapper = styled(Carousel)`
  > .slick-dots li button {
    background: #184E77;
  }
  > .slick-dots li.slick-active button {
    background: #1E6091;
  }
`;

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <div className="pt-6">
        <CarouselWrapper afterChange={onChange} className="h-[70vh]">
          <div className="justify-center flex h-[65vh] px-6 pb-6">
            <p className="text-h1 md:text-h1-md text-primary mb-[-2vh]">Daily Sales Summary</p>
            <SalesSummaryLine />
          </div>
          <div className="justify-center flex h-[65vh] px-6 pb-6">
          <p className="text-h1 md:text-h1-md text-primary mb-[-2vh]">Followers Summary</p>
            <FollowersLine />
          </div>
        </CarouselWrapper>
      </div>
    );
  }
};

export default Analytics;
