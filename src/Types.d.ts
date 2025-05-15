export type BackgroundImageState = {
  backgroundImage: string;
};

export type ReservationShowComponent = {
  component: "no-reservation" | "schedule" | "details";
  date: any;
  currentTable: any;
  clickedReservation: any;
  space: string;
};

type SelectedType = {
  label: string;
  value: string;
};

export type SpaceType = {
  id: string;
  name: string;
  duration: {
    label: string;
    value: string;
  } | any;
};

export type CreatePlaceFormData = {
  placeId: string,
  restaurantId: string,
  file: any;
  planId: string;
  lat: number;
  lng: number;
  sector: { value: string, label: string };
  place: {
    type: string;
    name: string;
    category: string | { value: string, label: string } | any;
  };
  imageKey: string,
  schedule: {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
    sunday: ScheduleDay;
  };
  scheduleForDB: {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
    sunday: ScheduleDay;
  };
  spaces: SpaceType[];
  scheduleIsValid: boolean;
  // location: { label: string, value: string }; // label - address value - city
  location: string;
  phoneNumber: string;
  email: string;
  images: Array<File>;
};

type ScheduleDay = {
  isOpen: boolean;
  openingTime: string | { label: string, value: string } | any;
  closingTime: string | { label: string, value: string } | any;
};

type StoreType = {
  formData: CreatePlaceFormData;
  backgroundImage: BackgroundImageState;
  reservationShowComponent: ReservationShowComponent;
};
type Client = {
  name: string;
  phoneNumber: string;
  rating: string; //
};
type Product = {
  title: string;
  quantity: number;
  price: number;
};
type Reservation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  startTime: string;
  endTime: string;
  guestsNumber: number;
  occupiedSeats: number;
  status:
  | "PENDING"
  | "PENDING_PREORDER"
  | "CONFIRMED"
  | "CONFIRMED_PREORDER"
  | "SERVE"
  | "SERVE_PREORDER"
  | "CLOSED"
  | "REJECTED"
  | "CANCELLED"
  | "DISHONORED";
  tableId: string;
  orders: Product[];
  user: Client;
};
type Table = {
  id: string;
  createdAt: string;
  updatedAt: string;
  tableName: string;
  seats: number;
  shape: "RECTANGLE" | "SQUARE" | "ROUND" | "SMALL" | "" | "BIG_ROUND" | "SMALL_ROUND" | "BIG_SQUARE" | "SMALL_SQUARE";
  spaceId: string;
  reservations: Reservation[];
  rotationAngle:number;
  xCoordinates?: number,
  yCoordinates?: number
};

export type RestaurantItem = {
  id: string,
  itemType: "STAIRS_UP" | "STAIRS_DOWN" | "RECEPTION_BAR" | "BATHROOM" | "PLAYGROUND" | "WINDOW_VERTICAL" | "WINDOW_HORIZONTAL" | "EXIT_VERTICAL" | "EXIT_HORIZONTAL",
  spaceId: string,
  xCoordinates?: number,
  yCoordinates?: number,
  x?: number,
  y?: number,
};

export interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  image: string;
  address: string;
}
