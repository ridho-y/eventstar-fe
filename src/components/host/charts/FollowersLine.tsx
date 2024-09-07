import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import apiRequest from "utils/api";

type FollowersLineProp = {
  data: any;
  max: number;
};

const FollowersLineResponsive: React.FC<FollowersLineProp> = ({ data, max }) => (
  <ResponsiveLine
    animate={true}
    motionConfig="gentle"
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 70 }}
    xScale={{ type: "point" }}
    yScale={{
      type: "linear",
      min: 0,
      max: max,
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
      legend: "Followers",
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

const FollowersLine: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [max, setMax] = useState<number>(0);
  const getMaxValue = (dataArray: any) => {
    if (!dataArray || dataArray.length === 0) {
      return 0;
    }
  
    let max = dataArray[0].yValue; // Initialize max with the first value in the first data array
    for (const item of dataArray) {
      if (item.yValue > max) {
        max = item.yValue;
      }
    }
  
    return max == 0 ? 100 : max;
  };
  const fetchFollowersSummary = async () => {
    const response = await apiRequest("GET", "/analytics/followers");
    if (response.ok) {
      setMax(getMaxValue(response.data));
      const data = [
       {
        id: "followers",
        color: "hsl(18, 70%, 50%)",
        data: response.data ? response.data.map((item: any) => ({
          x: item.xValue,
          y: item.yValue,
        })) : [],
       } 
      ]
      setData(data);
    }
  };

  useEffect(() => {
    fetchFollowersSummary()
  }, []);
  return <FollowersLineResponsive data={data} max={max} />;
};

export default FollowersLine;
