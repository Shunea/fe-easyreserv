import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Row } from "react-bootstrap";
import RootState from "../../RootState";
import styles from "./Galery.module.css";
import { createPlaceFormDataActions } from "./../../store/formData";
import { backgroundImageActions } from "../../store/sideImageBackground";
import { crossIcon, plusUploadIcon, uploadIcon } from "./../../icons/icons";
import Button from "./../../UI/Button";
import galleryDragAndDropClasses from "./GalleryDragAndDrop.module.css";
import addMoreClasses from "./AddMoreDragAndDrop.module.css";

// interface ImageFile extends File {
//   preview: string;
// }
interface GaleryProps {
  createMealBtnClickHandler: (
    e: React.MouseEvent<HTMLButtonElement>,
    images: any[]
  ) => void;
}
const Galery: React.FC<GaleryProps> = ({ createMealBtnClickHandler }) => {
  // const selectedPlaceType = useSelector(
  //   (state: RootState) => state.formData.place.type
  // );
  // const title = "Images gallery";
  // const subtitle = `Share some photos of your ${selectedPlaceType.toLowerCase()}`;
  const dashedBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='7%25 17%25' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const strokeBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const dispatch = useDispatch();
  const imagesFromRedux = useSelector(
    (state: RootState) => state.formData.images
  );
  const [images, setImages] = useState(imagesFromRedux);
  const [dragAndDropClasses, setDragAndDropClasses] = useState(
    galleryDragAndDropClasses
  );
  const [dragActive, setDragActive] = useState(false);
  const [dragLeave, setDragLeave] = useState(false);
  const [isDropped, setisDropped] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(dashedBackground);
  const [file, setFile] = useState<File | null>(null);
  const [isFile, setIsFile] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState("");
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for input element
  const handleFiles = (files: File[]) => {
    if (files) {
      const rightFiles = files.filter(
        (file) =>
          file.size <= 2097152 &&
          (file.type === "image/jpeg" || file.type === "image/png")
      );
      if (rightFiles.length > 0) {
        setIsError(false);
        setImages((oldState) => [...oldState, ...rightFiles]);
        setDragAndDropClasses(addMoreClasses);
        dispatch(createPlaceFormDataActions.setImages(images));
      } else {
        setIsError(true);
        setBackgroundUrl(strokeBackground);
        setErrorType("Only JPG/PNG, 2 MB max size");
      }
    }
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
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
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragLeave(false);
    setDragActive(false);
    setisDropped(true);
    const files = Array.from(e.dataTransfer.files) as File[];
    handleFiles(files);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setisDropped(true);
    const files = Array.from(e.target.files || []) as File[]; // Handle null case
    handleFiles(files);
  };
  const onButtonClick = () => {
    inputRef.current?.click();
  };
  const navigate = useNavigate();

  const handleCreateMealBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent the default behavior
    saveImages();
    createMealBtnClickHandler(e, images);

    // Programmatically navigate to '/meals'
    navigate("/meals");
  };

  const deleteItem = (key: number) => {
    setImages((prevState) => prevState.filter((_, i) => i !== key));
    dispatch(createPlaceFormDataActions.setImages(images));
  };
  const saveImages = () => {
    dispatch(createPlaceFormDataActions.setImages(images));
  };
  const changeImageOnHover = (url: string) => {
    dispatch(backgroundImageActions.changeBackground(url));
  };
  const uploadImages = (
    <div className={dragAndDropClasses.drag_and_drop_container}>
      <div
        className={`${dragAndDropClasses.file_upload} ${
          dragActive ? dragAndDropClasses.drag_active_form_upload : ""
        }`}
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg"
          id="input-file-upload"
          className={dragAndDropClasses.input_file_upload}
          multiple={true}
          onChange={handleChange}
        />
        <div
          id="label-file-upload"
          className={`${dragActive ? dragAndDropClasses.drag_active : ""} ${
            dragAndDropClasses.drag_and_drop_content
          }`}
        >
          <div>
            <div
              onClick={onButtonClick}
              className={`${dragAndDropClasses.file_upload_icon} ${
                dragActive
                  ? dragAndDropClasses.drag_active_file_upload_icon
                  : ""
              } ${
                dragLeave ? dragAndDropClasses.drag_leave_file_upload_icon : ""
              } ${
                isDropped ? dragAndDropClasses.drag_drop_file_drop_icon : ""
              }`}
            >
              {!isFile && (
                <i>{images.length === 0 ? uploadIcon : plusUploadIcon}</i>
              )}
            </div>
            <button
              onClick={onButtonClick}
              type="button"
              className={`${dragAndDropClasses.upload_button} ${
                dragActive || isDropped
                  ? dragAndDropClasses.drag_active_button_upload
                  : ""
              }`}
            >
              {isError ? "Error occurred" : "Browse Images"}
            </button>
            {isError ? (
              <p className={dragAndDropClasses.error}>{errorType}</p>
            ) : file?.name ? (
              <p>
                {file.name.length < 30
                  ? file.name
                  : `${file.name.substring(0, 5)}... ${file.name.match(
                      /\.[0-9a-z]+$/i
                    )}`}
              </p>
            ) : images.length > 0 ? (
              <p>
                JPG or PNG
                <br />2 MB max size
              </p>
            ) : (
              <p>JPG or PNG, 2 MB max size</p>
            )}
          </div>
        </div>
        {dragActive && (
          <div
            id="drag-file-element"
            className={dragAndDropClasses.drag_file_element}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </div>
    </div>
  );
  useEffect(() => {
    if (images.length === 0) {
      setDragAndDropClasses(galleryDragAndDropClasses);
    }
    if (images.length > 0) {
      setDragAndDropClasses(addMoreClasses);
    }
  }, [images, dispatch]);
  const imagesGallery = (
    <div className={styles.gallery}>
      <Row>
        {images.map((image, key) => {
          return (
            <div
              key={`${image.name}${image.size}${key}`}
              className={styles.image_gallery_card}
              style={{ backgroundImage: `url(${URL.createObjectURL(image)})` }}
              onMouseEnter={() =>
                changeImageOnHover(URL.createObjectURL(image))
              }
              onMouseLeave={() => changeImageOnHover("")}
            >
              <div className={styles.delete_overlay}>
                <div
                  className={styles.delete_icon}
                  onClick={() => deleteItem(key)}
                >
                  {crossIcon}
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.upload_gallery_card}>{uploadImages}</div>
      </Row>
    </div>
  );
  return (
    <div className={styles.imagesGallery}>
      <p className={styles.label}>Images gallery</p>
      {images.length === 0 && uploadImages}
      {images.length > 0 && imagesGallery}
      <div className={styles.form_buttons}>
        <Link
          to={{
            pathname: "/menu",
          }}
        >
          <Button
            text="Create meal"
            disabled={false}
            type={"submit"}
            onClick={handleCreateMealBtnClick}
          />
        </Link>
        <Link
          to={{
            pathname: "/menu",
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
    </div>
  );
};
export default Galery;
