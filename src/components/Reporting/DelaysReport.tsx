import { useEffect, useState } from "react";
import classes from "./DelaysReport.module.css";
import { exportIcon, LeftArrow } from "src/icons/icons";
import { NotificationButton } from "../Statistics/Header";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { arrowLeftIcon, arrowRightIcon } from "src/icons/icons";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { getClientReservation, getReservations, getAuthenticatedUser, getRestaurantById } from "src/auth/api/requests";
import { getAllProduts } from "src/auth/api/requests";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

interface DelayStats {
  productName: string;
  quantity: number;
  delayTime: number;
  dateTime: string;
  table: string;
  space: string;
  guest: string;
  waiter: string;
  preparationTime: number;
  totalSubmissionTime: number;
}

const DelaysReport = () => {
  const navigate = useNavigate();
  const [delaysData, setDelaysData] = useState<DelayStats[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [responseDataAvailable, setResponseDataAvailable] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<string | null>(null);

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
    const fetchDelaysData = async () => {
      setIsLoading(true);
      
      const loaderTimeout = setTimeout(() => {
        if (isLoading) {
          setShowLoader(true);
        }
      }, 300);

      try {
        const startDate = currentDate.startOf('month').format('YYYY-MM-DD');
        const endDate = currentDate.endOf('month').format('YYYY-MM-DD');
        
        console.log('Date range:', { startDate, endDate });
        
        const reservations = await getReservations();
        console.log('Raw reservations:', reservations);

        if (!Array.isArray(reservations.data)) {
          console.error('Reservations is not an array:', reservations);
          return;
        }
        
        const filteredReservations = reservations.data.filter(reservation => {
          const reservationDate = dayjs(reservation.createdAt);
          console.log('Checking reservation:', {
            date: reservation.createdAt,
            parsed: reservationDate.format('YYYY-MM-DD'),
            isInRange: reservationDate.isBetween(startDate, endDate, 'day', '[]')
          });
          return reservationDate.isBetween(startDate, endDate, 'day', '[]');
        });
        console.log('Filtered reservations:', filteredReservations);
        
        const delaysPromises = filteredReservations.map(reservation => 
          getClientReservation(reservation.id)
        );
        
        const reservationDetails = await Promise.all(delaysPromises);
        console.log('Reservation details:', reservationDetails);
        
        const mappedData: DelayStats[] = await Promise.all(
          reservationDetails.flatMap(async (response) => {
            const storedRestaurant = JSON.parse(localStorage.getItem("selectedRestaurant") || "{}");
            const allProducts = await getAllProduts(storedRestaurant.id);
            
            // Group orders by product title
            const groupedOrders = response.orders?.reduce((acc, order) => {
              const basePreparationTime = Number(allProducts.find(p => p.title === order.title)?.preparationTime) || 0;
              if (!acc[order.title]) {
                acc[order.title] = {
                  title: order.title,
                  quantity: Number(order.quantity) || 1,
                  // Multiply base preparation time by quantity for total preparation time
                  preparationTime: basePreparationTime
                };
              }
              return acc;
            }, {});

            // Create separate row for each unique product
            return Object.values(groupedOrders || {}).map((order: any) => ({
              productName: `${order.title} x${order.quantity}`,
              quantity: order.quantity,
              delayTime: response.delayTime,
              dateTime: response.general.date,
              table: response.general.table?.[0] || '',
              space: response.general.space?.[0] || '',
              guest: response.contacts.username,
              waiter: response.general.waiterName,
              // Use base preparation time without multiplying by quantity
              preparationTime: order.preparationTime,
              totalSubmissionTime: response.totalSubmissionTime
            }));
          })
        ).then(arrays => arrays.flat());

        setDelaysData(mappedData);
        setResponseDataAvailable(true);

      } catch (error) {
        console.error('Error fetching delays data:', error);
        setDelaysData([]);
        setResponseDataAvailable(false);
      } finally {
        clearTimeout(loaderTimeout);
        setIsLoading(false);
        setShowLoader(false);
      }
    };

    fetchDelaysData();
  }, [currentDate]);

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

  const handleExport = async (type: 'pdf' | 'excel') => {
    try {
      const restaurantName = restaurantInfo || 'Restaurant';

      if (!delaysData || delaysData.length === 0) {
        console.error('No delays data to export');
        return;
      }

      if (type === 'excel') {
        const workbook = XLSX.utils.book_new();
        
        const titleData = [
          [restaurantName],
          ['Delays Report'],
          [`Period: ${currentDate.format('MMMM YYYY')}`],
          [],
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(titleData);

        const delaysRows = delaysData.map(delay => ({
          'Product Name': delay.productName,
          'Delay Time (min:sec)': delay.delayTime,
          'Date and Time': dayjs(delay.dateTime).format('YYYY-MM-DD HH:mm'),
          'Table': delay.table,
          'Space': delay.space,
          'Guest': delay.guest,
          'Waiter': delay.waiter,
          'Preparation Time (min)': delay.preparationTime,
          'Total Submission Time': delay.totalSubmissionTime
        }));

        XLSX.utils.sheet_add_json(worksheet, delaysRows, { 
          origin: { r: titleData.length + 1, c: 0 } 
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Delays Report');
        XLSX.writeFile(workbook, `${restaurantName}-delays-report-${currentDate.format('YYYY-MM')}.xlsx`);
      } 
      else if (type === 'pdf') {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        // Add title with restaurant name
        doc.setFontSize(20);
        doc.text(restaurantName, 15, 20);
        doc.setFontSize(16);
        doc.text('Delays Report', 15, 30);
        doc.setFontSize(12);
        doc.text(`Period: ${currentDate.format('MMMM YYYY')}`, 15, 40);

        // Format data for table
        const tableData = delaysData.map(delay => [
          delay.productName,
          String(delay.delayTime || ''),
          dayjs(delay.dateTime).format('DD/MM/YYYY HH:mm'),
          delay.table || '',
          delay.space || '',
          delay.guest || '',
          delay.waiter || '',
          String(delay.preparationTime || ''),
          String(delay.totalSubmissionTime || '')
        ]);

        // Configure and create table
        (doc as any).autoTable({
          head: [['Product Name', 'Delay Time', 'Date and Time', 'Table', 
                 'Space', 'Guest', 'Waiter', 'Prep. Time', 'Total Time']],
          body: tableData,
          startY: 50,
          styles: { 
            fontSize: 8,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'center'
          },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 20 },
            2: { cellWidth: 30 },
            3: { cellWidth: 20 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 },
            7: { cellWidth: 20 },
            8: { cellWidth: 20 }
          },
          margin: { top: 50 }
        });

        doc.save(`${restaurantName}-delays-report-${currentDate.format('YYYY-MM')}.pdf`);
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
            <h1>Delays</h1>
            {datepicker}
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
                    onClick={() => handleExport('pdf')}
                  >
                    Export PDF
                  </div>
                  <div 
                    className={classes.exportMenuItem} 
                    onClick={() => handleExport('excel')}
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
              <p>Loading delays data...</p>
            </div>
          ) : (
            <>
              <div className={classes.tableHeaderMain}>
                <div>Product name</div>
                <div>Delay time (min:sec)</div>
                <div>Date and time</div>
                <div>Table</div>
                <div>Space</div>
                <div>Guest</div>
                <div>Waiter</div>
                <div>Preparation time (min)</div>
                <div>Total submission time</div>
              </div>
              
              <div className={classes.tableBody}>
                {Array.isArray(delaysData) && delaysData.length > 0 ? (
                  delaysData.map((delay, index) => (
                    <div key={index} className={classes.tableRow}>
                      <div>{delay.productName}</div>
                      <div>{delay.delayTime}</div>
                      <div>
                        {dayjs(delay.dateTime).format('DD/MM/YYYY HH:mm')}
                      </div>
                      <div>{delay.table}</div>
                      <div>{delay.space}</div>
                      <div>{delay.guest}</div>
                      <div>{delay.waiter}</div>
                      <div>{delay.preparationTime}</div>
                      <div>{delay.totalSubmissionTime}</div>
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

export default DelaysReport;
