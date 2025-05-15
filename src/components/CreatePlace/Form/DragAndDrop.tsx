import React, { useEffect, useState } from "react";

import classes from "./DragAndDrop.module.css";
import { imageIcon, imagePlusIcon } from "../../../icons/icons";
import { useDispatch } from "react-redux";
import { getImage } from "src/auth/api/requests";

interface DragAndDropProps {
  style?: string;
  actions?: any;
  defaultValue?: any;
  onFileUpload?: any;
  background?: any;
  newBackground?: any;
  imageKey?: string;
  parentComponent?: string;
  isRequired: boolean;
}

const DragAndDrop: React.FC<DragAndDropProps> = (props: any) => {
  const dashedBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='7%25 17%25' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const strokeBackground =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const dashedBackgroundForMeal =
    "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='rgba(254, 152, 0, 0.4)' strokeWidth='3' stroke-dasharray='7%25 17%25' stroke-dashoffset='3' strokeLinecap='round'/%3e%3c/svg%3e";
  const dispatch = useDispatch();
  const [dragActive, setDragActive] = React.useState(false);
  const [dragLeave, setDragLeave] = React.useState(false);
  const [isDropped, setisDropped] = React.useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(
    props.parentComponent === "meal"
      ? dashedBackgroundForMeal
      : dashedBackground
  );
  const [file, setFile] = useState<any>({});
  const [isFile, setIsFile] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function getBase64(file: any) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function () {
      let result = await reader.result;
      return result;
    };
    reader.onerror = function (error) {};
  }
  async function dataUrlToFile(dataUrl: any, fileName: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    const newFile = new File([blob], fileName, { type: "image/png" });
    return newFile;
  }

  const handleFile = (file: any) => {
    if (file) {
      if (
        file.size <= 2097152 &&
        (file.type === "image/jpeg" || file.type === "image/png")
      ) {
        if (file) {
          setIsError(false);
          setFile(file);
          if (props.actions) {
            dispatch(props.actions.setFile(file));
          }
          const fileString = getBase64(file);
          setBackgroundUrl(URL.createObjectURL(file));
          setIsFile(true);
        }
      } else {
        setIsError(true);
        setIsFile(false);
        setFile({});
        setBackgroundUrl(strokeBackground);
        if (props.actions) {
          dispatch(props.actions.setFile({}));
        }
        if (file.size >= 2097152) {
          setErrorType("File is larger than 2MB");
        }
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
          setErrorType("Only JPG or PNG");
        }
      }
      if (props.onFileUpload) {
        props.onFileUpload(file);
      }
    }
  };
  useEffect(() => {
    if (props.defaultValue?.name !== undefined) {
      handleFile(props.defaultValue);
    }
    if (!!props.imageKey) {
      getImage(props.imageKey).then((res) => {
        setBackgroundUrl(res);
        setIsError(false);
        setIsFile(true);
        setFile(res);
      });
    }
  }, []);
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

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    setisDropped(true);

    const file = e.target.files[0];
    handleFile(file);
  };
  const onButtonClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const [mouseEntered, setMouseEntered] = useState(false);
  return (
    <div
      className={`${classes.file_upload} ${
        dragActive ? classes.drag_active_form_upload : ""
      }`}
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg"
        id="input-file-upload"
        className={classes.input_file_upload}
        multiple={false}
        onChange={handleChange}
      />
      <div
        id="label-file-upload"
        className={` ${dragActive ? classes.drag_active : ""} `}
      >
        <div>
          {props.parentComponent === "meal" ? (
            <div
              className={`${
                props.parentComponent === "meal"
                  ? classes.MealFile_upload_icon
                  : classes.file_upload_icon
              } 
          ${dragActive ? classes.drag_active_file_upload_icon : ""} 
           ${dragLeave ? classes.drag_leave_file_upload_icon : ""} 
            ${isDropped ? classes.drag_drop_file_drop_icon : ""}`}
              style={{
                backgroundImage: isFile
                  ? `url("${backgroundUrl}")`
                  : props.background
                  ? `url("${props.background}")`
                  : `url("${backgroundUrl}")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                cursor: "pointer",
                backgroundColor: `${
                  mouseEntered && props.parentComponent === "meal"
                    ? "rgba(254, 152, 0, 1)"
                    : "transparent"
                }`,
              }}
              onClick={onButtonClick}
              onMouseEnter={() => setMouseEntered(true)}
              onMouseLeave={() => setMouseEntered(false)}
            >
              {!isFile &&
                props.parentComponent === "meal" &&
                props.background === null && (
                  <>
                    <span>{imagePlusIcon}</span>
                    <span className={classes.ImageDescription}>JPG or PNG</span>
                    <span className={classes.ImageDescription}>
                      2 MB max size
                    </span>
                  </>
                )}
              {!isFile &&
                props.parentComponent === "meal" &&
                props.background !== null &&
                mouseEntered && (
                  <div
                    style={{
                      opacity: "1",
                      display: "flex",
                      flexDirection: "column",
                      color: "black",
                    }}
                  >
                    <span>{imagePlusIcon}</span>
                    <span>Change Image</span>
                    <span className={classes.ImageDescription}>JPG or PNG</span>
                    <span className={classes.ImageDescription}>
                      2 MB max size
                    </span>
                  </div>
                )}
            </div>
          ) : (
            <div
              className={`${classes.file_upload_icon} 
          ${dragActive ? classes.drag_active_file_upload_icon : ""} 
           ${dragLeave ? classes.drag_leave_file_upload_icon : ""} 
            ${isDropped ? classes.drag_drop_file_drop_icon : ""}`}
              style={{
                backgroundImage: isFile
                  ? `url("${backgroundUrl}")`
                  : props.background
                  ? `url("${props.background}")`
                  : `url("${backgroundUrl}")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              {!isFile && props.background === null && <i>{imageIcon}</i>}
            </div>
          )}

          {props.parentComponent === "meal" ? null : (
              <button
              onClick={onButtonClick}
              type="button"
              className={` ${classes.upload_button} ${
                dragActive || isDropped ? classes.drag_active_button_upload : ""
              } `}
            >
              {isError
                ? "Error occured"
                : isFile || props.background !== null
                ? "Change logo"
                : "Upload logo"}
              {props.isRequired ? (
                <span className={classes.required}>*</span>
              ) : (
                ""
              )}
            </button>
          )}

          {isError ? (
            <p className={classes.error}>{errorType}</p>
          ) : file.name && props.parentComponent !== "meal" ? (
            <p>
              {file.name.length < 30
                ? file.name
                : `${file.name.substring(0, 5)}... ${file.name.match(
                    /\.[0-9a-z]+$/i
                  )}`}
            </p>
          ) : (
            <>
              {props.background === null && props.parentComponent !== "meal" ? (
                <p>JPG or PNG, 2 MB max size</p>
              ) : null}
            </>
          )}
        </div>
      </div>
      {dragActive && (
        <div
          id="drag-file-element"
          className={classes.drag_file_element}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </div>
  );
};

export default DragAndDrop;
