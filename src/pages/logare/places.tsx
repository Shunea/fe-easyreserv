import Image from "next/image";
import * as NewComponents from "./NewComponents";
import Plus from "../../assets/PlusYP.svg";
import Check from "../../assets/Check.svg";
import { useCallback, useEffect, useState } from "react";
import { Restaurant } from "src/components/Staff/StaffTypes";
import {
  getAllCurrentPlaces,
  putSwitchAccesToken,
} from "src/auth/api/requests";
import storage from "src/utils/storage";
import { useNavigate } from "react-router-dom";
interface YourPlacesProps {}

const YourPlaces: React.FC<YourPlacesProps> = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestautant, setSelectedRestautant] = useState<Restaurant>();
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = storage.getRole();
    if (userRole && userRole === 'STAFF_ACCESS_CONTROL') {
      navigate('/access-control');
      return;
    }
  }, [navigate]);

  const setSelectedAndSaveToLocalStorage = useCallback(
    async (restaurant) => {
      setSelectedRestautant(restaurant);
      localStorage.setItem("selectedRestaurant", JSON.stringify(restaurant) ?? null);
      const SwitchToken = await putSwitchAccesToken(
        restaurant.placeId,
        restaurant.id
      );
      storage.setAccessToken(SwitchToken.accessToken);
      navigate("/dashboard");
    },
    [setSelectedRestautant, navigate]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const RestaurantResponse = await getAllCurrentPlaces();
        // const storedRestaurant = JSON.parse(
        //   localStorage.getItem("selectedRestaurant") ?? "null"
        // );
        setRestaurants(RestaurantResponse);
        // if (Array.isArray(RestaurantResponse)) {
        //   if (storedRestaurant) {
        //     const selectedRestaurantFromCookie = RestaurantResponse.find(
        //       (restaurant) => restaurant.id === storedRestaurant.id
        //     );
        //     if (selectedRestaurantFromCookie) {
        //       setSelectedRestautant(selectedRestaurantFromCookie);
        //     }
        //   } else {
        //     setSelectedAndSaveToLocalStorage(RestaurantResponse[0]);
        //   }
        // } else {
        //   console.error("Can't get all current places", RestaurantResponse);
        // }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
    const userRole = storage.getRole();
    if (userRole !== 'STAFF_ACCESS_CONTROL') {
      const fetchData = async () => {
        try {
          const RestaurantResponse = await getAllCurrentPlaces();
          setRestaurants(RestaurantResponse);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };
      fetchData();
    }
  }, [setSelectedAndSaveToLocalStorage]);

  return (
    <NewComponents.SignInContainer>
      <NewComponents.Title style={{ padding: "32px 40px 24px" }}>
        Your Places
        <NewComponents.PlacesNum>{restaurants.length}</NewComponents.PlacesNum>
      </NewComponents.Title>
      {restaurants.map((restaurant) => (
        <NewComponents.Places
          onClick={() => setSelectedAndSaveToLocalStorage(restaurant)}
          key={restaurant.id}
          className={`${
            restaurant.id === selectedRestautant?.id ? "active" : ""
          }`}
        >
          <div style={{ display: "flex", gap: "12px", cursor: "pointer" }}>
            <img
              src={restaurant.image}
              alt={restaurant.name}
              width={48}
              height={48}
            />
            <div
              style={{
                flexDirection: "column",
                flex: "1 0 0",
                justifyContent: "flex-start",
              }}
            >
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  fontFamily: "Inter",
                }}
              >
                {restaurant.name}
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  fontFamily: "Inter",
                  opacity: "0.6",
                }}
              >
                {restaurant.address}
              </p>
            </div>
          </div>
          {restaurant.id === selectedRestautant?.id ? (
            <Image src={Check} alt="check" width={20} height={20} />
          ) : null}
        </NewComponents.Places>
      ))}
      <NewComponents.Footer>
        <Image src={Plus} width={20} height={20} alt="profileIcon" />
        <a
          href="/create-place"
          style={{ color: "#000", fontWeight: "600", textDecoration: "none" }}
        >
          Create place
        </a>
      </NewComponents.Footer>
    </NewComponents.SignInContainer>
  );
};

export default YourPlaces;
