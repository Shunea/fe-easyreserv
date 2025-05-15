import { useNavigate } from "react-router-dom";
import classes from "./Reporting.module.css";
import { NotificationButton } from "../Statistics/Header";
import { DashboardWalletIcon, DashboardLinkIcon, ReportingTimeIcon } from "../../icons/icons";

const Reporting = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/salesreport");
  };

  const handleDelaysClick = () => {
    navigate("/delaysreport");
  };

  return (
    <div className={classes.CommonReportingContainer}>
      <div className={classes.ReportingContainer}>
        <div className={classes.header}>
          <h1>Reporting</h1>
          <NotificationButton />
        </div>
        <div className={classes.CardsContainer} style={{ display: 'flex', gap: '20px' }}>
          <div className={classes.IndicatorCard} onClick={handleCardClick}>
            <div className={classes.IconContainer}>
              <div className={classes.IconControl}>
                <span className={classes.Icon}>{DashboardWalletIcon}</span>
              </div>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue} style={{ wordBreak: 'break-word' }}>
                <span className={classes.ContentValueText}>
                  Sales 
                </span>
              </div>
            </div>
            <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
          </div>

          <div 
            className={classes.IndicatorCard} 
            onClick={handleDelaysClick}
            style={{ background: "rgba(116, 229, 114, 0.10)" }}
          >
            <div className={classes.IconContainer}>
              <div className={classes.IconControl}>
                <span className={classes.Icon}>{ReportingTimeIcon}</span>
              </div>
            </div>
            <div className={classes.CardContent}>
              <div className={classes.ContentValue}>
                <span 
                  className={classes.ContentValueText}
                  style={{ color: "rgb(116, 229, 114)" }}
                >
                  Delays
                </span>
              </div>
            </div>
            <span className={classes.CardLinkIcon}>{DashboardLinkIcon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;