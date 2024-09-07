import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import apiRequest from "utils/api";

type EventSalesRatioPieProp = {
  data: any;
};

const EventSalesRatioPieResponsive: React.FC<EventSalesRatioPieProp> = ({ data }) => (
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
          id: "GA",
        },
        id: "dots",
      },
      {
        match: {
          id: "VIP",
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

type EventSalesRatioPieProps = {
  eventListingId: string;
};

const EventSalesRatioPie: React.FC<EventSalesRatioPieProps> = ({ eventListingId }) => {
  const [data, setData] = useState<any>([]);
  const [noData, setNoData] = useState<boolean>(false);
  const fetchEventSalesRatio = async () => {
    const response = await apiRequest("GET", `/analytics/sales/ratio/${eventListingId}`);
    if (response.ok) {
      let allData: { id: any; label: any; value: any; color: string; }[] = []
      response.data.forEach((r: { id: any; tickets: number }) => {
        allData.push({
          id: r.id,
          label: r.id,
          value: r.tickets,
          color: "hsl(18, 70%, 50%)",
        })
      })
      setData(allData);
      let noData = true
      response.data.forEach((r: { tickets: number; }) => {
        if (r.tickets > 0) {
          noData = false
        }
      })
      setNoData(noData)
    }
  };

  useEffect(() => {
    fetchEventSalesRatio();
  }, []);

  return (
    <>
      {noData ? (
        <div className="w-full h-96 flex justify-center items-center">
          <p className="text-primary text-h3 md:text-md-h3">You have no sales yet! 😢</p>
        </div>
      ) : (
        <EventSalesRatioPieResponsive data={data} />
      )}
    </>
  );
};

export default EventSalesRatioPie;
