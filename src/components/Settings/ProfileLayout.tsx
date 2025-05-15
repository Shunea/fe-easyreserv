import React, { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import {
  getAuthenticatedUser,
  logoutUser,
  updateUser,
  uploadImage,
} from "src/auth/api/requests";
import { AuthenticatedUser } from "src/auth/types";
import DragAndDrop from "../CreatePlace/Form/DragAndDrop";

const ProfileLayout = ({
  children,
  itemsList,
  activeItem,
  handleClick,
  LogOutIcon,
}) => {
  const DEFAULT_IMAGE = "/staffImages/DefaultImage.svg";
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };
  const [isRequired, setIsRequired] = useState(false);

  const handleSave = async () => {
    const formData = new FormData();

    try {
      let imageKey = null;

      if (uploadedFile && authenticatedUser !== null) {
        formData.append("file", uploadedFile, uploadedFile?.name);
        imageKey = await uploadImage(formData);

        const updatedUser = await updateUser(authenticatedUser.id, {
          avatar: imageKey ? imageKey : "",
        });
      } else {
        console.error("No file uploaded or user data not available.");
      }
    } catch (error) {
      console.error("Error uploading image or updating user:", error);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    const fetchUser = async () => {
      const authenticatedUser = await getAuthenticatedUser();
      setAuthenticatedUser(authenticatedUser);
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className={classes.Profile}>
        <div className={classes.ProfileHeader}>
          <div>
            <DragAndDrop
              onFileUpload={handleFileUpload}
              background={
                authenticatedUser?.avatarURL
                  ? authenticatedUser.avatarURL
                  : DEFAULT_IMAGE
              }
              isRequired={isRequired}
            />
          </div>
          <button
            onClick={handleSave}
            className={classes.SaveButton}
            disabled={uploadedFile === null}
          >
            Save
          </button>
          <div className={classes.ProfileContent}>
            <h1>{authenticatedUser?.username}</h1>
            <p>
              {authenticatedUser?.role
                ?.toLowerCase()
                ?.replace(/_/g, " ")
                ?.replace(/\b\w/g, (char) => char.toUpperCase())}
            </p>
          </div>
        </div>
        <div className={classes.ProfileMenu}>
          <div className={classes.ProfileList}>
            {itemsList.map((item) => (
              <div
                key={item.key}
                className={`${classes.ProfileListItem} ${
                  activeItem === item.key ? classes.Active : ""
                }`}
                onClick={() => handleClick(item.key)}
                style={item.style}
              >
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
          <div className={classes.ProfileLogOut} onClick={handleLogout}>
            {LogOutIcon}
            Log Out
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default ProfileLayout;
