import React, { useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  Legend,
} from "recharts";
import "../styles/styles.css";
// const data = [
//   {
//     date: "20-20-3",
//     sales: 2000,
//   },
//   {
//     date: "20-20-3",
//     sales: 24000,
//   },
//   {
//     date: "20-20-3",
//     sales: 4000,
//   },
//   {
//     date: "20-20-3",
//     sales: 23000,
//   },
//   {
//     date: "20-20-3",
//     sales: 24500,
//   },
//   {
//     date: "20-20-3",
//     sales: 4340,
//   },
// ];
interface Props {
  data: any;
}
interface CustomTooltipProps {
  active?: any;
  payload?: any;
  label?: any;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const bar = payload[0];

    return (
      <div className="custom-tooltip">
        <span>{salePopup}</span>
        <p
          style={{
            position: "absolute",
            top: 0,
            color: "white",
            left: "50%",
            transform: "translate(-50%)",
          }}
        >{`${bar.value}MDL`}</p>
      </div>
    );
  }

  return null;
};
const salePopup = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="95"
    height="31"
    viewBox="0 0 95 31"
    fill="none"
  >
    <rect y="0.451172" width="95" height="25" rx="8" fill="#020202" />
    <path
      d="M41.5 25.4512L46.0858 30.037C46.8668 30.818 48.1332 30.818 48.9142 30.037L53.5 25.4512H41.5Z"
      fill="#020202"
    />
  </svg>
);
function SalesChart({ data }: Props) {
  let [barGraphData, setBarGraphData] = useState<any>({});

  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorGradient" x1="1" y1="0" x2="0" y2="0">
            <stop offset="20%" stopColor="rgba(193, 189, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(193, 189, 255, 1)" />
          </linearGradient>
          <linearGradient id="colorGradientHover" x1="1" y1="0" x2="0" y2="0">
            <stop offset="20%" stopColor="rgba(14, 0, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(14, 0, 255, 1)" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={{ stroke: "rgba(0, 0, 0, 0.5)" }}
          tick={{ fill: "black", fontSize: 10 }}
        />
        <YAxis axisLine={false} tickLine={false} domain={[0, "dataMax"]} />{" "}
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={<CustomTooltip />}
          position={{
            x: barGraphData.x - 25 / 40 - 28,
            y: barGraphData.y - 40,
          }}
        />
        <Bar
          onMouseOver={(data) => {
            console.log("data", data);
            setBarGraphData(data);
          }}
          onMouseLeave={() => {
            setBarGraphData({});
          }}
          dataKey="total"
          fill="url(#colorGradient)"
          barSize={40}
          radius={[12, 12, 0, 0]}
          background={
            <Rectangle
              width={40}
              fill="rgba(246, 246, 246, 1)"
              radius={[12, 12, 0, 0]}
            />
          }
          activeBar={<Rectangle fill="url(#colorGradientHover)" />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SalesChart;
