import React, { useContext, useEffect, useState } from "react";
import classes from "../styles/statistics.module.css";
import { getDashboardStatistics } from "src/auth/api/requests";
import {
  arrowLeftIcon,
  arrowRightIcon,
  ColorsIcon,
} from "src/icons/icons";
import OccupancyChart from "../charts/OccupancyChart";
import { Context } from "./context";
import styles from '../styles/clients.module.css'
import { setDate } from "date-fns";
import Range from "./Range";
interface props {
  data: any[];
  handler: "main" | "times"
}
 const OcupancySection = ({ data,handler }: props) => {

  const intervalMain:Array<"month" | "week" | "day"> = [ "month", "week", "day"];
  const intervalTimes:Array<"day"|"hour"> = ["day", "hour"];

  const [mainIndex, setMainIndex] = useState(1);
  const [timesIndex, setTimesIndex] = useState(0);

  const IntervalSelectorMain = () => {
    return (
      <div style={{width:180}} className={styles.date_picker}>
        <div
          onClick={() => mainIndex > 0 && setMainIndex((prev) => prev - 1)}
          className={styles.DatePickerArrow}
        >
          {arrowLeftIcon}
        </div>
        <div className={styles.date_value}>By {intervalMain[mainIndex]}s</div>

        <div
          onClick={() =>
            mainIndex < intervalMain.length - 1 && setMainIndex((prev) => prev + 1)
          }
          className={styles.DatePickerArrow}
        >
          {arrowRightIcon}
        </div>
      </div>
    );
  };

  const IntervalSelectorTimes = () => {
    return (
      <div style={{width:180}} className={styles.date_picker}>
        <div
          onClick={() => timesIndex > 0 && setTimesIndex((prev) => prev - 1)}
          className={styles.DatePickerArrow}
        >
          {arrowLeftIcon}
        </div>
        <div className={styles.date_value}>Per {intervalTimes[timesIndex]}s</div>

        <div
          onClick={() =>
            timesIndex < intervalTimes.length - 1 && setTimesIndex((prev) => prev + 1)
          }
          className={styles.DatePickerArrow}
        >
          {arrowRightIcon}
        </div>
      </div>
    );
  };


  const [mainSelectedPeriodType, setMainSelectedPeriodType] = useState<
  "month" | "week" | "day"
  >(intervalMain[mainIndex]);  
  const [timesSelectedPeriodType, setTimesSelectedPeriodType] = useState<
 "day"|"hour"
  >(intervalTimes[timesIndex]);  



  
  useEffect(()=>{
      setMainSelectedPeriodType(intervalMain[mainIndex]);

    },[mainIndex])

  useEffect(()=>{
    setTimesSelectedPeriodType(intervalTimes[timesIndex]);
      
    },[timesIndex])
    
  console.log("main-->",mainSelectedPeriodType,"\ntimes-->",timesSelectedPeriodType);
  
    
const[date,setDate]=useState();
  return (
    <div className={classes.OccupancySection}>
      <div style={{height:data[0].name==="Mon"?88:112}} className={classes.OccupancyHeader}>
        <div className={classes.Title}>
          <div className={classes["Heading-title"]}>{data[0].name === "Mon" ?'Popular times':'Occupancy rate'}</div>
          <div className={classes.Legend}>
            <span>Low</span>
            <div className={classes.Colors}>{ColorsIcon}</div>
            <span>High</span>
          </div>
        </div>
        <div className={classes.Actions}>
          <div className={classes.Selector}>
        {handler==='main'?<IntervalSelectorMain/>:<IntervalSelectorTimes/>}
          </div>
        
          {handler==='main'&&
          <Range date={date} setDate={setDate} customHeight={40}/>
          }
        </div>
      </div>
      <div
        className={classes.OccupancyChart}
        style={{
          padding: data[0].name === "Mon" ? 0 : 10,
        // background:"red",
        height: data[0].name === "Mon" ? 250 :357,
        position:"relative"
        }}
      >
        {/* {handler==="main"?(<>{mainSelectedPeriodType==="day"?'day':mainSelectedPeriodType==="week"?"week":mainSelectedPeriodType==="month"?"month":"year"}</>):(<>{timesSelectedPeriodType==="day"?"day":"hour"}</>)} */}
        <OccupancyChart handler={handler} data={data} mainSelectedPeriodType={mainSelectedPeriodType} timesSelectedPeriodType={timesSelectedPeriodType} />
      </div>
      
    </div>
  );
};

export default OcupancySection;