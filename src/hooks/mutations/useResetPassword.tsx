import { resetPassword, ResetPasswordDTO } from "../../auth/api/resetPassword";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<void, AxiosError, ResetPasswordDTO>(
    (data) => resetPassword(data),
    {
      onSuccess: () => {
        navigate("/login");
      },
    }
  );
};
