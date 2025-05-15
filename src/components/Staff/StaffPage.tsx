import React, { useState, useEffect, useRef } from "react";
import NoEmployeeAddedMessage from "./NoEmployeeAddedMessage";
import EditEmployee from "./EditEmployee/EditEmployee";
import StaffMembers from "./StaffMembers";
import { getAllStaff, getStaffById } from "src/auth/api/requests";
import { ToastContainer } from "react-toastify";
import classes from "./StaffPage.module.css";
import { Employee } from "./StaffTypes";
import Spinner from "../Spinner";
import ReactPaginate from "react-paginate";

type Filter = {
  pagination?: number;
};

const StaffPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFetch, setNewFetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const initialTotalItemsRef = useRef<number | null>(null);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const filter: Filter = {};

        if (currentPage >= 0) {
          filter.pagination = currentPage * 10;
        }
        const response = await getAllStaff(filter);
        if (initialTotalItemsRef.current === null) {
          initialTotalItemsRef.current = response.pagination.totalItems;
        }
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        } else {
          console.error("getAllStaff did not return an array:", response);
        }
        setTotalPages(response.pagination.totalPages);
        setTotalItems(initialTotalItemsRef.current ?? 0);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setTimeout(setLoading.bind(null, false), 500);
      }
    };
    fetchEmployees();
  }, [isModalOpen, newFetch, currentPage]);

  const handleEmployeeClick = async (id: string) => {
    try {
      const employeeData = await getStaffById(id);
      setEmployee(employeeData);
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
    }
  };

  const updateEmployeeData = (updatedEmployee: Employee) => {
    setEmployee((employee) =>
      employee?.id === updatedEmployee.id ? updatedEmployee : employee
    );
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
  };

  const handleCloseSidebar = () => {
    setEmployee(null);
  };
  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="colored"
        className={classes.ToastContainer}
      />
      {!loading ? (
        employees.length === 0 && totalItems === null ? (
          <NoEmployeeAddedMessage
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <>
            <StaffMembers
              employees={employees}
              handleEmployeeClick={handleEmployeeClick}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              setNewFetch={setNewFetch}
            />
            <div className={classes.Pagination}>
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
            </div>
          </>
        )
      ) : null}

      {employee !== null && employees.length > 0 && (
        <EditEmployee
          onCloseSidebar={handleCloseSidebar}
          employee={employee}
          setEmployee={updateEmployeeData}
          setNewFetch={setNewFetch}
        />
      )}
      <Spinner loading={loading} />
    </>
  );
};

export default StaffPage;
