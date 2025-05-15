import { useEffect, useState, useRef } from "react";
import { getQRWithPlace } from "../../auth/api/requests";
import { jwtDecode } from "jwt-decode";
import storage from "../../utils/storage";
import classes from "./AccessControl.module.css";

interface DecodedToken {
  placeId: string;
  role: string;
}

interface Place {
  id: string;
  name: string;
  address: string;
}

const AccessControl = () => {
  const [qrCode, setQrCode] = useState<string>();
  const [place, setPlace] = useState<Place | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      try {
        const token = storage.getAccessToken();
        if (token) {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.placeId && decoded.role === "STAFF_ACCESS_CONTROL") {
            const qrResponse = await getQRWithPlace(decoded.placeId);
            setQrCode(qrResponse);

            const storedPlace = localStorage.getItem("selectedRestaurant");
            if (storedPlace) {
              setPlace(JSON.parse(storedPlace));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching QR:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={classes.accessControl}>
      <div className={classes.qrContainer}>
        {place && (
          <div className={classes.placeInfo}>
            <h2 className={classes.placeName}>{place.name}</h2>
            <p className={classes.placeAddress}>{place.address}</p>
          </div>
        )}
        {qrCode && (
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="Access Control QR"
            className={classes.qrCode}
          />
        )}
      </div>
    </div>
  );
};

export default AccessControl;