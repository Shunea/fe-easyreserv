import AddTableButton from "../AddTable/AddTableButton";
import React, { useEffect, useState } from "react";
import Title from "../../Title";
import { placeIcon, plusIcon, tablesBigIcon } from "../../../icons/icons";
import { getAllAboutPlaces, getSpaces } from "src/auth/api/requests";
import { Col, Row } from "react-bootstrap";
import classes from "./NoTablesAddedMessage.module.css";
import { ToastContainer, toast } from "react-toastify";
import SimpleSelect from "src/UI/SimpleSelect";
import { reservationStyle } from "src/UI/selectStyles";
import NewSpaceForm from "../Spaces/NewSpaceForm";
import HalfPageForm from "src/UI/HalfPageForm";

type Props = { placeType: string };

const NoRestaurantAddedMessage = (props: Props) => {
  const [showCreateSpaces, setShowCreateSpaces] = useState(false);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | undefined>(
    undefined
  );
  const [title, setTitle] = useState("Create a business");
  const [subtitle, setSubtitle] = useState("to plan your restaurant");

  useEffect(() => {
    if (showCreateSpaces) {
      document.body.style.position = "sticky";
      document.body.style.overflow = "hidden";
    }
    if (!showCreateSpaces) {
      document.body.style.position = "static";
      document.body.style.overflowY = "scroll";
    }
  }, [showCreateSpaces]);
  const [selectedRestaurant, setSelectedRestaurant] = useState();

  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );

  useEffect(() => {
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
    }
  }, []);
  // useEffect(() => {
  //   if (selectedOption) {
  //     setSelectedSpaceId(selectedOption.value);
  //   }
  // }, [selectedOption]);

  const handleRedirect = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    const spaceId = selectedOption?.value as string;
    setSelectedSpaceId(spaceId);
  };

  const handleOpenCreateSpaces = () => {
    setShowCreateSpaces(true);
  };

  const handleCloseCreateSpaces = () => {
    setShowCreateSpaces(false);
  };

  return (
    <>
      <Row>
        <Col xs={12} lg={6}>
          <Title title={title} subtitle={subtitle} />
        </Col>
        <Col>
          <Row className={classes.header_second_col}>
            <Col className={classes.header_col}>
              {spaceOptions.length > 0 ? (
                <div>
                  <span className={classes.selectIcon}>{placeIcon}</span>
                  <SimpleSelect
                    value={selectedOption}
                    options={spaceOptions}
                    placeholder={"Select a space"}
                    onChange={handleRedirect}
                    styles={reservationStyle}
                  />
                </div>
              ) : (
                <button
                  onClick={handleOpenCreateSpaces}
                  className={classes.button_header}
                >
                  No spaces
                  <span
                    className={classes.plus_icon}
                    style={{ marginLeft: "auto" }}
                  >
                    {plusIcon}
                  </span>
                </button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Col className={`${classes.menu} my-auto`}>
        <div className={classes.icon_container}>{tablesBigIcon}</div>
        <div className={classes.menu_title}>
          <Title
            title="You have no tables"
            subtitle="Let’s start by adding your first tables"
          />
        </div>
        <AddTableButton text="Create Table" selectedSpaceId={selectedSpaceId} placeType={props.placeType} />
      </Col>
      {showCreateSpaces && (
        <HalfPageForm
          title="Create new space"
          onClose={handleCloseCreateSpaces}
        >
          <NewSpaceForm onClose={handleCloseCreateSpaces} />
        </HalfPageForm>
      )}
      <ToastContainer />
    </>
  );
};

export default NoRestaurantAddedMessage;
