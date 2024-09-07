import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import apiRequest from "utils/api";

type EventSalesSummaryLineProp = {
  data: any;
};

const EventSalesSummaryLineResponsive: React.FC<EventSalesSummaryLineProp> = ({
  data,
}) => (
  <ResponsiveLine
    animate={true}
    motionConfig="gentle"
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 70 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      // min: "auto",
      max: "auto",
      stacked: false,
      reverse: false,
    }}
    yFormat=" >-.2f"
    curve="monotoneX"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 15,
      tickRotation: 0,
      legend: "Date",
      legendOffset: 45,
      legendPosition: "middle",
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 15,
      tickRotation: 0,
      legend: "Reservation",
      legendOffset: -60,
      legendPosition: "middle",
      format: (value) => `${value}`,
    }}
    colors={{ scheme: "category10" }}
    lineWidth={3}
    pointColor={{ theme: "grid.line.stroke" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enablePointLabel={true}
    pointLabel="y"
    enableArea={true}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

type EventSalesSummaryLineProps = {
  eventListingId: string;
};

const EventSalesSummaryLine: React.FC<EventSalesSummaryLineProps> = ({
  eventListingId,
}) => {
  const [data, setData] = useState<any>([]);
  const fetchEventSalesSummaryLine = async () => {
    const response = await apiRequest(
      "GET",
      `/analytics/sales/${eventListingId}`
    );
    if (response.ok) {
      let allData: { id: any; color: string; data: { x: any; y: any; }[]; }[] = []
      response.data.forEach((r: { id: any; data: any[]; }) => {
        allData.push(
          {
            id: r.id,
            color: "hsl(18, 70%, 50%)",
            data: r.data.map((item: any) => ({
              x: item.xValue,
              y: item.yValue,
            }))
          }
        )
      })
      setData(allData)
    }
  };

  useEffect(() => {
    fetchEventSalesSummaryLine();
  }, [eventListingId]);

  return <EventSalesSummaryLineResponsive data={data} />;
};

export default EventSalesSummaryLine;
