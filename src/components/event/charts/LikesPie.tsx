import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import apiRequest from "utils/api";

type LikesPieProp = {
  data: any;
};

const LikesPieResponsive: React.FC<LikesPieProp> = ({ data }) => (
  <ResponsivePie
    theme={{
      labels: { text: { fontSize: "0.9rem" } },
    }}
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={1}
    startAngle={-90}
    cornerRadius={4}
    activeOuterRadiusOffset={8}
    colors={{ scheme: "set1" }}
    borderColor={{ theme: "background" }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color", modifiers: [] }}
    arcLabelsTextColor="black"
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    fill={[
      {
        match: {
          id: "Likes",
        },
        id: "dots",
      },
      {
        match: {
          id: "Dislikes",
        },
        id: "dots",
      },
    ]}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        justify: false,
        translateX: 40,
        translateY: 56,
        itemsSpacing: 50,
        itemWidth: 100,
        itemHeight: 18,
        itemTextColor: "#000",
        itemDirection: "left-to-right",
        itemOpacity: 0.75,
        symbolSize: 18,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);

type LikesPieProps = {
  eventListingId: string;
};

const LikesPie: React.FC<LikesPieProps> = ({ eventListingId }) => {
  const [data, setData] = useState<any>([]);
  const [noData, setNoData] = useState<boolean>(false);
  const fetchLikesSummary = async () => {
    const response = await apiRequest("GET", `/analytics/likeDislike/${eventListingId}`);
    if (response.ok) {
      setData([
        {
          id: "Dislikes",
          label: "Dislikes",
          value: response.dislikes ? response.dislikes : 0,
          color: "hsl(18, 70%, 50%)",
        },
        {
          id: "Likes",
          label: "Likes",
          value: response.likes ? response.likes : 0,
          color: "hsl(18, 70%, 50%)",
        },
      ]);
      if (response.dislikes === 0 && response.likes === 0) {
        setNoData(true);
      }
    }
  };

  useEffect(() => {
    fetchLikesSummary();
  }, []);

  return (
    <>
      {noData ? (
        <div className="w-full h-96 flex justify-center items-center">
          <p className="text-primary text-h3 md:text-md-h3">You have no likes or dislikes yet! 😢</p>
        </div>
      ) : (
        <LikesPieResponsive data={data} />
      )}
    </>
  );
};

export default LikesPie;
