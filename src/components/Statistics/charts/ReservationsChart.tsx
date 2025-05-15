// import React, { useEffect, useState } from "react";

// import {
//   BarChart,
//   Bar,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Rectangle,
// } from "recharts";
// import Spinner from "src/components/Spinner";
// import classes from "../styles/statistics.module.css";
// interface Props {
//   checkboxStates: {
//     missed: boolean;
//     canceled: boolean;
//     served: boolean;
//   };
//   data: any;
// }
// function ReservationsChart({ checkboxStates, data }: Props) {
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     if (data) {
//       setLoading(false);
//       console.log(data[0]);
//     } else {
//       setLoading(true);
//     }
//   }, [data]);

//   // console.log(checkboxStates);
//   return (
//     <>
//       {data===undefined ? (
//         <Spinner loading={true} customClassName={classes.loader} />
//       ) : (
//         <ResponsiveContainer width="100%" height="90%">
//           <BarChart
//             className="barchart"
//             data={data}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 20,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid vertical={false} />

//             <XAxis
//               dataKey="date"
//               tickLine={{ stroke: "rgba(0, 0, 0, 0.5)" }} // linii pentru fiecare tick
//               tick={{ fill: "black", fontSize: 10 }}
//             />
//             <YAxis axisLine={false} tickLine={false} />
//             <Tooltip cursor={{ fill: "transparent" }} />

//             {checkboxStates.served && (
//               <Bar
//                 radius={
//                   (!checkboxStates.canceled && !checkboxStates.missed) ||
//                   data[0]?.missed === 0
//                     ? [12, 12, 0, 0]
//                     : undefined
//                 }
//                 dataKey="closed"
//                 stackId="a"
//                 fill="rgba(54, 186, 242, 1)"
//                 barSize={40}
//                 background={{
//                   fill: `${
//                     checkboxStates.served ? "rgba(246, 246, 246, 1)" : "none"
//                   }`,
//                   width: 40,
//                   radius: 12,
//                 }}
//               />
//             )}
//             {checkboxStates.canceled && (
//               <Bar
//                 radius={!checkboxStates.missed ? [12, 12, 0, 0] : undefined}
//                 dataKey="canceled"
//                 stackId="a"
//                 fill="rgba(242, 54, 54, 1)"
//                 barSize={40}
//                 background={{
//                   fill: `${
//                     !checkboxStates.served ? "rgba(246, 246, 246, 1)" : "none"
//                   }`,
//                   width: 40,
//                   radius: 12,
//                 }}
//               />
//             )}

//             {checkboxStates.missed && (
//               <Bar
//                 radius={[12, 12, 0, 0]}
//                 dataKey="missed"
//                 stackId="a"
//                 fill="rgba(33, 103, 209, 1)"
//                 barSize={40}
//                 background={{
//                   fill: `${
//                     !checkboxStates.canceled && !checkboxStates.served
//                       ? "rgba(246, 246, 246, 1)"
//                       : "none"
//                   }`,
//                   width: 40,
//                   radius: 12,
//                 }}
//               />
//             )}
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </>
//   );
// }

// export default ReservationsChart;

// import { useEffect, useRef, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact, {
//   HighchartsReactRefObject,
// } from "highcharts-react-official"; // Import HighchartsReact wrapper
// import "../styles/styles.css";
// import { he } from "date-fns/locale";

// interface Props {
//   checkboxStates: {
//     missed: boolean;
//     canceled: boolean;
//     served: boolean;
//   };
//   data: any[];
// }
// function ReservationsChart({ checkboxStates, data }: Props) {
//   const chartRef = useRef<HighchartsReactRefObject>(null); // Use HighchartsReactRefObject type for ref

//   let maxSum = 0;
//   let modifiedDatas: any[] = [];
//   useEffect(() => {
//     const maxsums: any[] = [];
//     if (data && data.length > 0) {
//       data.forEach((dataItem) => {
//         const sum =
//           (checkboxStates.served ? dataItem.closed : 0) +
//           (checkboxStates.canceled ? dataItem.canceled : 0) +
//           (checkboxStates.missed ? dataItem.missed : 0);
//         maxsums.push(sum);
//       });
//       maxSum = Math.max(...maxsums);

//       modifiedDatas = data.map((dataItem) => ({
//         ...dataItem,
//         background:
//           maxSum -
//           ((data && checkboxStates.missed ? dataItem.missed : 0) +
//             (data && checkboxStates.canceled ? dataItem.canceled : 0) +
//             (data && checkboxStates.served ? dataItem.closed : 0)),
//       }));
//     } else {
//       console.log("No data available.");
//     }
//   }, [data, checkboxStates]);

//   const [options, setOptions] = useState({
//     chart: {
//       type: "column",
//     },

//     title: {
//       text: "",
//     },
//     legend: {
//       enabled: false,
//     },
//     colors: [
//       "rgba(33, 103, 209, 1)",
//       "rgba(242, 54, 54, 1)",
//       "rgba(54, 186, 242, 1)",
//     ],
//     xAxis: {
//       categories: data ? data.map((d) => d.date) : [],
//     },
//     yAxis: {
//       title: {
//         text: "",
//       },
//     },
//     plotOptions: {
//       column: {
//         pointWidth: 30,
//         borderRadius: {
//           radius: 10,
//           scope: "stack",
//           where: "end",
//         },
//       },
//       series: {
//         stacking: "percent",
//       },
//     },

//     series: [
//       {
//         color: "#ddd",
//         enableMouseTracking: false,
//         showInLegend: false,
//         data: modifiedDatas ? modifiedDatas.map((d) => d.background) : [],
//       },
//       {
//         type: "column",
//         name: "missed",
//         data: checkboxStates.missed && data ? data.map((d) => d.missed) : [],
//       },
//       {
//         type: "column",
//         name: "canceled",
//         data:
//           checkboxStates.canceled && data ? data.map((d) => d.canceled) : [],
//       },

//       {
//         type: "column",
//         name: "closed",
//         data: checkboxStates.served && data ? data.map((d) => d.closed) : [],
//       },
//     ],
//   });

//   useEffect(() => {
//     setOptions((prevOptions) => ({
//       ...prevOptions,
//       xAxis: {
//         categories: data ? data.map((d) => d.date) : [],
//       },
//       series: [
//         {
//           ...prevOptions.series[0],
//           data: modifiedDatas ? modifiedDatas.map((d) => d.background) : [],
//         },
//         {
//           ...prevOptions.series[1],
//           data: checkboxStates.missed && data ? data.map((d) => d.missed) : [],
//         },
//         {
//           ...prevOptions.series[2],
//           data:
//             checkboxStates.canceled && data ? data.map((d) => d.canceled) : [],
//         },
//         {
//           ...prevOptions.series[3],
//           data: checkboxStates.served && data ? data.map((d) => d.closed) : [],
//         },
//       ],
//     }));

// console.log(data&&data.every((item) => checkboxStates.missed&&item.missed === 0 && checkboxStates.served&&item.closed === 0 &&checkboxStates.canceled&& item.canceled === 0))
//   }, [data, checkboxStates]);

//   return (
//     <div>
//       {data &&
//       data.length &&
//      data.every((item) => checkboxStates.missed&&item.missed === 0 && checkboxStates.served&&item.closed === 0 &&checkboxStates.canceled&& item.canceled === 0 ) ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "end",
//             height: "160px",
//           }}
//         >
//           <h1>Nu există date</h1>
//         </div>
//       ) : (
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           ref={chartRef}
//         />
//       )}
//     </div>
//   );
// }

// export default ReservationsChart;

import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import "../styles/styles.css";

interface Props {
  checkboxStates: {
    missed: boolean;
    canceled: boolean;
    served: boolean;
  };
  data: any[];
}

function ClientsChart({ checkboxStates, data }: Props) {
  const chartRef = useRef<HighchartsReactRefObject>(null);

  const [maxSum, setMaxSum] = useState(0);
  const [modifiedDatas, setModifiedDatas] = useState<any[]>([]);

  useEffect(() => {
    const maxsums: any[] = [];
    if (data && data.length > 0) {
      const modifiedData = data.map((dataItem) => {
        const sum =
          (checkboxStates.served ? dataItem.closed : 0) +
          (checkboxStates.canceled ? dataItem.canceled : 0) +
          (checkboxStates.missed ? dataItem.missed : 0);

        const modifiedData = data.map((dataItem) => ({
          ...dataItem,
          background:
            maxSum -
            ((data && checkboxStates.missed ? dataItem.missed : 0) +
              (data && checkboxStates.canceled ? dataItem.canceled : 0) +
              (data && checkboxStates.served ? dataItem.closed : 0)),
        }));
        maxsums.push(sum);
        return {
          missed: checkboxStates.missed ? dataItem.missed : 0,
          closed: checkboxStates.served ? dataItem.closed : 0,
          canceled: checkboxStates.canceled ? dataItem.canceled : 0,
          background: maxSum - sum,
        };
      });
      setModifiedDatas(modifiedData);
      setMaxSum(Math.max(...maxsums));
    } else {
      console.log("No data available.");
    }
  }, [data, checkboxStates, maxSum]);

  const [options, setOptions] = useState({
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    colors: [
      "rgba(33, 103, 209, 1)",
      "rgba(242, 54, 54, 1)",
      "rgba(54, 186, 242, 1)",
    ],    xAxis: {
      categories: data ? data.map((d) => d.date) : [],
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    plotOptions: {
      column: {
        pointWidth: 30,
        groupPadding: 0, // remove the padding between groups of columns
        pointPadding: 0, // remove the padding between individual columns
        borderRadius: {
          radius: 10,
          scope: "stack",
          where: "end",
        },
      },
      series: {
        stacking: "percent",
      },
    },
    series: [
      {
        color: "rgb(246, 246, 246)",
        enableMouseTracking: false,
        showInLegend: false,
        data: modifiedDatas ? modifiedDatas.map((d) => d.background) : [],
      },
      {
        type: "column",
        name: "missed",
        data: checkboxStates.missed && data ? data.map((d) => d.missed) : [],
      },
      {
        type: "column",
        name: "canceled",
        data:
          checkboxStates.canceled && data ? data.map((d) => d.canceled) : [],
      },
      {
        type: "column",
        name: "closed",
        data: checkboxStates.served && data ? data.map((d) => d.closed) : [],
      },
    ],
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xAxis: {
        categories: data ? data.map((d) => d.date) : [],
      },
      series: [
        {
          ...prevOptions.series[0],
          data: modifiedDatas ? modifiedDatas.map((d) => d.background) : [],
        },
        {
          ...prevOptions.series[1],
          data: checkboxStates.missed && data ? data.map((d) => d.missed) : [],
        },
        {
          ...prevOptions.series[2],
          data:
            checkboxStates.canceled && data ? data.map((d) => d.canceled) : [],
        },
        {
          ...prevOptions.series[3],
          data: checkboxStates.served && data ? data.map((d) => d.closed) : [],
        },
      ],
    }));
    console.log(modifiedDatas);
   
  }, [data, checkboxStates, modifiedDatas]);

  return (
    <div>
      {!modifiedDatas ||
      modifiedDatas.every((i) => i.missed === 0 && i.canceled === 0 && i.closed === 0) ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            height: "160px",
          }}
        >
          <h1>Nu există date</h1>
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartRef}
        />
      )}
    </div>
  );
}

export default ClientsChart;
