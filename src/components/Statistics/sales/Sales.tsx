import React, { useEffect, useState } from "react";
import Header from "../Header";
import body from "../styles/clients.module.css";
import SalesChart from "../charts/SalesChart";
import { getSalesReports } from "src/auth/api/requests";
import { startOfMonth, endOfDay, format } from "date-fns";
import { log } from "console";

function Sales() {
  const Title = "Clients";

  const interval: Array<"day" | "week" | "month" | "year"> = [
    "year",
    "month",
    "week",
    "day",
  ];
  const [index, setIndex] = useState(2);

  const [selectedPeriodType, setSelectedPeriodType] = useState<
    "year" | "month" | "week" | "day"
  >(interval[index]);

  const [date, setDate] = useState<any>({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const startDate = startOfMonth(currentDate);
    const endDate = endOfDay(currentDate);

    setDate({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    });
  }, []);
  async function getSalesData(
    startDate: string,
    endDate: string,
    periodType: "day" | "week" | "month" | "year"
  ) {
    setIsLoading(true);
    
    const loaderTimeout = setTimeout(() => {
      if (isLoading) {
        setShowLoader(true);
      }
    }, 300);

    try {
      const response = await getSalesReports(startDate, endDate, periodType);
      console.log("API Response:", response);

      if (!response?.salesTotalsForRestaurant) return;

      let totalSum = 0;
      const formattedData: Array<{ date: string; total: number }> = [];

      // Перебираем данные из salesTotalsForRestaurant напрямую
      for (const [date, value] of Object.entries(response.salesTotalsForRestaurant)) {
        if (typeof value === 'object' && value !== null) {
          const total = (value as { total?: number }).total || 0;
          if (total > 0) {
            totalSum += total;
            formattedData.push({
              date,
              total
            });
          }
        }
      }

      console.log("Formatted Data:", formattedData);
      setTotal(totalSum);
      setDataSet(formattedData);
      
    } catch (e) {
      console.error("Error fetching sales data:", e);
    } finally {
      clearTimeout(loaderTimeout);
      setIsLoading(false);
      setShowLoader(false);
    }
  }

  useEffect(() => {
    if (date.startDate && date.endDate) {
      getSalesData(date.startDate, date.endDate, selectedPeriodType);
    }
  }, [date, selectedPeriodType]);

  const [data, setData] = useState<any>();
  const [dataSet, setDataSet] = useState<any>();
  useEffect(() => {
    if (data) {
      const resultArray = Object.keys(data).map((date) => ({
        date: date,
        total: data[date].total,
      }));
      setDataSet(resultArray);
    }
  }, [data]);
console.log(total);

  return (
    <>
      <Header
        setSelectedPeriodType={setSelectedPeriodType}
        index={index}
        setIndex={setIndex}
        date={date}
        setDate={setDate}
        title={"Sales"}
      />
      <div className={body.ClientsStatisticsBody}>
        <div style={{ height: 708 }} className={body.Statistics}>
          <div className={body.StatisticsHeader}>
            <span style={{ fontWeight: 600, fontSize: 20 }}>
              Detailed statistics
            </span>
            <div style={{position:"relative",display:"flex",gap:8}}>
              <span style={{fontWeight:400,fontSize:16}}>Total: <span style={{fontSize:20,fontWeight:700,color:"rgba(14, 0, 255, 1)"}}>{total?total:0}</span></span>
             <span style={{color:"rgba(2, 2, 2, 1)",opacity:0.35,fontWeight:500}}>MDL</span>
            </div>
          </div>

          <div style={{ height: "740px" }} className={body.Chart}>
            {showLoader ? (
              <div className={body.loaderContainer}>
                <div className={body.loader}></div>
                <p>Loading sales data...</p>
              </div>
            ) : (
              <SalesChart data={dataSet} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;
