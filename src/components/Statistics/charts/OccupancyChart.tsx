import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DaysHeatMap from "./DaysHeatMap";


const GradientBar = (props) => {
  const { x, y, width, height, gradient, borderRadius,handler } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={`${handler==='main'?27:16}` }
        height={height}
        fill={`url(#${gradient})`}
        // url(#${gradient})
        ry={`${handler==='main'?13:10}` }
        rx={`${handler==='main'?13:10}` }
        opacity={`${handler==='main'?height/220:height*1.54/220}` }
      />
    </g>
  );
};

interface props {
  data: any[];
  handler: "main" | "times";
  mainSelectedPeriodType: "month" | "week" | "day" 
  timesSelectedPeriodType: "day" | "hour"

}
const OccupancyChart = ({ data,handler,mainSelectedPeriodType,timesSelectedPeriodType }: props) => {

  const mainWeeks = [
    { name:"january", occupancy: 13 },
    { name:"", occupancy: 23 },
    { name:"", occupancy: 13 },
    { name:"", occupancy: 33 },
    { name:"february", occupancy: 16 },
    { name:"", occupancy: 17 },
    { name:"", occupancy: 11 },
    { name:"", occupancy: 8 },
    { name:"march", occupancy: 23 },
    { name:"", occupancy: 24 },
    { name:"", occupancy: 33 },
    { name:"", occupancy: 21 },
    { name:"april", occupancy: 18 },
    { name:"", occupancy: 13 },
    { name:"", occupancy: 19 },
    { name:"", occupancy: 17 },
    // { name:"feb", occupancy: 14 },
    // { name:"mar", occupancy: 12 },
    // { name:"apr", occupancy: 18 },
    // { name:"may", occupancy: 24 },
    // { name:"jun", occupancy: 22 },
    // { name:"jul", occupancy: 14 },
    // { name:"aug", occupancy: 16 },
    // { name:"sep", occupancy: 23 },
    // { name:"oct", occupancy: 4 },
    // { name:"nov", occupancy: 11 },
    // { name:"dec", occupancy: 4 },
  ];
  const mainMonths = [
    { name:"jan", occupancy: 13 },
    { name:"feb", occupancy: 14 },
    { name:"mar", occupancy: 12 },
    { name:"apr", occupancy: 18 },
    { name:"may", occupancy: 24 },
    { name:"jun", occupancy: 22 },
    { name:"jul", occupancy: 14 },
    { name:"aug", occupancy: 16 },
    { name:"sep", occupancy: 23 },
    { name:"oct", occupancy: 4 },
    { name:"nov", occupancy: 11 },
    { name:"dec", occupancy: 4 },
  ];
  



  const days=[
    { name: "mon", occupancy: 22 },
    { name: "tue", occupancy: 14 },
    { name: "wed", occupancy: 16 },
    { name: "thu", occupancy: 23 },
    { name: "fri", occupancy: 4 },
    { name: "sat", occupancy: 11 },
    { name: "sun", occupancy: 4 },
  ]
  const hours=[
    { name: "10am", occupancy: 22 },
    { name: "11am", occupancy: 14 },
    { name: "12pm", occupancy: 16 },
    { name: "1pm", occupancy: 23 },
    { name: "2pm", occupancy: 4 },
    { name: "3pm", occupancy: 11 },
    { name: "4pm", occupancy: 4 },
    { name: "5pm", occupancy: 6 },
    { name: "6pm", occupancy: 9 },
    { name: "8pm", occupancy: 13 },
    { name: "9pm", occupancy: 12 },
    { name: "10pm", occupancy: 15 },
  ]
  


  return (<>
  {handler==="main"&&mainSelectedPeriodType==="day"?
  <DaysHeatMap/>:
  <ResponsiveContainer width="100%" height="100%">
      <BarChart data={handler==='main'&&mainSelectedPeriodType==='week'?mainWeeks:mainSelectedPeriodType==='month'?mainMonths:days} margin={{ top: 40, bottom: mainSelectedPeriodType==="week"?0:30 }}>
        <XAxis
          dataKey="name"
          stroke="rgba(2, 2, 2, 0.5)"
          tickLine={false}
          axisLine={false}
          textAnchor="start"
          dx={mainSelectedPeriodType==='week'?-20:-30}
          dy={mainSelectedPeriodType==="week"?-305:16} // Adjust label position
        />
        <YAxis
          tickMargin={10}
          stroke="rgba(2, 2, 2, 0.5)"
          tickLine={false}
          axisLine={false}
          domain={[0, "dataMax"]}

        />
        <Tooltip cursor={{ fill: "none" }} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="10%" stopColor="rgba(35, 177, 33, 1)" />
            <stop offset="100%" stopColor="rgba(16, 139, 14, 1)" />
          </linearGradient>
        </defs>
        <Bar
          dataKey="occupancy"
          background={{ radius: 30, fill: "rgba(246, 246, 246, 1)", width: `${handler==='main'?27:16}` }}
          shape={
            <GradientBar handler={handler}  gradient="barGradient" borderRadius={13}  />
          }
       
          />

      </BarChart>
    </ResponsiveContainer>}
  </>
    
    
  );
};

export default OccupancyChart;
