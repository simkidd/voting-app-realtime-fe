import api from "./axios";

export const getCandidates = async (params?: {
  positionId?: string;
  electionId?: string;
}) => {
  const response = await api.get("/candidates", { params });
  return response.data;
};
