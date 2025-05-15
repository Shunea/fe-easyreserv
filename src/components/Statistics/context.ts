import { IDashboardData } from './dashboard/Statistics';
import { createContext } from "react";

export const Context = createContext<{
  
  timesData: any[];
  occupancyData: any[];
  dashBoardData: IDashboardData;
}>({dashBoardData:{
  
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
},
   timesData: [
    { name: "Mon", occupancy: 0 },
    { name: "Tue", occupancy: 0 },
    { name: "Wed", occupancy: 0 },
    { name: "Thu", occupancy: 0 },
    { name: "Fri", occupancy: 0 },
    { name: "Sat", occupancy: 0},
    { name: "Sun", occupancy: 0 },
  ],
  
  occupancyData: [
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
  ] });


  