import classes from "../styles/statistics.module.css";
import {
  DashboardCalendarIcon,
  DashboardHumanIcon,
  DashboardLinkIcon,
  DashboardListIcon,
  DashboardStarIcon,
  freeColor,
  busyColor,
} from "src/icons/icons";
import { useState, useContext } from "react";
import OcupancySection from "../components/OcupancySection";
import { Context } from "../context";
import ChartPie from "../charts/ChartPie";
import { NavLink } from "react-router-dom";

const StatisticsBody = () => {
  function convertToShortFormat(number: number) {
    if (number >= 1000) {
      const roundedNumber = Math.floor(number / 1000);
      return `${roundedNumber}K`;
    }

    return number;
  }
  const { dashBoardData, timesData, occupancyData } = useContext(Context);

  return (
    <div className={classes.Body}>
      <div className={classes.Main}>
        <div className={classes.InfoCards}>
          <div
            className={classes.IndicatorCard}
            style={{ background: "rgba(254, 152, 0, 0.15)" }}
          >
            <div className={classes.IconContainer}>
              <div className={classes.IconControl}>
                <span className={classes.Icon}>{DashboardCalendarIcon}</span>
              </div>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue}>
                <span className={classes.ContentValueText}>
                  {convertToShortFormat(dashBoardData.totalReservations)}
                </span>
              </div>
              <div className={classes.ContentLabel}>
                <span className={classes.ContentLabelText}>
                  total closed reservations
                </span>
              </div>

              <div
                className={classes.TodayGain}
                style={{ color: "rgba(254, 152, 0, 1)" }}
              >
                <span>+{dashBoardData.todayReservations} today</span>
              </div>

              <NavLink to="/statistics/reservations">
                <span className={classes.CardLinkIcon}>
                  {DashboardLinkIcon}
                </span>
              </NavLink>
            </div>
          </div>
          <div
            className={classes.IndicatorCard}
            style={{ background: "rgba(18, 102, 79, 0.10)" }}
          >
            <div className={classes.IconContainer}>
              <div className={classes.IconControl}>
                <span className={classes.Icon}>{DashboardHumanIcon}</span>
              </div>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue}>
                <span className={classes.ContentValueText}>
                  {dashBoardData.allClients}
                </span>
              </div>
              <div className={classes.ContentLabel}>
                <span className={classes.ContentLabelText}>total clients</span>
              </div>

              <div
                className={classes.TodayGain}
                style={{ color: "rgba(18, 102, 79, 1)" }}
              >
                <span>+{dashBoardData.todayClients} today</span>
              </div>
              <NavLink to="/statistics/clients">
                <span className={classes.CardLinkIcon}>
                  {DashboardLinkIcon}
                </span>
              </NavLink>
            </div>
          </div>
          <div
            className={classes.IndicatorCard}
            style={{ background: "rgba(129, 85, 155, 0.10)" }}
          >
            <div className={classes.IconContainer}>
              <div className={classes.IconControl}>
                <span className={classes.Icon}>{DashboardListIcon}</span>
              </div>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue}>
                <span className={classes.ContentValueText}>
                  {convertToShortFormat(dashBoardData.totalRevenue)}
                </span>
                {/* <span className={classes.CurrencyLabel}>MDL</span> */}
                <div style={{position:"relative",display:"flex",gap:8}}>
             <span style={{color:"rgba(2, 2, 2, 1)",opacity:0.35,fontWeight:500}}>MDL</span>
            </div>
              </div>
              <div className={classes.ContentLabel}>
                <span className={classes.ContentLabelText}>total revenue</span>
              </div>

              <div
                className={classes.TodayGain}
                style={{ color: "rgba(14, 0, 255, 1)" }}
              >
                <span>+{dashBoardData.todayRevenue} today</span>
              </div>

              <NavLink to="/statistics/sales">
                <span className={classes.CardLinkIcon}>
                  {DashboardLinkIcon}
                </span>
              </NavLink>
            </div>
          </div>
          <div
            className={classes.IndicatorCard}
            style={{ background: "#202125" }}
          >
            <div className={classes.IconContainer}>
              <span className={classes.Icon}>{DashboardStarIcon}</span>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue}>
                <span
                  className={classes.ContentValueText}
                  style={{ color: "#fff" }}
                >
                  {dashBoardData.placeRating}
                </span>
              </div>
              <div className={classes.ContentLabel}>
                <span
                  className={classes.ContentLabelText}
                  style={{ color: "#FFF" }}
                >
                  place rating
                </span>
              </div>
              <div
                className={classes.TodayGain}
                style={{ color: "rgba(75, 226, 72, 1)" }}
              >
                <span>{dashBoardData.totalReviews} reviews</span>
              </div>
              <NavLink to="/statistics/rating">
                <span className={classes.CardLinkIcon} style={{ opacity: 1 }}>
                  {DashboardLinkIcon}
                </span>
              </NavLink>
            </div>
          </div>
        </div>

        <OcupancySection data={occupancyData} handler={"main"} />
      </div>

      <div className={classes.Sidebar}>
        {/* <div className={classes.TimeSection}>
          <OcupancySection data={timesData} handler={"times"} />
        </div>

        <div className={classes.TableSection}>
          <div className={classes.TimeHeader}>
            <span className={classes.Title}>Tables</span>
            <div
              className={classes.Legend}
              style={{ width: 109, justifyContent: "space-between" }}
            >
              <span>{busyColor} Busy</span> <span>{freeColor} Free</span>
            </div>
          </div>
          <div className={classes.TableChart}>
            <ChartPie />
          </div>
        </div> */}
        
         <div className={classes.TimeSection}>
          <OcupancySection data={timesData} handler={"times"} />
        </div>

        <div className={classes.TableSection}>
          <div className={classes.TimeHeader}>
            <span className={classes.Title}>Tables</span>
            <div
              className={classes.Legend}
              style={{ width: 109, justifyContent: "space-between" }}
            >
              <span>{busyColor} Busy</span> <span>{freeColor} Free</span>
            </div>
          </div>
          <div className={classes.TableChart}>
            <ChartPie />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StatisticsBody;
