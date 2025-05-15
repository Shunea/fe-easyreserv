import { CurrentUserResponse } from "../types";
import api from "./requests";

export type CreateUserDTO = {
  email: string;
};

export const forgotPassword = async (
  data: CreateUserDTO
): Promise<CurrentUserResponse> => {
  return api.post("/auth/reset-password", data);
};
