import React, { useEffect, useState } from 'react'
import StatisticsHeader from './StatisticsHeader'
import { Context } from '../context'
import StatisticsBody from './StatisticsBody'
import classes from "../styles/statistics.module.css"
import { getStatisticsReports } from '../../../auth/api/requests'

interface StatisticsProps {}

export interface IDashboardData{
  
  totalReservations:number 
  todayReservations:number 
  allClients:number 
  todayClients:number 
  totalRevenue:number 
  todayRevenue:number 
  placeRating:number 
  totalReviews:number 
  occupancyRate:number
  tableStatusAtMoment:number 
  popularTimes: {
    Mon: number
    Tue: number
    Wed: number
    Thu: number
    Fri: number
    Sat: number
    Sun: number  }

    
}
const Statistics: React.FC<StatisticsProps> = () => {

  const [occupancyData,setOccuppancyData]=useState<any[]>([
    { name: "Jan", customers: 100 },
    { name: "Feb", customers: 30},
    { name: "Mar", customers: 20 },
    { name: "Apr", customers: 50 },
    { name: "May", customers: 80 },
    { name: "Jun", customers: 60},
    { name: "Jul", customers: 45 },
    { name: "Aug", customers: 75 },
    { name: "Sep", customers: 90 },
    { name: "Oct", customers: 55 },
    { name: "Nov", customers: 40 },
    { name: "Dec", customers: 70 },
  ]);
  const [timesData,setTimeData]=useState<any[]>( [
    { name: "Mon", occupancy: 0 },
    { name: "Tue", occupancy: 0 },
    { name: "Wed", occupancy: 0 },
    { name: "Thu", occupancy: 0 },
    { name: "Fri", occupancy: 0 },
    { name: "Sat", occupancy: 0},
    { name: "Sun", occupancy: 0 },
  ]);


  
useEffect(()=>{
  async function getReports() {
    try{
       const res=await getStatisticsReports()
  setDashboardData(res);
  
  const updatedTimesData = timesData.map((t) => ({
    ...t,
    occupancy: res.popularTimes[t.name], 
  }));

  setTimeData(updatedTimesData);
  
    }catch(e){
      console.log(e);
      
    }
 
  
  }
  getReports()

},[])

const [dashBoardData,setDashboardData]=useState<IDashboardData>({
  
  totalReservations:0, 
  todayReservations:0, 
  allClients:0, 
  todayClients:0, 
  totalRevenue:0, 
  todayRevenue:0, 
  placeRating:0, 
  totalReviews:0, 
  occupancyRate:0,
  tableStatusAtMoment:0, 
  popularTimes: {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,  }
})


  return (
    <Context.Provider value={{dashBoardData,timesData, occupancyData}}>
    <div className={classes.StatisticsContainer}>
        <StatisticsHeader/>
        <StatisticsBody/>
    </div>
    </Context.Provider>
  )
}

export default Statistics

