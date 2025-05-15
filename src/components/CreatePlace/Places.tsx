import React, { useEffect, useState } from "react";
import classes from "./Places.module.css";
import Title from "../Title";
import { getAllAboutPlaces, getAllAboutPlaceById, deletePlace } from "src/auth/api/requests";
import { crossIcon, editIcon, plusIcon, restaurantIcon } from "src/icons/icons";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Modal from "src/UI/Modal";
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createPlaceFormDataActions } from 'src/store/formData';

const Places = () => {
  const title = "Your places";
  const subtitle = "You may edit them as you like";
  const [places, setPlaces] = useState([]);
  const [currentPlaceToDelete, setCurrentPlaceToDelete] = useState<any>("");
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPlaces = async () => {
    try {
      await getAllAboutPlaces().then((res) => {
        setPlaces(res);
      });
    } catch (err: any) {
      console.error("Error getting places data", err);
    }
  };

  const placesList = places.map((place: any) => {
    return (
      <div key={place.id}>
        <Row className={classes.place_row}>
          <Col xs={12} md={5} className={classes.place_name}>
            <p>
              <span title={place.placeType}>{restaurantIcon}</span>
              {place.restaurant[0].name}
            </p>
          </Col>
          <Col
            xs={6}
            md={4}
            className={`${classes.add_place_col} ${classes.duration_container}`}
          >
            <div className={classes.duration_label}>
              <p>{place.createdAt.substring(0, 10)} </p>
            </div>
          </Col>
          <Col
            xs={6}
            md={3}
            className={`${classes.add_place_col} ${classes.buttons_col}`}
          >
            <div
              className={classes.deny_button}
              title={`last edited on ${place.restaurant[0].updatedAt.substring(
                0,
                10
              )}`}
              onClick={() => editPlace(place.id)}
            >
              {editIcon}
            </div>
            <div
              className={classes.deny_button}
              onClick={() => showModal(place)}
            >
              {crossIcon}
            </div>
          </Col>
        </Row>
      </div>
    );
  });

  const editPlace = async (placeId: string) => {
    await getAllAboutPlaceById(placeId).then((place) => {
      place = place[0];
      let spacesWithFixedDurationFromDB = [];
      if (place.restaurant[0].spaces != undefined) {
        spacesWithFixedDurationFromDB = place.restaurant[0].spaces.map(
          (space: any) => {
            if (typeof space.duration === "number") {
              var hours = space.duration / 60;
              var rhours = Math.floor(hours);
              var minutes = (hours - rhours) * 60;
              var rminutes = Math.round(minutes);
              return {
                ...space,
                duration: {
                  value: space.duration,
                  label: `${rhours === 0 ? "" : `${rhours}h`}${rminutes === 0 ? "" : `${rminutes}min`
                    }`,
                },
              };
            }
          }
        );
      }
      dispatch(createPlaceFormDataActions.setPlaceType(place.placeType));
      dispatch(createPlaceFormDataActions.setPlaceId(place.id));
      dispatch(createPlaceFormDataActions.setName(place.restaurant[0].name));
      dispatch(createPlaceFormDataActions.setImageKey(place.restaurant[0].image));
      dispatch(createPlaceFormDataActions.setCategory(place.restaurant[0].cuisineType));
      dispatch(createPlaceFormDataActions.setRestaurantId(place.restaurant[0].id));
      let i = 0;
      let workScheduleFromDB = {}
      for (let day in place.restaurant[0].workSchedule) {
        let a = Object.keys(place.restaurant[0].workSchedule)[i];
        if (place.restaurant[0].workSchedule[a].isOpen) {
          workScheduleFromDB[a] = { isOpen: place.restaurant[0].workSchedule[day].isOpen, openingTime: { label: place.restaurant[0].workSchedule[day].openingTime, value: place.restaurant[0].workSchedule[day].openingTime }, closingTime: { label: place.restaurant[0].workSchedule[day].closingTime || '', value: place.restaurant[0].workSchedule[day].closingTime || '' } }
        } else {
          workScheduleFromDB[a] = { isOpen: place.restaurant[0].workSchedule[day].isOpen, openingTime: { label: 'From', value: '' }, closingTime: { label: 'Until', value: '' }, }
        }
        i++;
      }
      dispatch(createPlaceFormDataActions.setSchedule(workScheduleFromDB));
      dispatch(createPlaceFormDataActions.setPhoneNumber(place.restaurant[0].phoneNumber));
      dispatch(createPlaceFormDataActions.setLocation(place.restaurant[0].address));
      dispatch(createPlaceFormDataActions.setEmail(place.restaurant[0].email));
      dispatch(createPlaceFormDataActions.setSpaces(spacesWithFixedDurationFromDB));
      navigate("/edit-place/create");
    }).catch((err) => {
      console.error("Error submitting data", err);
    });
  };

  const removePlace = async (placeId: string) => {
    try {
      await deletePlace(placeId).then((res) => {
        getPlaces();
      });
    } catch (err: any) {
      console.error("Error submitting data", err);
    }
  };
  const cancelModal = () => {
    setModalShow(false);
    setCurrentPlaceToDelete("");
  };

  const acceptModal = () => {
    removePlace(currentPlaceToDelete.id);
    cancelModal();
  };

  const showModal = (place: any) => {
    setModalShow(true);
    setCurrentPlaceToDelete(place);
  };

  useEffect(() => {
    getPlaces();
  }, []);
  return (
    <div className={classes.PlaceSetup}>
      <Title title={title} subtitle={subtitle} />
      <div>
        <p className={classes.label}>Places</p>
        <div className={classes.spaces_cotainer}>
          {places.length === 0 && (
            <p className={classes.no_spaces}>You have no places</p>
          )}
          {places.length !== 0 && placesList}
        </div>

        <div className={classes.spaces_button}>
          <Link
            to={{
              pathname: "/create-place/",
            }}
          >
            <div className={classes.spaces_button_content}>
              <p>
                <span className={classes.plus_icon}>{plusIcon}</span> Create new
                place
              </p>
            </div>
          </Link>
        </div>
      </div>
      <ToastContainer />
      <Modal
        show={modalShow}
        title={"Are you sure?"}
        text={`Do you want to delete your ${currentPlaceToDelete
          ? currentPlaceToDelete.placeType.toLowerCase().replaceAll("_", " ")
          : ""
          } "${currentPlaceToDelete ? currentPlaceToDelete.restaurant[0].name : ""
          }"? This action is irreversible.`}
        cancelbuttontext={"No"}
        acceptbuttontext={"Yes"}
        cancel={cancelModal}
        accept={acceptModal}
      />
    </div>
  );
};
export default Places;
