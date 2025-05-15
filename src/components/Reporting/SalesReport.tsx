import { useEffect, useState } from "react";
import classes from "./SalesReport.module.css";
import { exportIcon, LeftArrow } from "src/icons/icons";
import { NotificationButton } from "../Statistics/Header";
import { useNavigate } from "react-router-dom";
import { getSalesReports } from "src/auth/api/requests";
import dayjs from "dayjs";
import { arrowLeftIcon, arrowRightIcon } from "src/icons/icons";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { getAuthenticatedUser, getRestaurantById } from "src/auth/api/requests";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SalesStats {
  dateTime: string;
  totalSales: number;
  totalDiscounts: number;
  totalOrders: {
    onSpot: number;
    takeAway: number;
  };
  totalPayments: {
    cash: number;
    card: number;
    transfer: number;
  };
  salesByZone: {
    hot: number;
    cold: number;
    fish: number;
    grill: number;
    desert: number;
    bar: number;
    kitchen: number;
    hookah: number;
  };
  totalTVA: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  salesByOperator: {
    [operatorId: string]: {
      totalAmount: number;
      transactionCount: number;
      username: string;
      role: string;
    };
  };
}

const SalesReport = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState<SalesStats[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [responseDataAvailable, setResponseDataAvailable] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const subtractMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
    setResponseDataAvailable(false);
  };

  const addMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
    setResponseDataAvailable(false);
  };

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        onClick={subtractMonth}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM, YYYY")}
      </div>
      <div
        onClick={addMonth}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      
      const loaderTimeout = setTimeout(() => {
        if (isLoading) {
          setShowLoader(true);
        }
      }, 300);

      try {
        const startDate = currentDate.startOf('month').format('YYYY-MM-DD');
        const endDate = currentDate.endOf('month').format('YYYY-MM-DD');
        const periodType = "month";
        
        const response = await getSalesReports(startDate, endDate, periodType);

        if (!response?.salesForTimePerSpace) {
          setSalesData([]);
          setResponseDataAvailable(false);
          return;
        }

        const salesArray = Object.values(response.salesForTimePerSpace)
          .flatMap(spaceData => {
            if (!spaceData || typeof spaceData !== 'object') return [];
            
            return Object.entries(spaceData)
              .map(([date, dayData]) => {
                const data = dayData as any;
                const zones = data.zones || {};
                
                const kitchenSales = calculateKitchenSales(zones);
                const barSales = Number(zones.bar || 0);

                return {
                  dateTime: date,
                  totalSales: Number(data.total) || 0,
                  totalDiscounts: Number(data.discounts) || 0,
                  totalOrders: {
                    onSpot: Number(data.orders?.onSpot) || 0,
                    takeAway: Number(data.orders?.takeAway) || 0
                  },
                  totalPayments: {
                    cash: Number(data.payments?.cash) || 0,
                    card: Number(data.payments?.card) || 0,
                    transfer: Number(data.payments?.transfer) || 0
                  },
                  salesByZone: {
                    ...zones,
                    kitchen: kitchenSales,
                    bar: barSales,
                    hookah: '-'
                  },
                  totalTVA: {
                    A: Number(data.tva?.A) || 0,
                    B: Number(data.tva?.B) || 0,
                    C: Number(data.tva?.C) || 0,
                    D: Number(data.tva?.D) || 0,
                    E: Number(data.tva?.E) || 0
                  },
                  salesByOperator: data.operators || {}
                };
              })
              .filter(sale => sale.totalSales > 0);
          })
          .sort((a, b) => dayjs(a.dateTime).valueOf() - dayjs(b.dateTime).valueOf());

        console.log('Processed sales data:', salesArray);
        setSalesData(salesArray);
        setResponseDataAvailable(salesArray.length > 0);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setSalesData([]);
        setResponseDataAvailable(false);
      } finally {
        clearTimeout(loaderTimeout);
        setIsLoading(false);
        setShowLoader(false);
      }
    };

    fetchSalesData();
  }, [currentDate]);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (isExportMenuOpen && !(e.target as Element).closest(`.${classes.exportWrapper}`)) {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isExportMenuOpen]);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const userData = await getAuthenticatedUser();
        console.log('User data:', userData);

        const restaurantId = userData?.restaurant?.id || 
                            userData?.restaurantId ||
                            userData?.Restaurant?.id;

        if (!restaurantId) {
          console.error('No restaurant ID found in user data');
          setRestaurantInfo('Default Restaurant');
          return;
        }

        const restaurantData = await getRestaurantById(restaurantId);
        console.log('Restaurant data:', restaurantData);

        if (!restaurantData?.name) {
          console.error('No restaurant name found');
          setRestaurantInfo('Default Restaurant');
          return;
        }

        setRestaurantInfo(restaurantData.name);
      } catch (error) {
        console.error('Error fetching restaurant info:', error);
        setRestaurantInfo('Restaurant');
      }
    };

    fetchRestaurantInfo();
  }, []);

  const calculateKitchenSales = (zones: SalesStats['salesByZone']) => {
    if (!zones) return 0;
    return (
      Number(zones.hot || 0) +
      Number(zones.cold || 0) +
      Number(zones.fish || 0) +
      Number(zones.grill || 0) +
      Number(zones.desert || 0)
    );
  };

  const totalSalesForMonth = salesData.reduce((sum, sale) => sum + sale.totalSales, 0);

  const handleExport = async (type: 'pdf' | 'excel') => {
    try {
      const restaurantName = restaurantInfo || 'Restaurant';

      if (!salesData || salesData.length === 0) {
        console.error('No sales data to export');
        return;
      }

      if (type === 'excel') {
        console.log('Starting Excel export...');
        const workbook = XLSX.utils.book_new();
        
        const titleData = [
          [restaurantName],
          ['Sales Report'],
          [`Period: ${currentDate.format('MMMM YYYY')}`],
          [],
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(titleData);

        const salesRows = salesData.map(sale => ({
          'Date': dayjs(sale.dateTime).format('YYYY-MM-DD HH:mm'),
          'Total Sales': sale.totalSales || 0,
          'Total Discounts': sale.totalDiscounts || 0,
          'On Spot Orders': sale.totalOrders?.onSpot || 0,
          'Take Away Orders': sale.totalOrders?.takeAway || 0,
          'Cash Payments': sale.totalPayments?.cash || 0,
          'Card Payments': sale.totalPayments?.card || 0,
          'Transfer Payments': sale.totalPayments?.transfer || 0,
          'Kitchen Sales': calculateKitchenSales(sale.salesByZone) || 0,
          'Bar Sales': sale.salesByZone?.bar || 0,
          'TVA A': sale.totalTVA?.A || 0,
          'TVA B': sale.totalTVA?.B || 0,
          'TVA C': sale.totalTVA?.C || 0,
          'TVA D': sale.totalTVA?.D || 0,
          'TVA E': sale.totalTVA?.E || 0
        }));

        XLSX.utils.sheet_add_json(worksheet, salesRows, { 
          origin: { r: titleData.length + 1, c: 0 } 
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
        
        XLSX.writeFile(workbook, `${restaurantName}-sales-report-${currentDate.format('YYYY-MM')}.xlsx`);
      } 
      else if (type === 'pdf') {
        console.log('Starting PDF export...');
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text(restaurantName, 15, 30);
        doc.setFontSize(16);
        doc.text('Sales Report', 15, 40);
        doc.text(`Period: ${currentDate.format('MMMM YYYY')}`, 15, 50);

        const tableData = salesData.map(sale => [
          dayjs(sale.dateTime).format('YYYY-MM-DD HH:mm'),
          sale.totalSales || 0,
          sale.totalDiscounts || 0,
          sale.totalOrders?.onSpot || 0,
          sale.totalOrders?.takeAway || 0,
          sale.totalPayments?.cash || 0,
          sale.totalPayments?.card || 0,
          sale.totalPayments?.transfer || 0,
          calculateKitchenSales(sale.salesByZone) || 0,
          sale.salesByZone?.bar || 0,
          sale.totalTVA?.A || 0,
          sale.totalTVA?.B || 0,
          sale.totalTVA?.C || 0,
          sale.totalTVA?.D || 0,
          sale.totalTVA?.E || 0
        ]);

        doc.autoTable({
          head: [['Date', 'Total Sales', 'Discounts', 'On Spot', 'Take Away', 
                  'Cash', 'Card', 'Transfer', 'Kitchen', 'Bar',
                  'TVA A', 'TVA B', 'TVA C', 'TVA D', 'TVA E']],
          body: tableData,
          startY: 60,
          styles: { fontSize: 8 },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 8,
            fontStyle: 'bold'
          }
        });

        doc.save(`${restaurantName}-sales-report-${currentDate.format('YYYY-MM')}.pdf`);
      }
      
      setIsExportMenuOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className={classes.CommonSalesContainer}>
      <div className={classes.SalesContainer}>
        <div className={classes.header}>
          <div className={classes.titleContainer}>
            <button className={classes.BackButton} onClick={() => navigate("/reporting")}>
              <span className={classes.LeftArrow}>{LeftArrow}</span>
            </button>
            <h1>Sales</h1>
            {datepicker}
            <div className={classes.totalSales}>
              Total sales for selected month: {totalSalesForMonth}
            </div>
          </div>
          <div className={classes.headerActions}>
            <div className={classes.exportWrapper}>
              <button 
                className={classes.Export} 
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              >
                {exportIcon}
                <span>Export</span>
              </button>
              {isExportMenuOpen && (
                <div className={classes.exportMenu}>
                  <div 
                    className={classes.exportMenuItem} 
                    onClick={() => {
                      console.log('Exporting PDF...');
                      handleExport('pdf');
                    }}
                  >
                    Export PDF
                  </div>
                  <div 
                    className={classes.exportMenuItem} 
                    onClick={() => {
                      console.log('Exporting Excel...');
                      handleExport('excel');
                    }}
                  >
                    Export Excel
                  </div>
                </div>
              )}
            </div>
            <NotificationButton />
          </div>
        </div>
        <div className={classes.tableContainer}>
          {showLoader ? (
            <div className={classes.loaderContainer}>
              <div className={classes.loader}></div>
              <p>Loading sales data...</p>
            </div>
          ) : (
            <>
              <div className={classes.tableHeaderMain}>
                <div>Date and time</div>
                <div>Total sales</div>
                <div>Total discounts</div>
                <div className={classes.groupColumn}>
                  <div className={classes.groupTitle}>Total orders</div>
                  <div className={classes.subColumns}>
                    <div>On the spot</div>
                    <div>Take away</div>
                  </div>
                </div>
                <div className={classes.groupColumn}>
                  <div className={classes.groupTitle}>Total payments</div>
                  <div className={classes.subColumns}>
                    <div>Cash</div>
                    <div>Card</div>
                    <div>Transfer</div>
                  </div>
                </div>
                <div>Kitchen sales</div>
                <div>Bar sales</div>
                <div>Hookah sales</div>
                <div className={classes.groupColumn}>
                  <div className={classes.groupTitle}>TVA</div>
                  <div className={classes.subColumns}>
                    <div>A</div>
                    <div>B</div>
                    <div>C</div>
                    <div>D</div>
                    <div>E</div>
                  </div>
                </div>
              </div>
              
              <div className={classes.tableBody}>
                {Array.isArray(salesData) && salesData.length > 0 ? (
                  salesData.map((sale, index) => (
                    <div key={index}>
                      <div className={classes.tableRow}>
                        <div>{dayjs(sale?.dateTime).format('DD/MM/YYYY HH:mm')}</div>
                        <div>{sale?.totalSales || 0}</div>
                        <div>{sale?.totalDiscounts || 0}</div>
                        <div className={classes.groupColumn}>
                          <div className={classes.subColumns}>
                            <div>{sale?.totalOrders?.onSpot || 0}</div>
                            <div>{sale?.totalOrders?.takeAway || 0}</div>
                          </div>
                        </div>
                        <div className={classes.groupColumn}>
                          <div className={classes.subColumns}>
                            <div>{sale?.totalPayments?.cash || 0}</div>
                            <div>{sale?.totalPayments?.card || 0}</div>
                            <div>{sale?.totalPayments?.transfer || 0}</div>
                          </div>
                        </div>
                        <div>{sale.salesByZone.kitchen}</div>
                        <div>{sale.salesByZone.bar}</div>
                        <div>{sale.salesByZone.hookah}</div>
                        <div className={classes.groupColumn}>
                          <div className={classes.subColumns}>
                            <div>{sale?.totalTVA?.A || 0}</div>
                            <div>{sale?.totalTVA?.B || 0}</div>
                            <div>{sale?.totalTVA?.C || 0}</div>
                            <div>{sale?.totalTVA?.D || 0}</div>
                            <div>{sale?.totalTVA?.E || 0}</div>
                          </div>
                        </div>
                      </div>
                      {sale.salesByOperator && Object.entries(sale.salesByOperator).map(([operatorId, operatorData]) => (
                        <div key={operatorId} className={classes.operatorRow}>
                          <div className={classes.operatorName}>
                            {operatorData.username}
                          </div>
                          <div className={classes.operatorTotalSales}>
                            {operatorData.totalAmount}
                          </div>
                          <div className={classes.operatorPayments}>
                            <div>{sale.totalPayments?.cash || 0}</div>
                            <div>{sale.totalPayments?.card || 0}</div>
                            <div>{sale.totalPayments?.transfer || 0}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className={classes.noData}>No data available</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;