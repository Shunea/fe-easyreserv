import { getDashboardStatistics } from "src/auth/api/requests";
import {
  DashboardCalendarIcon,
  DashboardHumanIcon,
  DashboardLinkIcon,
  DashboardListIcon,
  DashboardStarIcon,
  DashboardTimeIcon,
  DashboardWalletIcon,
} from "../../icons/icons";
import classes from "./KeyIndicators.module.css";
import { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";

function convertToShortFormat(number: number) {
  if (number >= 1000) {
    const roundedNumber = Math.floor(number / 1000);
    return `${roundedNumber}K`;
  }

  return number;
}

type Props = {};
const KeyIndicators = (props: Props) => {
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStatistics = await getDashboardStatistics();
        setStatistics(dashboardStatistics);
      } catch (error) {
        console.error("Can't get statistics: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={classes.KeyIndicators}>
      <div className={classes.IndicatorsRow}>
        <div
          className={classes.IndicatorCard}
          style={{ background: "rgba(116, 229, 114, 0.10)" }}
        >
          <div className={classes.IconContainer}>
            <div className={classes.IconControl}>
              <span className={classes.Icon}>{DashboardTimeIcon}</span>
            </div>
          </div>
          <div className={classes.CardContent}>
            <div className={classes.ContentValue}>
              <span
                className={classes.ContentValueText}
                style={{ color: "var(--rate-3, #74E572)" }}
              >
                {statistics.occupancyRate}%
              </span>
            </div>
            <div className={classes.ContentLabel}>
              <span className={classes.ContentLabelText}>occupancy rate</span>
            </div>
          </div>
          <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
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
                style={{ color: "#4BE248" }}
              >
                {statistics.placeRating}
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
          </div>
          <span className={classes.CardLinkIcon} style={{ color: "white" }}>
            {DashboardLinkIcon}
          </span>
        </div>
      </div>
      <div className={classes.IndicatorsRow}>
        <div
          className={classes.IndicatorCard}
          style={{ background: "rgba(14, 0, 255, 0.10)" }}
        >
          <div className={classes.IconContainer}>
            <div className={classes.IconControl}>
              <span className={classes.Icon}>{DashboardWalletIcon}</span>
            </div>
          </div>
          <div className={classes.CardContent}>
            <div className={classes.ContentValue} style={{ wordBreak: 'break-word' }}>
              <span
                className={classes.ContentValueText}
                style={{ 
                  color: "#0E00FF",
                  fontSize: "40px",
                  display: "inline-block"
                }}
              >
                {Number.isInteger(statistics.todayRevenue) 
                  ? statistics.todayRevenue?.toLocaleString('ru-RU')
                  : statistics.todayRevenue?.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                }
              </span>
            </div>
              <span className={classes.CurrencyLabel}>MDL</span>
            <div className={classes.ContentLabel}>
              <span className={classes.ContentLabelText}>today revenue</span>
            </div>
          </div>
          <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
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
            <div className={classes.ContentValue} style={{ wordBreak: 'break-word' }}>
              <span
                className={classes.ContentValueText}
                style={{ 
                  color: "#81559B",
                  fontSize: "40px",
                  display: "inline-block"
                }}
              >
                {Number.isInteger(statistics.averageCheck)
                  ? statistics.averageCheck?.toLocaleString('ru-RU')
                  : statistics.averageCheck?.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                }
              </span>
            </div>
              <span className={classes.CurrencyLabel}>MDL</span>
            <div className={classes.ContentLabel}>
              <span className={classes.ContentLabelText}>average check</span>
            </div>
          </div>
          <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
        </div>
      </div>
      <div className={classes.IndicatorsRow}>
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
              <span
                className={classes.ContentValueText}
                style={{ color: "#FE9800" }}
              >
                {statistics.todayReservations}
              </span>
            </div>
            <div className={classes.ContentLabel}>
              <span className={classes.ContentLabelText}>
                today reservations
              </span>
            </div>
          </div>
          <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
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
              <span
                className={classes.ContentValueText}
                style={{ color: "#12664F" }}
              >
                {statistics.todayClients}
              </span>
            </div>
            <div className={classes.ContentLabel}>
              <span className={classes.ContentLabelText}>today clients</span>
            </div>
          </div>
          <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
        </div>
      </div>
    </div>
  );
};
export default KeyIndicators;
