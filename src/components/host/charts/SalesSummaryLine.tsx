import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import apiRequest from "utils/api";

type SalesSummaryLineProp = {
  data: any;
};

const SalesSummaryLineResponsive: React.FC<SalesSummaryLineProp> = ({
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
      legend: "Revenue",
      legendOffset: -60,
      legendPosition: "middle",
      format: (value) => `$${value}`,
    }}
    colors={{ scheme: "accent" }}
    lineWidth={3}
    pointColor={{ theme: "grid.line.stroke" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    enablePointLabel={true}
    // pointLabel="y"
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

const SalesSummaryLine: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const fetchSalesSummary = async () => {
    const response = await apiRequest("GET", "/analytics/sales");
    if (response.ok) {
      const data = [
       {
        id: "sales",
        color: "hsl(0, 70%, 50%)",
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
    fetchSalesSummary()
  }, []);

  return <SalesSummaryLineResponsive data={data} />;
};

export default SalesSummaryLine;
