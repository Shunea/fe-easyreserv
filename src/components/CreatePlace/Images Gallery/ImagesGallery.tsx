import React, { useState } from "react";
import classes from "./ImagesGallery.module.css";
import galleryDragAndDropClasses from "./GalleryDragAndDrop.module.css";
import addMoreClasses from "./AddMoreDragAndDrop.module.css";
import Title from "../../Title";
import { useSelector } from "react-redux";
import { crossIcon, plusUploadIcon, uploadIcon } from "../../../icons/icons";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../UI/Button";
import { useEffect } from "react";
import { Row } from "react-bootstrap";
import { createPlaceFormDataActions } from "../../../store/formData";
import { backgroundImageActions } from "../../../store/sideImageBackground";
import { StoreType } from "../../../Types";
import { ToastContainer, toast } from "react-toastify";
import {
  createPlace,
  createRestaurant,
  createSpace,
  editRestaurant,
  getAuthenticatedUser,
  getRestaurantById,
  uploadImage,
} from "src/auth/api/requests";
import { AuthenticatedUser } from "src/auth/types";

const ImagesGallery = (props: { isEditPlace?: boolean }) => {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await getAuthenticatedUser();
      setAuthenticatedUser(authenticatedUser);
    };
    fetchUser();
  }, []);
  const storedIsSamePlace = localStorage.getItem("isSamePlace");
  const storedIsSwitchEnabled = localStorage.getItem("isSwitchEnabled");
  const enteredPlaceNameChanged = localStorage.getItem("enteredPlaceNameChanged");

  const dashedBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='7%25 17%25' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const strokeBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const dispatch = useDispatch();
  const imagesFromRedux = useSelector(
    (state: StoreType) => state.formData.images
  );
  const [images, setImages] = useState(imagesFromRedux);
  const [dragAndDropClasses, setDragAndDropClasses] = useState(
    galleryDragAndDropClasses
  );
  const [dragActive, setDragActive] = useState(false);
  const [dragLeave, setDragLeave] = useState(false);
  const [isDropped, setisDropped] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(dashedBackground);
  const [file, setFile] = useState<any>({});
  const [isFile, setIsFile] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageKey, setImageKey] = useState("");
  const [errorType, setErrorType] = useState("");
  const enteredPlaceTypeRedux = useSelector(
    (state: StoreType) => state.formData.place.type
  );
  const enteredAvatarFromRedux = useSelector(
    (state: StoreType) => state.formData.file
  ); //get from DB
  const formData = useSelector((state: StoreType) => state.formData);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const location = useLocation();
  const isEditPlace =
    props.isEditPlace && location.pathname === "/edit-place/images";
  const navigate = useNavigate();
  // const title = "Images gallery";
  const title = "Welcome to Easy Reserv";
  const subtitle = isEditPlace
    ? `Enjoy your new editted  ${enteredPlaceTypeRedux
        .toLowerCase()
        .replaceAll("_", " ")}`
    : `Enjoy your new created  ${enteredPlaceTypeRedux
        .toLowerCase()
        .replaceAll("_", " ")}`;
  // const subtitle = isEditPlace
  //   ? `Edit some photos of your ${enteredPlaceTypeRedux
  //       .toLowerCase()
  //       .replaceAll("_", " ")}`
  //   : `Share some photos of your ${enteredPlaceTypeRedux
  //       .toLowerCase()
  //       .replaceAll("_", " ")}`;
  const resetRedux = () => {
    dispatch(createPlaceFormDataActions.setAll(""));
  };
  const [selectedRestaurant, setSelectedRestaurant] = useState();
  const [restaurantId, setRestaurantId] = useState("");
  const [placeId, setPlaceId] = useState("");
  useEffect(() => {
    const storedRestaurant = JSON.parse(
      localStorage.getItem("selectedRestaurant") ?? "null"
    );
    const fetchRestaurantData = async () => {
      try {
        const restaurantData = await getRestaurantById(storedRestaurant.id);
        if (restaurantData.placeId === storedRestaurant.placeId) {
          setSelectedRestaurant(restaurantData);
          const { id, placeId } = restaurantData;
          setRestaurantId(id);
          setPlaceId(placeId);
        }
      } catch (error) {
        console.error("Error fetching restaurant data", error);
      }
    };

    if (isEditPlace && storedRestaurant) {
      fetchRestaurantData();
    }
  }, [isEditPlace]);
  const handleFiles = (files: any) => {
    if (files) {
      const rightFiles = files.filter(
        (file: any) =>
          file.size <= 2097152 &&
          (file.type === "image/jpeg" || file.type === "image/png")
      );
      if (rightFiles.length > 0) {
        setIsError(false);
        setIsFile(true);
        setFile(files);
        setImages((oldState) => [...oldState, ...rightFiles]);
        setDragAndDropClasses(addMoreClasses);
        dispatch(createPlaceFormDataActions.setImages(images));
      } else {
        setIsError(true);
        setIsFile(false);
        setFile({});
        setBackgroundUrl(strokeBackground);
        setErrorType("Only JPG/PNG, 2 MB max size ");
      }
    }
  };

  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragLeave(false);
    setIsError(false);
    setisDropped(false);
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      if (!isFile) {
        setBackgroundUrl(strokeBackground);
      }
    } else if (e.type === "dragleave") {
      setDragActive(false);
      if (!isFile) {
        setBackgroundUrl(dashedBackground);
      }
      setDragLeave(true);
    }
  };

  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragLeave(false);
    setDragActive(false);
    setisDropped(true);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleChange = function (e: any) {
    e.preventDefault();
    setisDropped(true);
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const onButtonClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };
  const deleteItem = (key: number) => {
    setImages((prevState) => prevState.filter((_, i) => i !== key));
    dispatch(createPlaceFormDataActions.setImages(images));
  };

  const notifySuccess = (message: string) =>
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyError = (errorMessage: string) =>
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    const editPlace = async () => {
    try {
      const requestBody:any = {
        email: formData.email,
        image: formData.imageKey,
        phoneNumber: formData.phoneNumber,
        cuisineType: formData.place.category.value,
        workSchedule: formData.scheduleForDB,
        address: formData.location,
        sector: formData.sector.value,
        
        latitude: Number(formData.lat),
        longitude: Number(formData.lng)
      };
  
      // Conditionally include name in the request body
      if (props.isEditPlace && enteredPlaceNameChanged === "true") {
        requestBody.name = formData.place.name;
      }
      console.log("Request Body:", requestBody);
      await editRestaurant(placeId, restaurantId, requestBody).then((createdPlace) => {
        navigate("/your-places");
        notifySuccess("Restaurant edited");
      });
    } catch (err: any) {
      notifyError("Error editing restaurant");
      console.error("Error editing restaurant", err);
    }
  };
  const planId = useSelector((state: StoreType) => state.formData.planId);

  const submitPlace = async () => {
    dispatch(createPlaceFormDataActions.setImages(images));
    if (
      (storedIsSamePlace === "false" && storedIsSwitchEnabled === "false") ||
      (storedIsSamePlace === "true" && storedIsSwitchEnabled === "false")
    ) {
      await createPlace({ placeType: formData.place.type })
        .then(async (createdPlace) => {
          notifySuccess("Place created");
          createRestaurant(
            {
              name: formData.place.name,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              image: formData.imageKey,
              cuisineType: formData.place.category.value,
              workSchedule: formData.scheduleForDB,
              address: formData.location,
              sector: formData.sector.value,
              planId: planId,
              placeId: createdPlace.id,
            },
            formData.lat,
            formData.lng
          )
            .then((createdRestaurant) => {
              notifySuccess("Restaurant created");
              if (Array.from(formData.spaces).length === 0) {
                const restaurantDetails = {
                  id: createdRestaurant.id,
                  placeId: createdPlace.id,
                  name: createdRestaurant.name,
                  address: createdRestaurant.address,
                  image: createdRestaurant.image,
                };

                localStorage.setItem(
                  "selectedRestaurant",
                  JSON.stringify(restaurantDetails) ?? null
                );

                navigate("/dashboard");
                resetRedux();
              }
              formData.spaces.map((space: any) => {
                createSpace(createdPlace.id, createdRestaurant.id, {
                  name: space.name,
                  duration: space.duration.value,
                  mainEntityId: createdPlace.id,
                  restaurantId: createdRestaurant.id,
                })
                  .then((createdSpace) => {
                    notifySuccess("Space created");
                    resetRedux();
                    const restaurantDetails = {
                      id: createdRestaurant.id,
                      placeId: createdPlace.id,
                      name: createdRestaurant.name,
                      address: createdRestaurant.address,
                      image: createdRestaurant.image,
                    };

                    localStorage.setItem(
                      "selectedRestaurant",
                      JSON.stringify(restaurantDetails) ?? null
                    );
                    navigate("/dashboard");
                  })
                  .catch((err) => {
                    notifyError(
                      `Error creating space:   ${err.response.data.message}`
                    );
                  });
              });
            })
            .catch((err) => {
              notifyError(
                `Error creating restaurant:   ${err.response.data.message}`
              );
            });
        })
        .catch((err) => {
          notifyError(`Error creating place:   ${err.response.data.message}`);
        });
    } else {
      await createRestaurant(
        {
          name: formData.place.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          image: formData.imageKey,
          cuisineType: formData.place.category.value,
          workSchedule: formData.scheduleForDB,
          address: formData.location,
          sector: formData.sector.value,
          planId: planId,
          placeId: authenticatedUser?.placeId,
        },
        formData.lat,
        formData.lng
      )
        .then((createdRestaurant) => {
          notifySuccess("Restaurant created");

          // Set the created restaurant to localStorage
          const restaurantDetails = {
            id: createdRestaurant.id,
            placeId: authenticatedUser?.placeId,
            name: createdRestaurant.name,
            address: createdRestaurant.address,
            image: createdRestaurant.image,
          };

          localStorage.setItem(
            "selectedRestaurant",
            JSON.stringify(restaurantDetails) ?? null
          );

          navigate("/dashboard");
          resetRedux();
        })
        .catch((err) => {
          notifyError(
            `Error creating restaurant:   ${err.response.data.message}`
          );
        });
    }
  };

  const saveImages = () => {
    dispatch(createPlaceFormDataActions.setImages(images));
  };

  const changeImageOnHover = (url: string) => {
    dispatch(backgroundImageActions.changeBackground(url));
  };

  // const uploadImages = (
  //   <div className={`${classes.drag_and_drop_container}`}>
  //     <div
  //       className={`${dragAndDropClasses.file_upload} ${
  //         dragActive ? dragAndDropClasses.drag_active_form_upload : ""
  //       }`}
  //       onDragEnter={handleDrag}
  //       onSubmit={(e) => e.preventDefault()}
  //     >
  //       <input
  //         ref={inputRef}
  //         type="file"
  //         accept=".png,.jpg"
  //         id="input-file-upload"
  //         className={dragAndDropClasses.input_file_upload}
  //         multiple={true}
  //         onChange={handleChange}
  //       />
  //       <div
  //         id="label-file-upload"
  //         className={` ${dragActive ? dragAndDropClasses.drag_active : ""} ${
  //           dragAndDropClasses.drag_and_drop_content
  //         }`}
  //       >
  //         <div>
  //           <div
  //             onClick={onButtonClick}
  //             className={`${dragAndDropClasses.file_upload_icon}
  //         ${dragActive ? dragAndDropClasses.drag_active_file_upload_icon : ""}
  //          ${dragLeave ? dragAndDropClasses.drag_leave_file_upload_icon : ""}
  //          ${isError ? backgroundUrl : ""}
  //           ${isDropped ? dragAndDropClasses.drag_drop_file_drop_icon : ""}`}
  //           >
  //             {<i>{images.length === 0 ? uploadIcon : plusUploadIcon}</i>}
  //           </div>
  //           <button
  //             onClick={onButtonClick}
  //             type="button"
  //             className={` ${dragAndDropClasses.upload_button} ${
  //               dragActive || isDropped
  //                 ? dragAndDropClasses.drag_active_button_upload
  //                 : ""
  //             } `}
  //           >
  //             {isError ? "Error occured" : "Browse Images"}
  //           </button>
  //           {isError ? (
  //             <p className={dragAndDropClasses.error}>{errorType}</p>
  //           ) : file.name ? (
  //             <p>
  //               {file.name.length < 30
  //                 ? file.name
  //                 : `${file.name.substring(0, 5)}... ${file.name.match(
  //                     /\.[0-9a-z]+$/i
  //                   )}`}
  //             </p>
  //           ) : images.length > 0 ? (
  //             <p>
  //               JPG or PNG<br></br>2 MB max size
  //             </p>
  //           ) : (
  //             <p>JPG or PNG, 2 MB max size</p>
  //           )}
  //         </div>
  //       </div>
  //       {dragActive && (
  //         <div
  //           id="drag-file-element"
  //           className={dragAndDropClasses.drag_file_element}
  //           onDragEnter={handleDrag}
  //           onDragLeave={handleDrag}
  //           onDragOver={handleDrag}
  //           onDrop={handleDrop}
  //         ></div>
  //       )}
  //     </div>
  //   </div>
  // );

  // useEffect(() => {
  //   if (images.length === 0) {
  //     setDragAndDropClasses(galleryDragAndDropClasses);
  //   }
  //   if (images.length > 0) {
  //     setDragAndDropClasses(addMoreClasses);
  //   }
  // }, [images, dispatch]);

  // const imagesGallery = (
  //   <div className={classes.gallery}>
  //     <Row className={classes.gallery_row}>
  //       {images.map((image, key) => {
  //         return (
  //           <div
  //             key={`${image.name}${image.size}${key}`}
  //             className={classes.image_gallery_card}
  //             style={{ backgroundImage: `url(${URL.createObjectURL(image)})` }}
  //             onMouseEnter={() =>
  //               changeImageOnHover(URL.createObjectURL(image))
  //             }
  //             onMouseLeave={() => changeImageOnHover("")}
  //           >
  //             <div className={classes.delete_overlay}>
  //               <div
  //                 className={classes.delete_icon}
  //                 onClick={() => deleteItem(key)}
  //               >
  //                 {crossIcon}
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })}
  //       {/* <div className={classes.upload_gallery_card}>{uploadImages}</div> */}
  //     </Row>
  //   </div>
  // );

  return (
    <div className={classes.imagesGallery}>
      <Title
        title={title}
        subtitle={subtitle}
        titleClassName={classes.customTitleClass}
        subtitleClassName={classes.customSubtitleClass}
        textClassName={classes.customTextClass}
      />
      {/* {images.length === 0 && uploadImages} */}
      {/* {images.length > 0 && imagesGallery} */}
      <div className={classes.form_buttons}>
        <Button
          text={isEditPlace ? "Edit place" : "Create place"}
          disabled={false}
          type={"submit"}
          onClick={isEditPlace ? editPlace : submitPlace}
        />
        <Link
          to={{
            pathname: isEditPlace
              ? "/edit-place/contacts"
              : "/create-place/contacts",
          }}
        >
          <Button
            text="Back"
            type={"button"}
            secondary={true}
            onClick={saveImages}
          />
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};
export default ImagesGallery;
