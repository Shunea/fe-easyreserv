import React, { useState, useEffect } from "react";
import { Employee, Reservation } from "../../StaffTypes";
import classes from "./EditEmployeeSales.module.css";
import Select from "react-select";
import {
  getReservationsByFilter,
  getOrderByReservationId,
  getAllProduts,
  getOrder,
} from "src/auth/api/requests";
import moment from "moment";
import { arrowLeftIcon, arrowRightIcon } from "src/icons/icons";

type EditEmployeeSalesProps = {
  employee: Employee;
};
type Orders = {
  id: string;
  quantity: string;
  productId: string;
  reservationId: string;
};
interface Ingredient {
  id: string;
  name: string;
  grams: number;
  unit?: { value: string; label: string };
  ingredient?: {
    id: string;
    name: string;
  };
}
interface Product {
  id: string;
  title: string;
  image: string;
  productIngredients: Ingredient[];
  price: string;
  weight: number;
  category: {
    id: string;
    name: string;
  };
  allergens: string;
  recipe: string;
  preparationTime: number;
  preparationZone: any;
}

const EditEmployeeSales: React.FC<EditEmployeeSalesProps> = ({ employee }) => {
  const [salesPercentage, setSalesPercentage] = useState(5);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [generalOrders, setGeneralOrders] = useState<Orders[]>([]);
  const [products, setProduct] = useState<Product[]>([]);
  const [currentDate, setCurrentDate] = useState(moment());
  const [isLoading, setIsLoading] = useState(true);

  const addDay = (date) => {
    const newDate = date.clone().add(1, "d");
    setCurrentDate(newDate);
    fetchAllReservations(newDate);
  };

  const subtractDay = (date) => {
    const newDate = date.clone().subtract(1, "d");
    setCurrentDate(newDate);
    fetchAllReservations(newDate);
  };

  const addMonth = (date) => {
    const newDate = date.clone().add(1, "M");
    setCurrentDate(newDate);
    fetchAllReservations(newDate);
  };

  const subtractMonth = (date) => {
    const newDate = date.clone().subtract(1, "M");
    setCurrentDate(newDate);
    fetchAllReservations(newDate);
  };

  const fetchAllReservations = async (selectedDate: moment.Moment) => {
    setIsLoading(true);
    try {
      let allReservations: Reservation[] = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const data = await getReservationsByFilter(currentPage);
        const reservationsPage = data.data
          .filter((reservation: any) => {
            const reservationDate = moment.utc(reservation.date).startOf('day');
            const selectedDateTime = selectedDate.clone().utc().startOf('day');
            
            console.log('Comparing dates:', {
              reservationRaw: reservation.date,
              reservation: reservationDate.format('YYYY-MM-DD'),
              selected: selectedDateTime.format('YYYY-MM-DD'),
              isEqual: reservationDate.isSame(selectedDateTime, 'day')
            });
            
            return reservationDate.isSame(selectedDateTime, 'day');
          })
          .map((reservation: any) => ({
            id: reservation.id,
            waiterId: reservation.waiterId,
            date: reservation.date
          }));
        
        allReservations = [...allReservations, ...reservationsPage];
        totalPages = data.pagination.totalPages;
        currentPage++;
      }

      const filteredReservations = allReservations.filter(
        (reservation) => reservation.waiterId === employee.id
      );

      setReservations(filteredReservations);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      setIsLoading(false);
    }
  };

  const datepicker = (
    <div className={classes.date_picker}>
      <div
        className={classes.date_picker_arrow}
        onClick={() => subtractDay(currentDate.clone())}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("DD-MMMM-YYYY")}
      </div>
      <div
        className={classes.date_picker_arrow}
        onClick={() => addDay(currentDate.clone())}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const monthpicker = (
    <div className={classes.date_picker}>
      <div
        className={classes.date_picker_arrow}
        onClick={() => subtractMonth(currentDate.clone())}
      >
        {arrowLeftIcon}
      </div>
      <div className={classes.date_value}>
        {currentDate.format("MMMM-YYYY")}
      </div>
      <div
        className={classes.date_picker_arrow}
        onClick={() => addMonth(currentDate.clone())}
      >
        {arrowRightIcon}
      </div>
    </div>
  );

  const fetchOrdersByReservation = async (reservationId: string) => {
    try {
      const response = await getOrderByReservationId(reservationId);
      const orders = response.data
        .filter((order: any) => 
          order.status === "COMPLETED" || order.status === "READY"
        )
        .map((order: any) => ({
          id: order.id,
          quantity: order.quantity?.toString() || "0",
          productId: order.product?.id || order.productId,
          reservationId: reservationId
        }));
      
      return orders;
    } catch (error) {
      console.error(`Ошибка при загрузке заказов для резервации ${reservationId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const orderPromises = reservations.map(reservation => 
          fetchOrdersByReservation(reservation.id)
        );
        
        const ordersData = await Promise.all(orderPromises);
        
        const allOrders = ordersData
          .filter(Boolean)
          .flatMap(orders => orders)
          .map(order => ({
            id: order.id,
            quantity: String(order.quantity || 0),
            productId: order.productId,
            reservationId: order.reservationId
          }));

        setGeneralOrders(allOrders);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      }
    };

    if (reservations.length > 0) {
      fetchAllOrders();
    } else {
      setGeneralOrders([]);
    }
  }, [reservations]);

  useEffect(() => {
    const filterOrdersByReservations = () => {
      const reservationIds = new Set(
        reservations.map((reservation) => reservation.id)
      );

      const filteredOrders = generalOrders.filter((order) => 
        reservationIds.has(order.reservationId)
      );

      setOrders(filteredOrders);
    };

    filterOrdersByReservations();
  }, [reservations, generalOrders]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedRestaurant = JSON.parse(
          localStorage.getItem("selectedRestaurant") ?? "null"
        );

        const productData = await getAllProduts(storedRestaurant.id);
        const filteredProduct = productData.map((product: any) => ({
          id: product.id,
          category: {
            id: product.category.id,
            name: product.category.name,
          },
          price: parseFloat(product.price),
          title: product.title,
        }));
        setProduct(filteredProduct);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  // Filter generalOrders based on reservationId present in reservations
  const filteredGeneralOrders = generalOrders.filter((order) =>
    reservations.some((reservation) => reservation.id === order.reservationId)
  );
  const mergedData = filteredGeneralOrders.map((generalOrder) => {
    const product = products.find(p => p.id === generalOrder.productId);
    
    return {
      id: generalOrder.id,
      title: product?.title || 'Unknown Product',
      category: product?.category?.name || 'Unknown Category',
      quantity: generalOrder.quantity || '0',
      price: product?.price || 0,
    };
  }).filter(item => item.title !== 'Unknown Product');

  const TotalSold = mergedData.reduce(
    (acc, product) =>
      acc +
      parseFloat(product.quantity.toString()) *
        parseFloat(product.price.toString()),
    0
  );
  const SalaryFromSales = (TotalSold * salesPercentage) / 100;

  const percentageOptions = Array.from({ length: 30 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}%`,
  }));

  const handleSelectChange = (selectedOption: any) => {
    setSalesPercentage(selectedOption.value);
  };

  useEffect(() => {
    fetchAllReservations(currentDate);
  }, []); 

  return (
    <div className={classes.BoxForm}>
      <div className={classes.date_pickers}>
        {monthpicker}
        {datepicker}
      </div>
      {isLoading ? (
        <div className={classes.loading}>Data loading please wait...</div>
      ) : (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price per unit</th>
              <th>Total Sold</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.map((product, index) => (
              <tr key={index}>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.price} MDL</td>
                <td>
                  {parseFloat(product.quantity.toString()) *
                    parseFloat(product.price.toString())}{" "}
                  MDL
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className={classes.total}>
                Total Vandut
              </td>
              <td>{TotalSold} MDL</td>
            </tr>
            <tr>
              <td colSpan={4} className={classes.procent}>
                Procent de vanzari
              </td>
              <td>
                <Select
                  value={percentageOptions.find(
                    (option) => option.value === salesPercentage
                  )}
                  onChange={handleSelectChange}
                  options={percentageOptions}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={4} className={classes.salariu}>
                Salariu din % de vanzari
              </td>
              <td>{SalaryFromSales} MDL</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
export default EditEmployeeSales;
