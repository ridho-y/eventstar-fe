import { Context } from "Router";
import React, { useContext, useState } from "react";
import Page403 from "system/Page403";
import LoadingPage from "system/LoadingPage";
import { Button, Carousel } from "antd";
import styled from "@emotion/styled";
import LikesPie from "components/event/charts/LikesPie";
import EventSalesSummaryLine from "components/event/charts/EventSalesSummaryLine";
import { useParams } from "react-router-dom";
import EventSalesRatioPie from "components/event/charts/EventSalesRatioPie";

const EventAnalytics: React.FC = () => {
  const { eventListingId } = useParams<{ eventListingId: string }>();
  const { getters } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const onChange = () => {};

  const CarouselWrapper = styled(Carousel)`
    > .slick-dots li button {
      background: #184e77;
    }
    > .slick-dots li.slick-active button {
      background: #1e6091;
    }
  `;

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <>
        {getters.isLoggedIn ? (
          <>
            <div className="bg-gray-50 mx-7 mt-5 mb-7 rounded border-[1px] border-secondary-dark min-h-[70vh]">
              <section className="flex flex-col">
                <div className="w-full px-10 h-full">
                  <div className="pt-6">
                    <CarouselWrapper
                      afterChange={onChange}
                      className="h-[70vh]"
                    >
                      <div className="justify-center flex h-[65vh] px-6 pb-6">
                        <div className="flex flex-row justify-between mb-[-2vh]">
                          <p className="text-h1 md:text-h1-md text-primary">
                            Event Daily Summary
                          </p>
                          <Button type="primary" className="mt-2" onClick={() => window.history.back()}>
                            Return To Event
                          </Button>
                        </div>
                        <EventSalesSummaryLine eventListingId={eventListingId} />
                      </div>
                      <div className="justify-center flex h-[65vh] px-6 pb-6">
                        <div className="flex flex-row justify-between mb-[-2vh]">
                          <p className="text-h1 md:text-h1-md text-primary">
                            Event Sales Ratio Summary
                          </p>
                          <Button type="primary" className="mt-2" onClick={() => window.history.back()}>
                            Return To Event
                          </Button>
                        </div>
                        <EventSalesRatioPie eventListingId={eventListingId} />
                      </div>
                      <div className="justify-center flex h-[65vh] px-6 pb-6">
                        <div className="flex flex-row justify-between mb-[-2vh]">
                          <p className="text-h1 md:text-h1-md text-primary">
                            Feedback Summary
                          </p>
                          <Button type="primary" className="mt-2" onClick={() => window.history.back()}>
                            Return To Event
                          </Button>
                        </div>
                        <LikesPie eventListingId={eventListingId} />
                      </div>
                    </CarouselWrapper>
                  </div>
                </div>
              </section>
            </div>
          </>
        ) : (
          <Page403 />
        )}
        <br></br>
      </>
    );
  }
};

export default EventAnalytics;
