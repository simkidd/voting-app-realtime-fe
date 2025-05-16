import api from "./axios";

interface LoginCredentials {
  corporateId: string;
  pin: string;
}

export const login = async ({ corporateId, pin }: LoginCredentials) => {
  const response = await api.post("/auth/login", { corporateId, pin });
  return response.data;
};

export const getMe = async ()=> {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
