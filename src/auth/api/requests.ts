import dayjs from "dayjs";
import { TourType } from "../../components/Staff/StaffTypes";
import storage from "../../utils/storage";
import api from "./apiInstance";

export type userData = {
  id?: string;
  username?: string;
  department?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: any;
  salaryType?: any;
  avatar?: string;
  avatarUrl?: string;
};

type helpData = {
  title?: string;
  message?: string;
  module?: string;
};

enum DeviceType {
  iOS = "iOS",
  Android = "Android",
  Web = "Web",
}

export type messageInfo = {
  title?: string;
  message: string;
  startDate: Date | null;
  endDate: Date | null;
  discount?: string;
  communicationTypeId?: string | null;
  sendMessageDate: string;
};
// type Ingredient = {
//   id: string;
//   name: string;
//   grams: number;
//   unit?: { value: string; label: string };
// };

export const getNewAccessToken = async (refreshToken, restaurantId = null) => {
  try {
    const { data } = await api.post("/auth/refresh-token", {
      refreshToken,
      restaurantId,
    });

    if (data && data.isExpired) {
      storage.clearToken();
      return;
    }

    return data.accessToken;
  } catch (error) {
    console.error("Error getting new access token:", error);
    throw error;
  }
};

export const registerUser = async (userData: userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await api.get("/auth/logout");
    storage.clearToken();
  } catch (error) {
    console.error("Error logout user:", error);
    throw error;
  }
};

export const getAuthenticatedUser = async () => {
  try {
    const response = await api.get("/auth/get-authenticated-user");
    return response.data;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    throw error;
  }
};
export const putSwitchAccesToken = async (
  placeId: string,
  restaurantId: string
) => {
  try {
    const response = await api.put(`/place/switch/${placeId}/${restaurantId}`);
    if (response.data && response.data.id) {
      const refreshToken = storage.getRefreshToken();
      const accessToken = await getNewAccessToken(
        refreshToken,
        response.data.id
      );
      storage.setAccessToken(accessToken);
      storage.setRefreshToken(refreshToken);
    }
    return response.data;
  } catch (error) {
    console.error("Can't put Switch Acces Token:", error);
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const filter = {
      role: [
        "SUPER_HOSTESS",
        "WAITER",
        "CHEF",
        "HOSTESS",
        "OPERATOR",
        "SPECIALIST",
        "DRIVER",
        "GENERAL",
        "STAFF_ACCESS_CONTROL"
      ],
    };
    const response = await api.get(`/user?filter=${JSON.stringify(filter)}`);
    
    // Получаем массив пользователей из response.data
    const users = response.data.data || response.data.users || [];
    const uniqueRoles = new Set();
    
    // Проверяем, что users это массив перед использованием forEach
    if (Array.isArray(users)) {
      users.forEach(user => {
        if (user.roleName) {
          uniqueRoles.add({ value: user.roleName, label: user.roleName });
        } else {
          uniqueRoles.add({ value: user.role, label: user.role.replace(/_/g, ' ').toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') 
          });
        }
      });
    }

    const finalRoles = Array.from(uniqueRoles);
    return finalRoles;
  } catch (error) {
    throw error;
  }
};

