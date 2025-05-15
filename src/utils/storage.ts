import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const storagePrefix = "rezervare_ta_";

interface DecodedToken {
  role: string;
  // другие поля токена если есть
}

const storage = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;

    const accessToken = Cookies.get(`${storagePrefix}token`);

    if (
      !accessToken ||
      (typeof accessToken === "string" && accessToken === "undefined")
    ) {
      return null;
    }

    return JSON.parse(accessToken)

  },
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;

    const refreshToken = Cookies.get(`${storagePrefix}refresh_token`);

    if(!refreshToken) {
      return null;
    }

    return JSON.parse(refreshToken);
  },
  setAccessToken: (accessToken) => {
    if (typeof window === "undefined") return;

    Cookies.set(`${storagePrefix}token`, JSON.stringify(accessToken), {
      secure: true,
      sameSite: "strict",
    });
  },
  setRefreshToken: (refreshToken) => {
    if (typeof window === "undefined") return;

    Cookies.set(`${storagePrefix}refresh_token`, JSON.stringify(refreshToken), {
      secure: true,
      sameSite: "strict",
    });
  },
  clearToken: () => {
    if (typeof window === "undefined") return;

    Cookies.remove(`${storagePrefix}token`);
    Cookies.remove(`${storagePrefix}refresh_token`);

    window.location.reload();
  },
  getRole: () => {
    const token = storage.getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded?.role === 'STAFF_ACCESS_CONTROL' ? 'STAFF_ACCESS_CONTROL' : decoded?.role;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  },
  setAdminPlaceId: (placeId: string) => {
    if (typeof window === "undefined") return;

    Cookies.set(`${storagePrefix}admin_place_id`, JSON.stringify(placeId), {
      secure: true,
      sameSite: "strict",
    });
  },
  getAdminPlaceId: () => {
    if (typeof window === "undefined") return null;

    const placeId = Cookies.get(`${storagePrefix}admin_place_id`);
    
    if (!placeId) {
      return null;
    }

    return JSON.parse(placeId);
  }
};

export default storage;
