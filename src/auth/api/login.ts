import storage from "../../utils/storage";
import { UserResponse } from "../types";
import api from "./apiInstance";
import { useNavigate } from 'react-router-dom';
import { getAllCurrentPlaces } from "./requests";

export type LoginCredentialsDTO = {
  email: string;
  password: string;
};

export const loginWithEmailAndPassword = async (
  data: LoginCredentialsDTO
): Promise<UserResponse> => {
  try {
    const response = await api.post("/auth/login", data);
    
    const userRole = response.data.role;
    const userPlaceId = response.data.placeId;
    
    storage.setAccessToken(response.data.accessToken);
    storage.setRefreshToken(response.data.refreshToken);
    
    if (userRole === 'ADMIN' && userPlaceId) {
      storage.setAdminPlaceId(userPlaceId);
      
      const places = await getAllCurrentPlaces();
      const adminPlace = places.find(place => place.placeId === userPlaceId);
      
      if (adminPlace) {
        localStorage.setItem("selectedRestaurant", JSON.stringify(adminPlace));
      }
      
      window.location.href = '/admin-dashboard';
    } else if (userRole === 'STAFF_ACCESS_CONTROL') {
      window.location.href = '/qr-scanner';
    } else {
      window.location.href = '/';
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function handleUserResponse(response: UserResponse) {
  const { accessToken, refreshToken, user } = response.data;
  storage.setAccessToken(accessToken);
  storage.setRefreshToken(refreshToken);
  return user;
}
