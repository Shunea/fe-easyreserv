import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Settings.module.css";
import { ProfileSetupIcon } from "../../icons/icons";
import { PlanManagementIcon } from "../../icons/icons";
import { NotificationsIcon } from "../../icons/icons";
import { HelpSupportIcon } from "../../icons/icons";
import LogOut from "../../assets/logOut.svg";
import Notifications from "./Notifications/Notifications";
import PlanManagement from "./PlanManagement/PlanManagement";
import HelpSupport from "./HelpSupport/HelpSupport";
import ProfileLayout from "./ProfileLayout";
import { useCookies } from "react-cookie";
import { getAuthenticatedUser } from "src/auth/api/requests";

interface SettingsProps {}
const componentsMap = {
  planManagement: <PlanManagement />,
  notifications: <Notifications />,
  helpSupport: <HelpSupport />,
};

const ProfileItemsList = [
  {
    key: "profileSetup",
    icon: ProfileSetupIcon,
    text: "Profile Setup",
    style: { cursor: "pointer" },
  },
  {
    key: "planManagement",
    icon: PlanManagementIcon,
    text: "Plan Management",
    style: { cursor: "pointer" },
  },
  {
    key: "notifications",
    icon: NotificationsIcon,
    text: "Notifications",
    style: { cursor: "pointer" },
  },
  {
    key: "helpSupport",
    icon: HelpSupportIcon,
    text: "Help & support",
    style: { cursor: "pointer" },
  },
];

const Settings: React.FC<SettingsProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies(["activeItem"]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const handleClick = (item) => {
    setActiveItem(item);
    if (item === "profileSetup") {
      navigate("/edit-place/create");
      // navigate("/edit-place/contacts");
    } else {
      navigate(`/settings#${item}`);
    }
    setCookie("activeItem", item, { path: "/" });
  };
  useEffect(() => {
    const storedItem = cookies["activeItem"];
    if (storedItem) {
      setActiveItem(storedItem);
    } else {
      // If no stored item, set the default active item or handle it as needed
      setActiveItem(ProfileItemsList[0].key); // Setting the first item as default
    }
  }, [cookies]);

  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash && hash !== activeItem) {
      setActiveItem(hash);
    }
  }, [location.hash, activeItem]);

  return (
    <div className={classes.Container}>
      <ProfileLayout
        itemsList={ProfileItemsList}
        activeItem={activeItem}
        handleClick={handleClick}
        LogOutIcon={<img src={LogOut} alt="log out" width={20} height={20} />}
        children={undefined}
      />
      <div className={classes.Content}>
        {activeItem && componentsMap[activeItem]}
      </div>
    </div>
  );
};
export default Settings;
