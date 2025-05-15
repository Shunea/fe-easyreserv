export interface Employee {
  avatar?: string;
  avatarUrl?: string;
  createdAt?: string;
  createdBy?: string;
  documents?: {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    key: string;
    type: string;
    expireOn: Date;
    userId: string;
    number: string;
    image: string;
  }[];
  email: string;
  id: string;
  isVerified?: boolean;
  phoneNumber: string;
  department?: string;
  restaurantId?: string;
  role: string;
  roleName?: string;
  salaryType: string;
  salary?: any;
  staffSchedules?: {
    id: string;
    title: string;
    date: Date;
    floor: string;
    userId: string;
    status: string;
    color: string;
    workHours: number;
    workedHours: number;
    overWorkHours: number;
    startTime: string;
    endTime: string;
    checkStatus?: number;
    checkinTime?: string;
    checkoutTime?: string;
  }[];
  updatedAt?: any;
  username: string;
  waiterCode: string;
  vacations?: {
    id: string;
    endDate: Date;
    startDate: Date;
    avaliableDays: number;
    requestedDays: number;
    userId: string;
    vacationType: string;
    vacationIdentifier: string;
    status: string;
    key: string;
    image: string;
  }[];
  vacation?: {
    id: string;
    endDate: Date;
    startDate: Date;
    avaliableDays: number;
    requestedDays: number;
    userId: string;
    vacationType: string;
    vacationIdentifier: string;
    status: string;
    key: string;
    image: string;
  };
}

export interface TourType {
  id?: any;
  title?: string;
  floor?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  status?: string;
  date?: any;
  color?: any;
  originalTitle?: any;
  purpose?: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    date: any;
    userId: string;
    scheduleId: string;
  };
}

export interface Vacation {
  id: string;
  endDate: Date;
  startDate: Date;
  avaliableDays: number;
  requestedDays: number;
  userId: string;
  vacationType: string;
  vacationIdentifier: string;
  status: string;
  key: string;
  image: string;
}

export interface Restaurant {
  id: string;
  placeId: string;
  name: string;
  image: string;
  address: string;
}

export interface Client {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  lastVisit: string;
  status: string;
  avatar: string;
  ordersVolume: number;
  reservationsTotal: number;
  reservations: {
    date: string;
    guestsNumber: number;
    id: string;
    price: number;
    serviceRating: number;
    type: string;
    waiterName: string;
    waiterAvatar: string;
  }[];
  reviews: {
    id: string;
    message: string;
    rating: number;
    updatedAt: string;
    userId: string;
    restaurantImage: string;
    restaurantName: string;
    date: string;
  }[];
  isRecurrent?: boolean;
  phone?: string;
}

export interface Reservation {
  contacts: {
    phoneNumber: string;
    username: string;
    avatarUrl: string;
  };
  general: {
    date: string;
    place: string;
    quests: number;
    space: string[];
    status: string;
    table: string[];
    tableSeats: number;
    waiterName: string;
    waiterAvatar: string;
  };
  id: string;
  waiterId:string;
  orders: {
    price: string;
    quantity: number;
    title: string;
  }[];
  ordersTotal: number;
  reservationNumber: number;
}
