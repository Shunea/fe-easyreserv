import api from "./apiInstance";

export type EmailVerificationDTO = {
  tokenKey: string;
};

export const emailVerification = async (
  data: EmailVerificationDTO
): Promise<void> => {
  return await api.post(`/user/confirm`, {
    tokenKey: data.tokenKey,
  });
};
