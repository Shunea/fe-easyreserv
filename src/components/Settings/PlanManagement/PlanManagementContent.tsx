import Tick from "../../../assets/Tick.svg";
import Cross from "../../../assets/Cross.svg";
import { StaticImageData } from "next/image";

export interface ContentInfoText {
  type: "text";
  value: string | null;
  id: string;
}

export interface ContentInfoImage {
  type: "image";
  src: StaticImageData;
  alt: string;
  id: string;
}

export interface UserType {
  userType: string;
  contentInfo: (ContentInfoText | ContentInfoImage)[] | null;
}

const userData: UserType[] = [
  {
    userType: "User Types",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Admin",
    contentInfo: [
      { type: "text", value: "1", id: "BASIC" },
      { type: "text", value: "1", id: "STANDARD" },
      { type: "text", value: "1", id: "PRO" },
      { type: "text", value: "Unlimited", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Hostess",
    contentInfo: [
      { type: "text", value: "1", id: "BASIC" },
      { type: "text", value: "1", id: "STANDARD" },
      { type: "text", value: "1", id: "PRO" },
      { type: "text", value: "Unlimited", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Waiters",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "text", value: "3", id: "STANDARD" },
      { type: "text", value: "5", id: "PRO" },
      { type: "text", value: "Unlimited", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Cooks",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "text", value: "3", id: "PRO" },
      { type: "text", value: "Unlimited", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Business setup",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Working hours",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Booking duration",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Photo gallery",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Point on map",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Place setup",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD place",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD tables",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Menu setup",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD menu",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Menu import",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Reservations setup",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Accept / Reject",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Tracking",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Calendar access",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Client reviews",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Edit",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Create",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Order",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Order management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Accept / Reject",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Delivery",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Notifications",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Staff management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD employee",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Working schedule",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Vacations / Days-off",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Documents",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Overall staff",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Check in / out",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Timetable",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Clients management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Listing",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Details",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Reservations",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Marketing tools",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD messages",
    contentInfo: [
      { type: "text", value: "1 / month", id: "BASIC" },
      { type: "text", value: "1 / month", id: "STANDARD" },
      { type: "text", value: "2 / month", id: "PRO" },
      { type: "text", value: "2 / month", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Targeting",
    contentInfo: [
      { type: "image", src: Tick, alt: "tick", id: "BASIC" },
      { type: "image", src: Tick, alt: "tick", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Reports",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Dashboard access",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Reservations",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Clients",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Business rating",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Sales",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Stocks management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Create stock",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Stock monitoring",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Stock updates",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Tick, alt: "tick", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Suppliers management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD supplier",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD order",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Order history",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Transport park",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Listing",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Assign employee",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Car history",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Task planning",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD PROject",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "CRUD task",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Assignment",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "PROgress tracking",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Financial management",
    contentInfo: [
      { type: "text", value: null, id: "BASIC" },
      { type: "text", value: null, id: "STANDARD" },
      { type: "text", value: null, id: "PRO" },
      { type: "text", value: null, id: "ENTERPRISE" },
    ],
  },
  {
    userType: "Debit / Credit",
    contentInfo: [
      { type: "image", src: Cross, alt: "cross", id: "BASIC" },
      { type: "image", src: Cross, alt: "cross", id: "STANDARD" },
      { type: "image", src: Cross, alt: "cross", id: "PRO" },
      { type: "image", src: Tick, alt: "tick", id: "ENTERPRISE" },
    ],
  },
];

export default userData;
