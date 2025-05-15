import React, { useEffect, useState } from "react";
import Select from "react-select";
import classes from "./EditTableDetails.module.css";
import SaveChangesButton from "./SaveChangesButton";
import SpaceSelect from "../../AddTable/spaceDuration/spaceSelectDuration";
import { getTables } from "src/auth/api/requests";
import {
  closeIcon,
  rectangle4Table,
  rectangle6Table,
  rectangle8Table,
  round2Table,
  round3Table,
  round4Table,
  round6Table,
  round8Table,
  small4RoundTable,
  small4SquareTable,
  square2Table,
  square3Table,
  square4Table,
  square6Table,
  square5Table,
  rectangle7Table,
  square8Table,
  rectangle10Table,
  rectangle12Table,
  oneSingle,
  oneBunkBed,
  oneDouble,
} from "src/icons/icons";

type Table = {
  id: string;
  seats: number;
  shape: string;
  tableName: string;
};
type EditTableDetailsProps = {
  table: any;
  onCloseSidebar: () => void;
  // setEmployee: (updatedEmployee: Employee) => void;
};

const EditTableDetails: React.FC<EditTableDetailsProps> = ({
  table,
  // setEmployee,
}) => {
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await getTables();
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error if needed
      }
    };

    fetchTables();
  }, []);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  // const defaultValue = { value: tables[0]?.seats };
  const [selectedValue, setSelectedValue] = useState<number>(
    tables[0]?.seats || 4
  );
  const [tableOptions, setTableOptions] = useState(
    // getTableOptionsForSeats(selectedValue)
    getRoomOptionsForSeats(selectedValue)
  );

  // const options = [
  //   { value: 2, label: "2" },
  //   { value: 3, label: "3" },
  //   { value: 4, label: "4" },
  //   { value: 5, label: "5" },
  //   { value: 6, label: "6" },
  //   { value: 7, label: "7" },
  //   { value: 8, label: "8" },
  //   { value: 10, label: "10" },
  //   { value: 12, label: "12" },
  // ];
  const options = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
  ];
  function getTableSvg(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND",
    seats: number
  ) {
    if (seats == 2) {
      if (shape === "ROUND") {
        return round2Table;
      }
      if (shape === "SQUARE") {
        return square2Table;
      }
    }
    if (seats == 3) {
      if (shape == "ROUND") {
        return round3Table;
      }
      if (shape === "SQUARE") {
        return square3Table;
      }
    }
    if (seats == 4) {
      if (shape === "BIG_ROUND") {
        return round4Table;
      }
      if (shape === "BIG_SQUARE") {
        return square4Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle4Table;
      }
      if (shape === "SMALL_SQUARE") {
        return small4SquareTable;
      }
      if (shape === "SMALL_ROUND") {
        return small4RoundTable;
      }
    }
    if (seats == 5) {
      if (shape === "SQUARE") {
        return square5Table;
      }
    }
    if (seats == 6) {
      if (shape === "BIG_ROUND") {
        return round6Table;
      }
      if (shape === "BIG_SQUARE") {
        return square6Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle6Table;
      }
    }
    if (seats == 7) {
      if (shape === "RECTANGLE") {
        return rectangle7Table;
      }
    }
    if (seats == 8) {
      if (shape === "BIG_ROUND") {
        return round8Table;
      }
      if (shape === "BIG_SQUARE") {
        return square8Table;
      }
      if (shape === "RECTANGLE") {
        return rectangle8Table;
      }
    }
    if (seats == 10) {
      if (shape === "RECTANGLE") {
        return rectangle10Table;
      }
    }
    if (seats == 12) {
      if (shape === "RECTANGLE") {
        return rectangle12Table;
      }
    }
  }
  function getRoomSvg(
    shape:
      | "RECTANGLE"
      | "SQUARE"
      | "ROUND"
      | "SMALL_SQUARE"
      | "SMALL_ROUND"
      | "BIG_SQUARE"
      | "BIG_ROUND",
    seats: number
  ) {
    if (seats == 2) {
      if (shape === "SMALL_SQUARE") {
        return oneBunkBed;
      }
      if (shape === "SQUARE") {
        return oneDouble;
      }
    }
    if (seats == 1) {
      if (shape == "SMALL_SQUARE") {
        return oneSingle;
      }
    }
  }
  function getTableOptionsForSeats(seats: number) {
    const isSixSeats = seats == 6;
    return [
      {
        id: "table1",
        name: "Table 1",
        imageUrl: getTableSvg("RECTANGLE", seats),
        seats: seats,
        shape: "RECTANGLE",
        does_not_exist: seats == 2 || seats == 3 || seats == 5, //these tables dont exist in this shape
      },
      {
        id: "table2",
        name: "Table 2",
        imageUrl: getTableSvg("SQUARE", seats),
        seats: seats,
        shape: "SQUARE",
        does_not_exist:
          seats == 4 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
      },
      {
        id: "table3",
        name: "Table 3",
        imageUrl: getTableSvg("ROUND", seats),
        seats: seats,
        shape: "ROUND",
        does_not_exist:
          seats == 4 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
      },
      {
        id: "table4",
        name: "Table 4",
        imageUrl: getTableSvg("SMALL_SQUARE", seats),
        seats: seats,
        shape: "SMALL_SQUARE",
        isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table5",
        name: "Table 5",
        imageUrl: getTableSvg("SMALL_ROUND", seats),
        seats: seats,
        shape: "SMALL_ROUND",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 6 ||
          seats == 7 ||
          seats == 8 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table6",
        name: "Table 6",
        imageUrl: getTableSvg("BIG_ROUND", seats),
        seats: seats,
        shape: "BIG_ROUND",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 7 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      {
        id: "table7",
        name: "Table 7",
        imageUrl: getTableSvg("BIG_SQUARE", seats),
        seats: seats,
        shape: "BIG_SQUARE",
        // isSafeSpace: isSixSeats,
        does_not_exist:
          seats == 2 ||
          seats == 3 ||
          seats == 5 ||
          seats == 7 ||
          seats == 10 ||
          seats == 12,
        // className: seats >= 6  ? 'white-background' : '',
      },
      // Add more table options with their respective images
    ];
  }
  function getRoomOptionsForSeats(seats: number) {
    const isSixSeats = seats == 6;
    return [
      {
        id: "Room1",
        name: " Room 1",
        imageUrl: getRoomSvg("SMALL_SQUARE", seats),
        seats: seats,
        isSafeSpace: isSixSeats,
        shape: "SMALL_SQUARE",
        does_not_exist:null, //these tables dont exist in this shape
      },
      {
        id: "Room2",
        name: "Room 2",
        imageUrl: getRoomSvg("SQUARE", seats),
        seats: seats,
        shape: "SQUARE",
        does_not_exist: seats == 1,
      },
      // Add more table options with their respective images
    ];
  }
  const handleSeatSelect = (
    selectedOption: { value: number; label: string } | null
  ) => {
    if (selectedOption) {
      setSelectedValue(selectedOption.value);
      // setTableOptions([...getTableOptionsForSeats(selectedOption.value)]);
      setTableOptions([...getRoomOptionsForSeats(selectedOption.value)]);
    } else {
      setSelectedValue(4);
      setTableOptions([]);
    }
  };

  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // if (formIsValid) {
    //   try {
    //     const updatedEmployee = {
    //       username: fullName,
    //       email: email,
    //       phoneNumber: phone,
    //       role: selectedRole,
    //       password: "default",
    //     };
    //     const updatedEmployeeData = await updateStaff(
    //       employee.id,
    //       updatedEmployee
    //     );
    //     notify();
    //     setEmployee(updatedEmployeeData);
    //     setSubmitted(true);
    //   } catch (error) {
    //     console.error("Error updated table:", error);
    //   }
    // }
  };

  // const notify = () =>
  //   toast.success("Succes!", {
  //     position: "top-right",
  //     autoClose: 1500,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "colored",
  //   });

  return (
    <form className={classes.BoxForm} onSubmit={handleSubmit}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={tables[0]?.tableName}
              disabled
              className="form-control custom-input"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="seats">Seats:</label>
            <Select
              className="custom-input"
              options={options}
              placeholder="How many seats"
              id="seats"
              name="seats"
              value={{ value: selectedValue, label: selectedValue.toString() }}
              onChange={handleSeatSelect}
            />
          </div>
          <div className="col-md-12">
            <p className={classes.label} style={{ marginTop: "32px" }}>
              Choose Your Table Shape
            </p>
            <div className="d-flex flex-wrap">
              {tableOptions.map((table) => (
                <div
                  key={table.id}
                  className={`form-check table-container ${
                    selectedTable === table.id ? "selected" : ""
                  }`}
                  onClick={() => handleTableSelect(table.id)}
                >
                  <input
                    type="radio"
                    id={table.id}
                    name="tableOption"
                    value={table.name}
                    className="form-check-input"
                    style={{ display: "none" }}
                  />
                  {table.isSafeSpace ? (
                    <div
                      className="table-image"
                      style={{
                        width: "105px",
                        marginLeft: "-20px",
                        height: "80px",
                        background: "white",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    ></div>
                  ) : (
                    <label
                      htmlFor={table.id}
                      className="form-check-label"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="table-image"
                        style={{
                          width: "105px",
                          marginLeft: "-20px",
                          height: "80px",
                          border:
                            selectedTable === table.id
                              ? "2px solid var(--brand-sun, #FE9800)"
                              : "1px solid #EEE",
                          background:
                            selectedTable === table.id
                              ? "rgba(254, 152, 0, 0.04)"
                              : "var(--brand-snow, #FFF)",
                          borderRadius: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <img
                          style={{
                            width: "70px",
                            height: "70px",
                          }}
                          src={
                            typeof table.imageUrl === "string"
                              ? table.imageUrl
                              : ""
                          }
                          alt={table.name}
                        />
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-12">{/* <SpaceSelect callback={ } /> */}</div>
        </div>
      </div>
      <SaveChangesButton
      //  formIsValid={formIsValid}
      />
    </form>
  );
};

export default EditTableDetails;
