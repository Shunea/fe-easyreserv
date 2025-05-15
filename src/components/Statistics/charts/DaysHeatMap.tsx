// import React, { useEffect } from 'react';
// import ApexCharts from 'apexcharts';
// import "../styles/styles.css"
// const DaysHeatMap = () => {
//   // Funcție pentru generarea datelor pentru heatmap
//   const generateData = (count, yrange) => {
//     let i = 0;
//     const series:any = [];
//     while (i < count) {
//       const x = 'w' + (i + 1).toString();
//       const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
//       series.push({
//         x: x,
//         y: y
//       });
//       i++;
//     }
//     return series;
//   };

//   useEffect(() => {
//     const options = {

//       series: [{
//         name: 'Jan',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Feb',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Mar',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Apr',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'May',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Jun',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Jul',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Aug',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       },
//       {
//         name: 'Sep',
//         data: generateData(20, {
//           min: 0,
//           max: 100
//         })
//       }],
//       chart: {
//         height: 350,
//         type: 'heatmap',
//         toolbar: {
//             show: false // Ascunde meniul de navigare
//           }

//       },
//       plotOptions: {
//         heatmap: {
//           radius: 10,
//           enableShades:true,
//           useFillColorAsStroke: false,
//           colorScale: {
//             ranges: [{
//                 from: 90,
//                 to:100,
//                 name: 'high',
//                 color: '#23b121'
//               },
//               {
//                 from: 60,
//                 to: 89,
//                 name: 'medium',
//                 color: '#74e572'
//               },
//               {
//                 from: 0,
//                 to: 59,
//                 name: 'low',
//                 color: '#c5ebc5'
//               },

//             ]
//           }
//         }
//       },

//       dataLabels: {
//         enabled: false
//       },
//       stroke: {
//         width: 10,

//       },
//       legend:{
//         show:false
//       },

//       yaxis: {
//         labels: {
//           show: true
//         }
//       },
//       grid: {
//         padding: {

//         }
//       },

//     };

//     const chart = new ApexCharts(document.querySelector("#chart"), options);
//     chart.render();

//     // Cleanup function
//     return () => {
//       chart.destroy();
//     };
//   }, []);

//   return (
//     <div id="chart"></div>
//   );
// };

// export default DaysHeatMap;

// import React, { useState, useEffect } from "react";
// import Tooltip from "@uiw/react-tooltip";
// import HeatMap from "@uiw/react-heat-map";

// const value = [
//   { date: "2016/01/11", count: 2 },
//   ...[...Array(17)].map((_, idx) => ({
//     date: `2016/01/${idx + 10}`,
//     count: idx,
//   })),
//   ...[...Array(17)].map((_, idx) => ({
//     date: `2016/02/${idx + 10}`,
//     count: idx,
//   })),
//   { date: "2016/04/12", count: 2 },
//   { date: "2016/05/01", count: 5 },
//   { date: "2016/05/02", count: 5 },
//   { date: "2016/05/03", count: 1 },
//   { date: "2016/05/04", count: 11 },
//   { date: "2016/05/08", count: 32 },
// ];

// const DaysHeatMap = () => {
//   const [tooltipContent, setTooltipContent] = useState<null | string>(null);
//   const [isHovering, setIsHovering] = useState(false);

//   useEffect(() => {
//     if (!isHovering) {
//       setTooltipContent(null);
//     }
//   }, [isHovering]);

//   return (
//     <>
//       <HeatMap
//         value={value}
//         width="100%"
//         height="100%"
//         startDate={new Date("2016/01/01")}
//         rectRender={(props, data) => {
//           return (
//             <rect
//               {...props}
//               onMouseEnter={() => {
//                 // Set tooltip content when mouse enters the heatmap square
//                 setTooltipContent(`count: ${data.count || 0}`);
//                 setIsHovering(true);
//               }}
//               onMouseLeave={() => {
//                 setIsHovering(false);
//               }}
//             >
//               <div
//                 style={{
//                   display: "inline-block",
//                   background: "white",
//                   padding: "5px",
//                   border: "1px solid black",
//                 }}
//               >
//                 {tooltipContent}
//               </div>
//             </rect>
//           );
//         }}
//       ></HeatMap>
//     </>
//   );
// };

