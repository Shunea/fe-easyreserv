import { CurrentUserResponse } from "../../auth/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { forgotPassword, CreateUserDTO } from "src/auth/api/forgotPassword";

export const useForgotPassword = () => {
  return useMutation<CurrentUserResponse, AxiosError, CreateUserDTO>(
    (data) => forgotPassword(data),
    {}
  );
};
