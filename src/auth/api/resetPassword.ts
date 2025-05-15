import api from "./requests";

export type ResetPasswordDTO = {
  tokenKey: string;
  password: string;
};

export const resetPassword = async (data: ResetPasswordDTO): Promise<void> => {
  return await api.post(`/auth/update-password/`, {
    password: data.password,
    tokenKey: data.tokenKey,
  });
};