// export default DaysHeatMap;

// import React from 'react';
// import Tooltip from '@uiw/react-tooltip';
// import HeatMap from '@uiw/react-heat-map';

// const value = [
//   { date: '2016/01/11', count:2 },
//   ...[...Array(17)].map((_, idx) => ({ date: `2016/01/${idx + 10}`, count: idx, })),
//   ...[...Array(17)].map((_, idx) => ({ date: `2016/02/${idx + 10}`, count: idx, })),
//   { date: '2016/04/12', count:2 },
//   { date: '2016/05/01', count:5 },
//   { date: '2016/05/02', count:5 },
//   { date: '2016/05/03', count:1 },
//   { date: '2016/05/04', count:11 },
//   { date: '2016/05/08', count:32 },
// ];

// const DaysHeatMap = () => {
//   return (
//     <HeatMap
//       value={value}
//       width={600}
//       startDate={new Date('2016/01/01')}
//       rectRender={(props, data) => {
//         // if (!data.count) return <rect {...props} />;
//         return (
//           <Tooltip placement="top" content={`count: ${data.count || 0}`}>
//             <rect {...props} />

//           </Tooltip>
//         );
//       }}
//     />
//   )
// };
// export default DaysHeatMap

import React, { useEffect, useState } from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";
import PopUp from "./PopUp";

const value = [
  { date: "2016/01/01", count: 2 },
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/01/${idx + 10}`,
    count: idx,
  })),
  ...[...Array(17)].map((_, idx) => ({
    date: `2016/02/${idx + 10}`,
    count: idx,
  })),
  { date: "2016/04/12", count: 2 },
  { date: "2016/05/01", count: 5 },
  { date: "2016/05/02", count: 5 },
  { date: "2016/05/03", count: 1 },
  { date: "2016/05/04", count: 11 },
  { date: "2016/05/08", count: 32 },
  { date: "2016/05/09", count: 72 },
];

const generateRandomData = () => {
  const startDate = new Date("2016/01/01");
  const endDate = new Date("2016/06/09");
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const data:any = [];
  for (let i = 0; i <= diffDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    const count = Math.floor(Math.random() * 101); // Generează un număr aleatoriu între 0 și 100
    data.push({ date: formattedDate, count });
  }
  
  return data;
};
const DaysHeatMap = () => {
  const [props, setProps] = useState<React.SVGProps<SVGRectElement> | null>(
    null
  );
  const [content, setContent] = useState<null | any>(null);
  const [data,setData]=useState()
  useEffect(() => {
    console.log(props);
  }, [props]);
  useEffect(()=>{
    setData(generateRandomData())
  },[])
  return (
    <>
      <HeatMap
        value={data}
        width="100%"
        height={600}
        startDate={new Date("2016/01/01")}
        rectSize={34}
        weekLabels={[]}
        legendCellSize={0}
        panelColors={{
          0: "#EBEDF0",
          30: "rgba(197, 235, 197, 1)",
          70: "rgba(116, 229, 114, 1)",
          100: "rgba(35, 177, 33, 1)",
        }}
        rectRender={(props, data) => {
          const { x, y, width, height } = props;
          const rectGap = 4; // Spațiul dorit între rect-uri
          return (
            <>
              <rect
                onMouseEnter={() => {
                  setContent(data);
                  setProps(props);
                }}
                onMouseLeave={() => {
                  setContent(null);
                  setProps(null);
                }}
                {...props}
                rx={5}
                ry={5}
                x={Number(x) + rectGap} // Conversie la număr și adăugarea spațiului
                y={Number(y) + rectGap} // Conversie la număr și adăugarea spațiului
                width={Number(width) - 2 * rectGap} // Conversie la număr și ajustarea dimensiunii
                height={Number(height) - 2 * rectGap} // Reducem înălțimea pentru a compensa spațiul adăugat
              />
            </>
          );
        }}
      />
      {content && <PopUp data={content} props={props} />}
    </>
  );
};

export default DaysHeatMap;
