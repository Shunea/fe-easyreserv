import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getAuthenticatedUser } from "src/auth/api/requests";
import { AuthenticatedUser } from "src/auth/types";

const getAuthUser = async (token) => {
  if (token) {
    const response = await getAuthenticatedUser();
    return response;
  }
};

const useAuthenticatedUser = (token) => {
  return useQuery<AuthenticatedUser, AxiosError>(["authenticated-user"], () =>
    getAuthUser(token)
  );
};

export default useAuthenticatedUser;
