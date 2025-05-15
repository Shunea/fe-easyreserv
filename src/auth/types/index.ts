import { AxiosResponse } from "axios";

export type AuthenticatedUser = {
  id: string;
  role: string;
  username: string;
  restaurantId: string;
  placeId:string;
  avatarURL: any;
};

export type UserResponse = AxiosResponse<{
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}>;

export type CurrentUserResponse = AxiosResponse<AuthenticatedUser>;

export type UpdateResponse = AxiosResponse<{
  success: boolean;
}>;

export type PlanBody = {
  id: string;
  name: string;
  price: number;
  type: PlanType;
  billingPeriod: BillingPeriod;
};

export enum BillingPeriod {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ANNUAL = "ANNUALLY",
}

export enum PlanType {
  TRIAL = "TRIAL",
  BASIC = "BASIC",
  ADVANCED = "ADVANCED",
  PREMIUM = "PREMIUM",
}
