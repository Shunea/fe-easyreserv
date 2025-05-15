import { useEffect, useState } from "react";
import classes from "../../Reservations/Reservations.module.css";
import SimpleSelect from "src/UI/SimpleSelect";
import { placeIcon } from "src/icons/icons";
import { getSpaces } from "src/auth/api/requests";
import { reservationStyle } from "../styles/styles";

const GetSpaces = (props: any) => {
  const [loading, setLoading] = useState(true);

  const [spacesOptions, setSpaceOptions] = useState<any>([]);
  const [enteredSpace, setEnteredSpace] = useState(spacesOptions[0]);
  const handleSelectChange = (selected: any) => {
    setEnteredSpace(selected);
  };
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    if (storedRestaurant) {
      const selectedRestaurantFromCookie = storedRestaurant;
      getSpaces(selectedRestaurantFromCookie.id)
        .then((res) => {
          if (res.length != 0) {
            let spacesWithLabel = res.map((item) => {
              return { label: item.name, value: item.id };
            });
            // setSpaceOptions([{label:"All spaces",value:""},...spacesWithLabel]);
            setSpaceOptions([{label:"All spaces",value:""}]);
            // console.log(spacesOptions[0]);
            
            // setEnteredSpace(spacesWithLabel[0]);
            setEnteredSpace(spacesOptions[0]);
            
          }
        })
        .catch((err) => {
          console.error(`Error getting spaces ${err}`);
        });
    }
    setTimeout(setLoading.bind(null, false), 500);
  }, []);
  // console.log("----",spacesOptions);

  return (
    <div style={{position:"relative"}}>
        <span style={{position:"absolute",bottom:"16px",left:"16px"}}>{placeIcon}</span>
        <SimpleSelect
          value={enteredSpace}
          options={spacesOptions}
          placeholder={"All spaces"}
          onChange={handleSelectChange}
          styles={reservationStyle}
        />
    </div>
  );
};
export default GetSpaces;
