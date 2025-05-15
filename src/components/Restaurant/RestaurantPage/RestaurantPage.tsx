import React, { useState, useEffect } from "react";
import NoTablesAddedMessage from "../NoTables/NoTablesAddedMessage";
import NoSpacesAddedMessage from "../NoSpaces/NoSpacesAddedMessage";
import EditTable from "../EditTable/EditTables";
import RestaurantTables from "../RestaurantTable/RestaurantTables";
import {
  getAllAboutPlaceById,
  getSpaces,
  getTables,
} from "src/auth/api/requests";
import { ToastContainer } from "react-toastify";
import classes from "./RestaurantPage.module.css";
import Spinner from "src/components/Spinner";

type Table = {
  id: string;
  seats: number;
  tableName: string;
  shape: string;
};

const RestaurantPage = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const [title, setTitle] = useState("Create a business");
  const [subtitle, setSubtitle] = useState("to plan your restaurant");
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [ItemPlaceType, setItemsPlaceType] = useState<any>({});

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await getTables();
        setTables(response.data);
        setTimeout(setLoading.bind(null, false), 500);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const storedRestaurant = JSON.parse(
        localStorage.getItem("selectedRestaurant") ?? "null"
      );
      if (storedRestaurant) {
        const selectedRestaurantFromCookie = storedRestaurant;
        setSelectedRestaurant(selectedRestaurantFromCookie);
        if (selectedRestaurantFromCookie !== undefined) {
          setTitle(selectedRestaurantFromCookie.name);
          setSubtitle(selectedRestaurantFromCookie.address);
        }
        try {
          // Fetching all about the place asynchronously
          const placeInfo = await getAllAboutPlaceById(
            selectedRestaurantFromCookie.placeId
          );
          const placeType = placeInfo[0].placeType;
          setItemsPlaceType(placeType);
          getSpaces(selectedRestaurantFromCookie.id)
            .then((spaces) => {
              //current restaurant
              const formattedOptions = spaces.map((space) => ({
                value: space.id,
                label: space.name,
              }));
              setSpaceOptions(formattedOptions);
            })
            .catch((err) => {
              console.error(`Error getting spaces ${err}`);
            });
        } catch (error) {
          console.error(`Error getting all about place ${error}`);
        }
      }
    };
    fetchData();
  }, []);
  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleCloseSidebar = () => {
    setSelectedTable(null);
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
        <>
          {tables.length === 0 && spaceOptions.length === 0 ? (
            <NoSpacesAddedMessage />
          ) : (
            <>
              {tables.length === 0 ? (
                <NoTablesAddedMessage placeType={ItemPlaceType} />
              ) : (
                <RestaurantTables
                  placeType={ItemPlaceType}
                  tables={tables}
                  handleTableClick={handleTableClick}
                />
              )}
            </>
          )}
        </>
      ) : null}
      {selectedTable !== null && tables.length > 0 && (
        <EditTable
          placeType={ItemPlaceType}
          onCloseSidebar={handleCloseSidebar}
          table={selectedTable}
          tables={tables}
        />
      )}
      <Spinner loading={loading} />
    </>
  );
};

export default RestaurantPage;
