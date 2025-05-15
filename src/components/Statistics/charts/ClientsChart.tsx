import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact, {
  HighchartsReactRefObject,
} from "highcharts-react-official";
import "../styles/styles.css";

interface Props {
  checkboxStates: {
    unique: boolean;
    recurrent: boolean;
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
          (checkboxStates.unique ? dataItem.unique : 0) +
          (checkboxStates.recurrent ? dataItem.recurrent : 0);
        maxsums.push(sum);
        return {
          recurrent: checkboxStates.recurrent?dataItem.recurrent:0,
          unique: checkboxStates.unique?dataItem.unique:0,
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
    colors: ["rgba(5, 110, 198, 1)", "rgba(54, 186, 242, 1)"],
    xAxis: {
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
        name: "unique",
        data: checkboxStates.unique && data ? data.map((d) => d.unique) : [],
      },
      {
        type: "column",
        name: "recurrent",
        data:
          checkboxStates.recurrent && data
            ? data.map((d) => (d.recurrent))
            : [],
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
          data:
            checkboxStates.unique && data
              ? modifiedDatas.map((d) => (d.unique))
              : [],
        },
        {
          ...prevOptions.series[2],
          data:
            checkboxStates.recurrent && data
              ? modifiedDatas.map((d) => (d.recurrent))
              : [],
        },
      ],
    }));
    console.log(modifiedDatas);
    console.log(modifiedDatas.every(i=>i.recurrent===0&&i.unique===0));
    
  }, [data, checkboxStates, modifiedDatas]);

  return (
    <div>
      {!modifiedDatas ||modifiedDatas.every(i=>i.recurrent===0&&i.unique===0)? (
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