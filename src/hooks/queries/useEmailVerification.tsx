import {
  EmailVerificationDTO,
  emailVerification,
} from "../../auth/api/emailVerfication";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useEmailVerification = () => {

  return useMutation<void, AxiosError, EmailVerificationDTO>(
    (data) => emailVerification(data)
  );
};