export const getAllStaffByOverviewCalendar = async (
  yearAndMonth: string,
  previousDays: number,
  upcomingDays: number
) => {
  try {
    const response = await api.get(
      `/user/overview-calendar/${yearAndMonth}/${previousDays}/${upcomingDays}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getAllShedules = async () => {
  try {
    let urlQuerryParams = "";
    /*if (filter.pagination) {
      urlQuerryParams = `skip=${filter.pagination}&limit=10`;
    }*/
    const response = await api.get(`/schedule/allSchedules?limit=999`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all schedule");
  }
};

export const getAllStaff = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";
    if (filter.pagination) {
      urlQuerryParams = `skip=${filter.pagination}&limit=10`;
    }
    const response = await api.get(`/user/staff/all/?${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all staff");
  }
};
export const getAllStaffForTransport = async (page: number) => {
  try {
    const response = await api.get(`/user/staff/all?page=${page}&limit=999`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all staff:", error);
  }
};

export const getAllStaffForDashboard = async () => {
  try {
    const response = await api.get(`/user/staff/all`);
    return response.data?.data || response.data?.employees || response.data || [];
  } catch (error) {
    console.error("Error fetching all staff");
    return [];
  }
};

export const getStaffById = async (staffId: string) => {
  try {
    const response = await api.get(`/user/staff/${staffId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting staff by Id", error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const response = await api.get(`/user/email?email=${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const getPurpose = async (userId: string) => {
  try {
    const response = await api.get(`/schedule/purpose/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get purpose:", error);
    throw error;
  }
};

export const updatePurpose = async (
  purposeId: string,
  scheduleId: string,
  newStatus: string
) => {
  try {
    const response = await api.put(
      `/schedule/purpose/${scheduleId}/${purposeId}`,
      { status: newStatus }
    );
    return response.data;
  } catch (error) {
    console.error("Can't edit purpose:", error);
    throw error;
  }
};

export const getVacation = async (userId: string) => {
  try {
    const response = await api.get(`/vacation/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get vacation:", error);
    throw error;
  }
};

export const getVacationById = async (vacationId) => {
  try {
    const response = await api.get(`/vacation/${vacationId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get vacation by Id:", error);
    throw error;
  }
};

type vacationData = {
  startDate?: Date;
  endDate?: Date;
  vacationType?: string;
  vacationStatus?: string;
};

export const createVacation = async (
  userId: string,
  vacationData: vacationData
) => {
  try {
    const response = await api.post(`/vacation/${userId}`, vacationData);
    return response.data;
  } catch (error) {
    console.error("Can't create vacation:", error);
    throw error;
  }
};

export const updateVacation = async (
  vacationId: string,
  vacationData: vacationData
) => {
  try {
    const response = await api.put(`/vacation/${vacationId}`, vacationData);
    return response.data;
  } catch (error) {
    console.error("Can't edit vacation", error);
    throw error;
  }
};

export const updateVacationStatus = async (
  vacationId: string,
  vacationData: vacationData
) => {
  try {
    const response = await api.put(
      `/vacation/status/${vacationId}`,
      vacationData
    );
    return response.data;
  } catch (error) {
    console.error("Can't update status:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: userData) => {
  try {
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const createStaff = async (staffData: userData) => {
  try {
    const response = await api.post("/user/create", staffData);
    return response.data;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

export const getDashboardStatistics = async () => {
  try {
    const response = await api.get("/statistics/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);
    throw error;
  }
};
export const getStatisticsReports = async () => {
  try {
    const response = await api.get("/statistics/reports-main-page");
    return response.data;
  } catch (error) {
    console.error("Error getting statistics reports:", error);
    throw error;
  }
};

export const getClientsReports = async (
  startDate: string,
  endDate: string,
  periodType: "day" | "week" | "month" | "year"
) => {
  try {
    const response = await api.get(
      `/statistics/reports-clients-page?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const getReservationReports = async (
  startDate: string,
  endDate: string,
  periodType: "day" | "week" | "month" | "year"
) => {
  try {
    const response = await api.get(
      `/statistics/reports-reservations-page?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const getSalesReports = async (
  startDate: string,
  endDate: string,
  periodType: "day" | "week" | "month" | "year"
) => {
  try {
    const filterParam = periodType.toUpperCase();
    
    const response = await api.get(
      `/statistics/reports-sales-page`, {  // изменен URL эндпоинта
        params: {
          startDate,
          endDate,
          filterParam
        }
      }
    );

    return response.data;
  } catch (e) {
    console.error("Sales report error:", e);
    throw e;
  }
};

export const getReviewRatingReports = async (
  startDate: string,
  endDate: string,
  periodType: "day" | "week" | "month" | "year"
) => {
  try {
    const response = await api.get(
      `/statistics/reports-reviews-page?startDate=${startDate}&endDate=${endDate}&periodType=${periodType}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const addSchedule1 = async (userId: string, requestData: TourType[]) => {
  try {
    const response = await api.post(
      `/schedule/schedule/${userId}`,
      requestData
    );

    return response.data;
  } catch (error) {
    console.error("Error adding schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (userId: string, title: string) => {
  try {
    const response = await api.delete(
      `/schedule/scheduleTitle/${userId}/${title}`
    );
    return response.data;
  } catch (error) {
    console.error("Can't delete schedule:", error);
    throw error;
  }
};

export const editSchedule = async (
  userId: string,
  title: string,
  tourData: any
) => {
  try {
    const response = await api.put(
      `/schedule/scheduleTitle/${userId}/${title}`,
      tourData
    );
    return response.data;
  } catch (error) {
    console.error("Cant't edit schedule:", error);
    throw error;
  }
};

export const deleteScheduleByDay = async (
  userId: string,
  scheduleId: string
) => {
  try {
    const response = await api.delete(
      `/schedule/schedule/${userId}/${scheduleId}`
    );
    return response.data;
  } catch (error) {
    console.error("Can't delete schedule on this day:", error);
    throw error;
  }
};

export const updateStaff = async (userId: string, staffData: userData) => {
  try {
    const response = await api.put(`/user/staff/${userId}`, staffData);
    return response.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const getSchedule = async (userId: string) => {
  try {
    const response = await api.get(`/schedule/schedule/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting schedule", error);
    throw error;
  }
};

export const getScheduleByMonth = async (
  userId: string,
  date: string,
  previousDays: number,
  upcomingDays: number
) => {
  try {
    const response = await api.get(
      `/schedule/schedule/${userId}/${date}/${previousDays}/${upcomingDays}`
    );

    return response;
  } catch (error) {
    console.error("Error getting schedule", error);
    throw error;
  }
};
export const uploadImage = async (file: any) => {
  try {
    const response = await api.post(`aws/file/upload`, file);
    return response.data;
  } catch (error) {
    console.error("Cant't upload image:", error);
    throw error;
  }
};

export const getImage = async (key: string) => {
  try {
    const response = await api.get(`aws/file/${key}`);
    return response.data;
  } catch (error) {
    console.error("Can't get image:", error);
    throw error;
  }
};

export const getQR = async () => {
  try {
    const response = await api.get(`/qrcode`);
    return response.data;
  } catch (error) {
    console.error("Can't get qrcode", error);
    throw error;
  }
};

export const getQRWithPlace = async (placeId: string) => {
  try {
    const response = await api.get(`/qrcode`, {
      params: { placeId }  // Передаем placeId как query параметр
    });
    return response.data;
  } catch (error) {
    console.error("Can't get qrcode with place", error);
    throw error;
  }
};

export const uploadDocument = async (data: any) => {
  try {
    const response = await api.post(`/document`, data);
    return response.data;
  } catch (error) {
    console.error("Can't upload document on db:", error);
    throw error;
  }
};

export const getDocument = async (userId: string) => {
  try {
    const response = await api.get(`/document/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get document:", error);
    throw error;
  }
};

export const deleteDocument = async (documentId: string) => {
  try {
    const response = await api.delete(`/document/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getDocuments = async () => {
  try {
    const response = await api.get("/document");
    return response.data;
  } catch (error) {
    console.error("Can't get documents:", error);
    throw error;
  }
};

type DocumentData = {
  key?: string;
  type?: string;
  number?: string;
  expireOn?: any;
  userId: string;
};

export const updateDocument = async (
  documentId: string,
  documentData: DocumentData
) => {
  try {
    const response = await api.put(`/document/${documentId}`, documentData);
    return response.data;
  } catch (error) {
    console.error("Can't update document:", error);
    throw error;
  }
};

type InvoiceData = {
  itemId: string;
  documentName: string;
  key: string;
  number: string;
  issuedOn?: string;
  expireOn?: string;
  type: string;
};

export const createDocument = async (documentData: InvoiceData) => {
  try {
    const response = await api.post(`/document`, documentData);
    return response.data;
  } catch (error) {
    console.error("Can't update document:", error);
    throw error;
  }
};

export const getIngredients = async (categoryId: string) => {
  try {
    const response = await api.get(`/ingredient/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const getIngredientsBySearch = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.search && filter.search.length >= 2) {
      urlQuerryParams = `?search=${filter.search}`;

      const response = await api.get(`/ingredient${urlQuerryParams}`);
      return response.data;
    }
  } catch (error) {
    console.error("Can't get ingredients:", error);
  }
};

export const addIngredient = async (ingredientName: string) => {
  try {
    const ingredient = {
      name: ingredientName,
    };
    const response = await api.post("/ingredient", ingredient);
    return response.data;
  } catch (error) {
    console.error("Error adding ingredient:", error);
    throw error;
  }
};

export const createCategory = async (name: string) => {
  try {
    const response = await api.post("/category", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategories = async (restaurantId: string) => {
  try {
    const response = await api.get(`/category/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProductByCategory = async (
  categoryId: string | undefined,
  restaurantId: string
) => {
  try {
    const response = await api.get(
      `/product/category/${categoryId}/${restaurantId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getAllProduts = async (restaurantId: string) => {
  try {
    const response = await api.get(`/product/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get all products:", error);
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await api.delete(`product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deletting product:", error);
    throw error;
  }
};

export const getTables = async () => {
  try {
    const response = await api.get("/table");
    return response.data;
  } catch (error) {
    console.error("Error getting tables:", error);
    throw error;
  }
};

export const getTablesBySpace = async (spaceId: any) => {
  try {
    if (!spaceId) return []
    const response = await api.get(`/table/space/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting tables by space:", error);
    throw error;
  }
};
export const getTablesBySpaceReservation = async (
  spaceId: any,
  currentDate?: string
) => {
  try {
    if (!spaceId) return []
    const response = await api.get(
      `/table/space/${spaceId}?date=${currentDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting tables by space:", error);
    throw error;
  }
};

export const getSpaceItemsBySpace = async (spaceId: any) => {
  try {
    if (!spaceId) return []
    const response = await api.get(`/space-items/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting items by space:", error);
    throw error;
  }
};
export const addSpaceItem = async (spaceId: any, spaceItemData: any) => {
  try {
    const response = await api.post(`/space-items/${spaceId}`, spaceItemData);
    return response.data;
  } catch (error) {
    console.error("Error adding item on space:", error);
    throw error;
  }
};
export const deleteSpaceItemById = async (itemId: any) => {
  try {
    const response = await api.delete(`/space-items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item on space:", error);
    throw error;
  }
};
export const updateSpaceItem = async (itemId: any, spaceItemData: any) => {
  try {
    const response = await api.put(`/space-items/${itemId}`, spaceItemData);
    return response.data;
  } catch (error) {
    console.error("Error updating item on space:", error);
    throw error;
  }
};
export const getTableById = async (tableId: any) => {
  try {
    const response = await api.get(`/table/${tableId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting table :", error);
    throw error;
  }
};
export const createProduct = async (productData: any, restaurantId: string) => {
  try {
    const response = await api.post(
      `/product/restaurant/${restaurantId}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const editProduct = async (productData: any, productId: string) => {
  try {
    const response = await api.put(`product/${productId}`, productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getReservations = async () => {
  try {
    const response = await api.get("/reservation");
    return response.data;
  } catch (error) {
    console.error("Error gettingRervations:", error);
    throw error;
  }
};
export const getReservationsByFilter = async (page: number) => {
  try {
    const response = await api.get(`/reservation?page=${page}&limit=999`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all staff:", error);
  }
};
export const getOrderByReservationId = async (
  reservationId: string
  // page: number
) => {
  try {
    const response = await api.get(`/order/${reservationId}`);
    // const response = await api.get(
    //   `/order/${reservationId}/?page=${page}&limit=999`
    // );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const getOrder = async (page: number) => {
  try {
    const response = await api.get(`/order?page=${page}&limit=999`);
    return response.data;
  } catch (error) {
    console.error("Error gettingOrder", error);
    throw error;
  }
};
export const getRestaurant = async () => {
  try {
    const response = await api.get("/restaurant");
    return response.data;
  } catch (error) {
    console.error("Error gettingRestaurant", error);
    throw error;
  }
};
export const getRestaurantById = async (restaurantId: string) => {
  try {
    const response = await api.get(`/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error gettingRestaurant", error);
    throw error;
  }
};
export const getAllPlaces = async () => {
  try {
    const response = await api.get("/place");
    return response.data;
  } catch (error) {
    console.error("Error getting places:", error);
    throw error;
  }
};

export const getAllCurrentPlaces = async () => {
  try {
    const response = await api.get("/place/current/all");
    return response.data;
  } catch (error) {
    console.error("Error getting places:", error);
    throw error;
  }
};

export const getAllAboutPlaces = async () => {
  try {
    const response = await api.get("/place/all");
    return response.data;
  } catch (error) {
    console.error("Error getting places:", error);
    throw error;
  }
};

export const getAllAboutPlaceById = async (id: string) => {
  try {
    const response = await api.get(`/place/all/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting place by id:", error);
    throw error;
  }
};
export const getAddressesHints = async (address: string) => {
  try {
    const response = await api.get(`/restaurant/address-hints/${address}`);
    return response.data;
  } catch (error) {
    console.error("Error getting addresses", error);
    throw error;
  }
};

export const createPlace = async (placeData: any) => {
  try {
    const { data } = await api.post("/place", placeData);
    return data;
  } catch (error) {
    console.error("Error creating place:", error);
    throw error;
  }
};

export const editRestaurant = async (
  placeId: string,
  restaurantId: string,
  restaurantData: any
) => {
  try {
    const response = await api.put(
      `/restaurant/${placeId}/${restaurantId}`,
      restaurantData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing restaurant:", error);
    throw error;
  }
};

export const deletePlace = async (placeId: string) => {
  try {
    const response = await api.delete(`/place/${placeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting place:", error);
    throw error;
  }
};
export const createRestaurant = async (
  restaurantData: any,
  lat?: number,
  long?: number
) => {
  if (lat !== undefined && long !== undefined) {
    try {
      const response = await api.post(
        `/restaurant/${lat}/${long}`,
        restaurantData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating restaurant with coordinates:", error);
      throw error;
    }
  } else {
    try {
      const response = await api.post(`/restaurant/`, restaurantData);
      return response.data;
    } catch (error) {
      console.error("Error creating restaurant:", error);
      throw error;
    }
  }
};

export const createSpace = async (
  placeId: string,
  restaurantId: string,
  spaceData: any
) => {
  try {
    const response = await api.post(
      `/space/${placeId}/${restaurantId}`,
      spaceData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating space:", error);
    throw error;
  }
};
export const createTable = async (
  spaceId: string,
  tableData: {
    tableName: string;
    seats: number;
    shape: string;
    xCoordinates: number;
    yCoordinates: number;
  }
) => {
  try {
    const response = await api.post(`/table/${spaceId}`, tableData);
    return response.data;
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
};
export const updateTable = async (
  spaceId: string,
  tableId: string,
  tableData: {
    tableName?: string;
    spaceId?: string;
    seats?: number;
    shape?: string;
    xCoordinates?: number;
    yCoordinates?: number;
    rotationAngle?: number;
  }
) => {
  try {
    const response = await api.put(`/table/${spaceId}/${tableId}`, tableData);
    return response.data;
  } catch (error) {
    console.error("Error updating table:", error);
    throw error;
  }
};
export const deleteTable = async (tableId: string) => {
  try {
    const response = await api.delete(`/table/${tableId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting table:", error);
    throw error;
  }
};

export const editSpace = async (
  spaceId: string,
  placeId: string,
  restaurantId: string,
  spaceData: any
) => {
  try {
    const response = await api.put(
      `/space/${placeId}/${restaurantId}/${spaceId}`,
      spaceData
    );
    return response.data;
  } catch (error) {
    console.error("Error editing space:", error);
    throw error;
  }
};
export const deleteSpaceByID = async (spaceId: string) => {
  try {
    const response = await api.delete(`/space/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting space by id:", error);
    throw error;
  }
};

export const deleteOneSpace = async (
  placeId: string,
  restaurantId: string,
  spaceId: string
) => {
  try {
    const response = await api.delete(
      `/space/${placeId}/${restaurantId}/${spaceId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting space:", error);
    throw error;
  }
};
type Filter = {
  date?: {
    startDate: string;
    endDate: string;
  };
  sortBy?: {
    column: string;
    order: string;
  };
  search?: string;
  pagination?: number;
};

export const getAllClients = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.sortBy) {
      urlQuerryParams = `&sortBy=${filter.sortBy.column}&order=${filter.sortBy.order}`;
    }
    if (filter.search) {
      urlQuerryParams = `&search=${filter.search}`;
    }
    if (filter.pagination) {
      urlQuerryParams = `&skip=${filter.pagination}&limit=10`;
    }
    const response = await api.get(
      `/user/clients/all?filter=${JSON.stringify(
        filter.date
      )}${urlQuerryParams}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting clients:", error);
    throw error;
  }
};

export const getClientHistory = async (
  clientId: string,
  reviewType: string
) => {
  try {
    if (reviewType !== "all") {
      const response = await api.get(
        `/user/client/${clientId}?reviewType=${reviewType}`
      );
      return response.data;
    } else {
      const response = await api.get(`/user/client/${clientId}`);
      return response.data;
    }
  } catch (error) {
    console.error("Can't get client history:", error);
  }
};

export const getClientReservation = async (reservationId: string) => {
  try {
    const response = await api.get(`/reservation/client/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get client's reservation:", error);
  }
};

// Add other API requests as needed
export const getSpaceById = async (spaceId: string) => {
  try {
    const response = await api.get(`/space/${spaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching space by ID:", error);
    throw error;
  }
};
export const getSpaces = async (restaurantId: string) => {
  try {
    const response = await api.get(`/restaurant/get_spaces/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all spaces:", error);
    throw error;
  }
};

export const getAllSpaces = async () => {
  try {
    const response = await api.get(`/space`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all spaces:", error);
    throw error;
  }
};
export const getPlans = async () => {
  try {
    const response = await api.get("/plan?businessType=RESTAURANT");
    return response.data;
  } catch (error) {
    console.error("Error fetching all spaces:", error);
    throw error;
  }
};
export const getPlansHistory = async () => {
  try {
    const response = await api.get("/plan-history/status");
    return response.data;
  } catch (error) {
    console.error("Error fetching all plan history:", error);
    throw error;
  }
};
export const getPlanById = async (id: string) => {
  try {
    const response = await api.get(`/plan/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all spaces:", error);
    throw error;
  }
};
export const getHelp = async (helpData: helpData) => {
  try {
    const response = await api.post("/user/support-email", helpData);
    return response.data;
  } catch (error) {
    console.error("Error sending problem:", error);
    throw error;
  }
};
export default api;

export const getStock = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.sortBy) {
      urlQuerryParams = `sortBy=${filter.sortBy.column}&order=${filter.sortBy.order}`;
    }
    if (filter.search) {
      urlQuerryParams = `search=${filter.search}`;
    }
    if (filter.pagination) {
      urlQuerryParams = `skip=${filter.pagination}&limit=10`;
    }
    const response = await api.get(`/stock/?${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Can't get stock:", error);
    throw error;
  }
};

type stockData = {
  title?: string;
  category?: string;
  exoirationDate?: string;
  volume?: number;
  pcVolume?: number;
  pcUnit?: string;
  unit: string;
  reorderLimit: number;
  tvaType: number;
  priceWithoutTva: number;
  invoiceNumber: string;
  paymentMethod: string;
};

export const createStock = async (supplierId: string, stockData: stockData) => {
  try {
    const response = await api.post(`/stock/${supplierId}`, stockData);
    return response.data;
  } catch (error) {
    console.error("Can't create stock:", error);
    throw error;
  }
};

export const deleteStock = async (supplierId: string) => {
  try {
    const response = await api.delete(`/stock/${supplierId}`);
    return response.data;
  } catch (error) {
    console.error("Can't delete stock:", error);
    throw error;
  }
};

type supplierData = {
  name: string;
  phoneNumber: string;
  email: string;
  idno: string;
  vatNumber: string;
  iban: string;
  bankName: string;
};

export const createSupplier = async (supplierData: supplierData) => {
  try {
    const response = await api.post(`/suplier`, supplierData);
    return response.data;
  } catch (error) {
    console.error("Can't create supplier:", error);
    throw error;
  }
};

export const getSuppliers = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.search) {
      urlQuerryParams = `search=${filter.search}`;
    }

    const response = await api.get(
      `/suplier?${urlQuerryParams}&skip=0&limit=5`
    );
    return response.data;
  } catch (error) {
    console.error("Can't get supliers:", error);
    throw error;
  }
};

export const getSuppliersWithoutPageLimit = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.sortBy) {
      urlQuerryParams = `/?sortBy=${filter.sortBy.column}&order=${filter.sortBy.order}`;
    }
    if (filter.search) {
      urlQuerryParams = `/?search=${filter.search}`;
    }

    const response = await api.get(`/suplier${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Can't get supliers:", error);
    throw error;
  }
};

export const getStockWithSupplier = async (stockId: string) => {
  try {
    const response = await api.get(`/stock/stock-with-suplier/${stockId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get stock with supplier:", error);
    throw error;
  }
};

type orderType = {
  productTitle: string;
  productVolume: string;
  message: string;
  telegram: boolean;
  email: boolean;
};
export const createOrderByTelegram = async (
  suplierId: string | undefined,
  orderData: orderType
) => {
  try {
    const response = await api.post(
      `/stock/make-order-telegram/${suplierId}`,
      orderData
    );
    return response.data;
  } catch (error) {
    console.error("Can't create order:", error);
    throw error;
  }
};

export const createOrderByEmail = async (
  suplierId: string | undefined,
  orderData: orderType
) => {
  try {
    const response = await api.post(
      `/stock/make-order-email/${suplierId}`,
      orderData
    );
    return response.data;
  } catch (error) {
    console.error("Can't create order:", error);
    throw error;
  }
};

export const createCommunicationMessageType = async (type: string) => {
  try {
    const response = await api.post("/communication-type", { type });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};
export const getCommunicationMessageType = async () => {
  try {
    const response = await api.get("/communication-type");
    return response.data;
  } catch (error) {
    console.error("Can't get categories:", error);
    throw error;
  }
};
export const getCommunicationMessage = async () => {
  try {
    const response = await api.get("/communication");
    return response.data;
  } catch (error) {
    console.error("Can't get categories:", error);
    throw error;
  }
};
export const getCommunicationMessageFilter = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";
    if (filter.pagination) {
      urlQuerryParams = `skip=${filter.pagination}&limit=10`;
    }
    const response = await api.get(`/communication/?${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Can't get categories:", error);
    throw error;
  }
};

export const getCommunicationMessageById = async (id: string) => {
  try {
    const response = await api.get(`/communication/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching message with id ${id}:`, error);
    throw error;
  }
};
export const updateCommunicationMessageById = async (
  id: string,
  messageData: messageInfo
) => {
  try {
    const response = await api.put(`/communication/${id}`, messageData);
    return response.data;
  } catch (error) {
    console.error(`Error fetching message with id ${id}:`, error);
    throw error;
  }
};
export const deleteCommunicationMessage = async (id: any) => {
  try {
    const response = await api.delete(`/communication/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting message on communication:", error);
    throw error;
  }
};
export const createCommunicationMessage = async (messageData: messageInfo) => {
  try {
    const response = await api.post("/communication", messageData);
    return response.data;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};
export const saveNotificationToken = async (token: string) => {
  try {
    if (!token) return;

    const body = {
      deviceToken: token,
      deviceType: DeviceType.Web,
    };
    const response = await api.put("/notification/enable", body);
    return response.data;
  } catch (error) {
    console.error("Error saving notification token:", error);
    throw error;
  }
};
export const disableNotificationToken = async () => {
  try {
    const body = {
      deviceType: DeviceType.Web,
    };
    const response = await api.put("/notification/disable", body);
    return response.data;
  } catch (error) {
    console.error("Error saving notification token:", error);
    throw error;
  }
};
export const getNotificationStatus = async () => {
  try {
    const response = await api.get("notification/status");
    return response.data;
  } catch (error) {
    console.error(`Error fetching notification status:`, error);
    throw error;
  }
};
export const getAllNotifications = async () => {
  try {
    const response = await api.get("notification ");
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications:`, error);
    throw error;
  }
};

export const getTransport = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.sortBy) {
      urlQuerryParams = `sortBy=${filter.sortBy.column}&order=${filter.sortBy.order}`;
    }
    if (filter.search) {
      urlQuerryParams = `search=${filter.search}`;
    }
    if (filter.pagination) {
      urlQuerryParams = `skip=${filter.pagination}&limit=10`;
    }
    const response = await api.get(`/transport/?${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Can't get transport:", error);
    throw error;
  }
};

export type transportData = {
  registrationNumber?: string;
  restaurantId?: string | undefined;
  seats: string;
  mileage: string;
  region: string;
  type: string;
  userIds: (string | undefined)[];
};
export const createTransport = async (transportData: transportData) => {
  try {
    const response = await api.post(`/transport`, transportData);
    return response.data;
  } catch (error) {
    console.error("Can't create transport:", error);
    throw error;
  }
};
export const updateTransport = async (
  transportData: transportData,
  transportId: string
) => {
  try {
    const response = await api.put(`/transport/${transportId}`, transportData);
    return response.data;
  } catch (error) {
    console.error("Can't update transport:", error);
    throw error;
  }
};

export const deleteTransport = async (driverId: string) => {
  try {
    const response = await api.delete(`/transport/${driverId}`);
    return response.data;
  } catch (error) {
    console.error("Can't delete transport:", error);
    throw error;
  }
};

type driverData = {
  driverName: string;
  localSerialNumber: string;
  expirationDate: string;
};

export const createDriver = async (driverData: driverData) => {
  try {
    const response = await api.post(`/driver`, driverData);
    return response.data;
  } catch (error) {
    console.error("Can't create driver:", error);
    throw error;
  }
};

export const getDrivers = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";
    let limit = "";

    if (filter.search) {
      urlQuerryParams = `search=${filter.search}`;
    }

    const response = await api.get(
      `/suplier?${urlQuerryParams}&skip=0&limit=5`
    );
    return response.data;
  } catch (error) {
    console.error("Can't get drivers:", error);
    throw error;
  }
};

export const getDriversWithoutPageLimit = async (filter: Filter) => {
  try {
    let urlQuerryParams = "";

    if (filter.sortBy) {
      urlQuerryParams = `/?sortBy=${filter.sortBy.column}&order=${filter.sortBy.order}`;
    }
    if (filter.search) {
      urlQuerryParams = `/?search=${filter.search}`;
    }

    const response = await api.get(`/suplier${urlQuerryParams}`);
    return response.data;
  } catch (error) {
    console.error("Can't get drivers:", error);
    throw error;
  }
};

export const getTransportById = async (transportId: string) => {
  try {
    const response = await api.get(`/transport/${transportId}`);
    return response.data;
  } catch (error) {
    console.error("Can't get transport by id:", error);
    throw error;
  }
};

export const getUpcomingVacations = async () => {
  try {
    const response = await api.get(`/user/staffWithScheduleAndVacation`);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff vacations:", error);
    return [];
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await api.get('/user/staff/all');
    const users = response.data?.data || response.data?.employees || response.data || [];
    
    // Используем Map вместо Set для лучшего контроля над уникальностью
    const departmentsMap = new Map();
    
    if (Array.isArray(users)) {
      users.forEach(user => {
        if (user.department) {
          const formattedDepartment = user.department
            .trim()
            .replace(/_/g, ' ')
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          // Используем оригинальное значение как value и отформатированное как label
          departmentsMap.set(user.department, {
            value: user.department,
            label: formattedDepartment
          });
        }
      });
    }

    // Преобразуем Map в массив, исключая дубликаты
    const departments = Array.from(departmentsMap.values())
      // Сортируем по label для лучшей читаемости
      .sort((a, b) => a.label.localeCompare(b.label))
      // Фильтруем пустые значения
      .filter(dept => dept.value && dept.label);

    console.log('Unique departments found:', departments);
    return departments;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Определяем тип для параметров запроса
type PaymentAccountsParams = {
  restaurant_id?: string;
  payment_method?: 'CASH' | 'CARD' | 'TRANSFER';
  payment_status?: 'PROCESSED' | 'CANCELLED' | 'PENDING';
  operator_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
};

// Функция для получения платежных аккаунтов с фильтрами
export const getAllPaymentAccounts = async (params?: PaymentAccountsParams) => {
  try {
    const response = await api.get('/payment-accounts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching payment accounts:', error);
    throw error;
  }
};

export const getAdminRestaurantData = async () => {
  try {
    const userData = await getAuthenticatedUser();
    if (userData && userData.role === 'ADMIN') {
      return {
        placeId: userData.placeId,
        restaurantId: userData.restaurantId
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting admin restaurant data:", error);
    throw error;
  }
};
