import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import "../styles/styles.css"
interface Props {
  checkboxStates: {
    general: boolean;
    food: boolean;
    service: boolean;
    price: boolean;
    atmosphere: boolean;
  };
  data: any;
}




export default function RatingChart({ checkboxStates,data }: Props) {
  

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5, 6]}
/>
        <Tooltip cursor={{stroke:"black",strokeWidth:2}} />
        <defs>
          <linearGradient id="generalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={"0%"}
              stopColor="rgba(254, 152, 0, 1)"
              stopOpacity={0.5}
            />
            <stop
              offset={"10%"}
              stopColor="rgba(254, 152, 0, 1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={"0%"}
              stopColor="rgba(75, 226, 72, 1)"
              stopOpacity={0.5}
            />
            <stop
              offset={"10%"}
              stopColor="rgba(75, 226, 72, 1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={"0%"}
              stopColor="rgba(54, 186, 242, 1)"
              stopOpacity={0.5}
            />
            <stop
              offset={"10%"}
              stopColor="rgba(54, 186, 242, 1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={"0%"}
              stopColor="rgba(127, 0, 254, 1)"
              stopOpacity={0.5}
            />
            <stop
              offset={"10%"}
              stopColor="rgba(127, 0, 254, 1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="atmosphereGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset={"0%"}
              stopColor="rgba(209, 90, 183, 1)"
              stopOpacity={0.5}
            />
            <stop
              offset={"10%"}
              stopColor="rgba(209, 90, 183, 1)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        {checkboxStates.general && (
          <Area
            dataKey="totalRating"
            stroke="rgba(254, 152, 0, 1)"
            fill="url(#generalGradient)"
          />
        )}
        {checkboxStates.food && (
          <Area
            dataKey="foodRating"
            stroke="rgba(75, 226, 72, 1)"
            fill="url(#foodGradient)"
          />
        )}
        {checkboxStates.service && (
          <Area
            dataKey="serviceRating"
            stroke="rgba(54, 186, 242, 1)"
            fill="url(#serviceGradient)"
          />
        )}
        {checkboxStates.price && (
          <Area
            dataKey="priceRating"
            stroke="rgba(127, 0, 254, 1)"
            fill="url(#priceGradient)"
          />
        )}
        {checkboxStates.atmosphere && (
          <Area
            dataKey="ambienceRating"
            stroke="rgba(209, 90, 183, 1)"
            fill="url(#atmosphereGradient)"
          />
          
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
