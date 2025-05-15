import React, { useEffect, useRef, useState } from "react";
import classes from "./Clients.module.css";
import { arrowRightIcon, arrowLeftIcon, exportIcon } from "./../../icons/icons";
import TableClients from "./TableClients";
import moment, { Moment } from "moment";
import { useDispatch } from "react-redux";
import { reservationShowComponentActions } from "../../store/reservationShowComponent";
import { NotificationButton } from "../Statistics/Header";
import { Client } from "../Staff/StaffTypes";
import { getAllClients } from "../../auth/api/requests";
import ReactPaginate from "react-paginate";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import dayjs from 'dayjs';

const Clients: React.FC = () => {
  const title = "Clients";

  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [nextDate, setNextDate] = useState<Moment>(moment());
  const [clients, setClients] = useState<Client[]>([]);

  const dispatch = useDispatch();

  dispatch(reservationShowComponentActions.setCurrentTable(currentDate));
  dispatch(reservationShowComponentActions.setCurrentTable(nextDate));

  const subtractCurrentMonth = (date) => {
    dispatch(
      reservationShowComponentActions.setDate(
        currentDate.subtract(1, "M").format()
      )
    );
    setCurrentDate(date.subtract(1, "M"));
  };

  const substractNextMonth = (date) => {
    if (currentDate.isBefore(nextDate)) {
      dispatch(
        reservationShowComponentActions.setDate(
          nextDate.subtract(1, "M").format()
        )
      );
      setNextDate(date.subtract(1, "M"));
    }
  };

  const addCurrentMonth = (date) => {
    if (currentDate.isBefore(nextDate)) {
      dispatch(
        reservationShowComponentActions.setDate(
          currentDate.add(1, "M").format()
        )
      );
      setCurrentDate(date.add(1, "M"));
    }
  };

  const addNextMonth = (date) => {
    if (nextDate.isBefore(moment().subtract(1, "M"))) {
      dispatch(
        reservationShowComponentActions.setDate(nextDate.add(1, "M").format())
      );
      setNextDate(date.add(1, "M"));
    }
  };

  const datepickerCurrent = (
    <div className={classes.date_picker}>
      <div
        onClick={() => {
          subtractCurrentMonth(currentDate.clone());
        }}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM, YYYY")}
      </div>
      <div
        onClick={() => {
          addCurrentMonth(currentDate.clone());
        }}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const datepickerNext = (
    <div className={classes.date_picker}>
      <div
        onClick={() => {
          substractNextMonth(nextDate.clone());
        }}
        className={classes.DatePickerArrow}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>{nextDate.format("MMMM, YYYY")}</div>
      <div
        onClick={() => {
          addNextMonth(nextDate.clone());
        }}
        className={classes.DatePickerArrow}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  type Filter = {
    date: {
      startDate: string;
      endDate: string;
    };
    sortBy?: {
      column: string;
      order: string;
    };
    search?: string;
    pagination?: number;
  };

  const [totalItems, setTotalItems] = useState(0);
  const initialTotalItemsRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortOptions, setSortOptions] = useState({
    column: "username",
    order: "No Order",
  });

  const [currentPage, setCurrentPage] = useState(0); // react-paginate uses zero-based indexing

  const [searchValue, setSearchValue] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleExport = async (type: 'pdf' | 'excel') => {
    try {
      const storedRestaurant = JSON.parse(localStorage.getItem("selectedRestaurant") || "{}");
      const restaurantName = storedRestaurant.name || "restaurant";

      if (!clients || clients.length === 0) {
        console.error('No clients data to export');
        return;
      }

      if (type === 'excel') {
        const workbook = XLSX.utils.book_new();
        
        const titleData = [
          [`${restaurantName}`],
          ['Clients Report'],
          [`Period: ${currentDate.format('MMMM YYYY')} - ${nextDate.format('MMMM YYYY')}`],
          [],
          ['Full Name', 'Status', 'Phone number', 'E-mail address', 'Last Visit', 'Orders volume']
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(titleData);

        const clientRows = clients.map(client => [
          client.username || '',
          client.status || '',
          client.phoneNumber || '',
          client.email || '',
          dayjs(client.lastVisit).format('DD/MM/YYYY'),
          `MDL ${Number(client.ordersVolume || 0).toFixed(2)}`
        ]);

        XLSX.utils.sheet_add_aoa(worksheet, clientRows, { 
          origin: { r: titleData.length, c: 0 } 
        });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients Report');
        XLSX.writeFile(workbook, `${restaurantName}-clients-report-${currentDate.format('YYYY-MM')}.xlsx`);
      } 
      else if (type === 'pdf') {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        doc.setFontSize(16);
        doc.text(restaurantName, 15, 20);
        doc.text('Clients Report', 15, 30);
        doc.setFontSize(12);
        doc.text(`Period: ${currentDate.format('MMMM YYYY')} - ${nextDate.format('MMMM YYYY')}`, 15, 40);

        const tableData = clients.map(client => [
          client.username || '',
          client.status || '',
          client.phoneNumber || '',
          client.email || '',
          dayjs(client.lastVisit).format('DD/MM/YYYY'),
          `MDL ${Number(client.ordersVolume || 0).toFixed(2)}`
        ]);

        (doc as any).autoTable({
          head: [['Full Name', 'Status', 'Phone number', 'E-mail address', 'Last Visit', 'Orders volume']],
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
            1: { cellWidth: 25 },
            2: { cellWidth: 30 },
            3: { cellWidth: 40 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 }
          },
          margin: { top: 40 }
        });

        doc.save(`${restaurantName}-clients-report-${currentDate.format('YYYY-MM')}.pdf`);
      }
      
      setIsExportMenuOpen(false);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startOfDate = new Date(currentDate.format("YYYY-MM-DD"));
        startOfDate.setDate(1);

        const endOfDate = new Date(nextDate.format("YYYY-MM-DD"));
        endOfDate.setMonth(endOfDate.getMonth() + 1, 0);

        const startDate = startOfDate.toISOString().slice(0, 10);
        const endDate = endOfDate.toISOString().slice(0, 10);

        const filter: Filter = {
          date: {
            startDate,
            endDate,
          },
        };

        if (sortOptions.order !== "No Order") {
          filter.sortBy = sortOptions;
        }

        if (searchValue !== "") {
          filter.search = searchValue;
        }

        if (currentPage >= 0) {
          filter.pagination = currentPage * 10;
        }

        const clientsResponse = await getAllClients(filter);
        if (initialTotalItemsRef.current === null) {
          initialTotalItemsRef.current = clientsResponse.pagination.totalItems;
        }
        setClients(clientsResponse.data);
        setTotalPages(clientsResponse.pagination.totalPages);
        setTotalItems(initialTotalItemsRef.current ?? 0);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Can't get clients:", error);
      }
    };
    fetchData();
  }, [currentDate, nextDate, sortOptions, searchValue, currentPage]);

  console.log(clients.length);

  return (
    <div className={classes.CommonClientsContainer}>
      <div className={classes.ClientsContainer}>
        <div className={classes.header}>
          <h1>{title}</h1>
          <div className={classes.clients}>
            {datepickerCurrent}
            {datepickerNext}
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
        <TableClients
          clients={clients}
          setSortOptions={setSortOptions}
          loading={loading}
          setSearchValue={setSearchValue}
        />
        {/* {clients.length > 9 ? ( */}
        {totalPages > 1 ? (
          <div className={classes.Pagination}>
            <span className={classes.NumberOfElements}>
              {/* Shown {clients.length} of {totalItems} items */}
            </span>
            <div className={classes.Pages}>
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={classes.PageList}
                activeClassName={classes.ActivePage}
                activeLinkClassName={classes.ActivePageText}
                pageClassName={classes.NotActivePage}
                pageLinkClassName={classes.NotActivePageText}
                breakLabel="..."
                renderOnZeroPageCount={null}
                previousClassName={classes.disabled}
                nextClassName={classes.disabled}
              />
            </div>
            <div></div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Clients;
