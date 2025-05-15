import { handleUserResponse, LoginCredentialsDTO } from "../../auth/api/login";
import { AuthenticatedUser, UserResponse } from "../../auth/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "src/auth/api/apiInstance";

async function loginFn(data: LoginCredentialsDTO) {
  const response = await api.post<LoginCredentialsDTO, UserResponse>(
    "/auth/login",
    data
  );
  const user = await handleUserResponse(response);
  return user;
}
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: AuthenticatedUser) =>
      queryClient.setQueryData(["get-authenticated-user"], data),
    [queryClient]
  );

  const storedRestaurant = JSON.parse(
    localStorage.getItem("selectedRestaurant") ?? "null"
  );

  return useMutation<AuthenticatedUser, AxiosError, LoginCredentialsDTO>(
    (data) => loginFn(data),
    {
      onSuccess: (data) => {
        setUser(data);
        if (data.role === 'ADMIN') {
          navigate("/dashboard");
        } else if (storedRestaurant || data.restaurantId) {
          navigate("/your-places"); 
        } else {
          navigate("/create-place");
        }
      },
    }
  );
};
