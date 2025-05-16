import type {
  ElectionCreateDto
} from "../interfaces/election.interface";
import api from "./axios";

export const createElection = async (electionData: ElectionCreateDto) => {
  const response = await api.post("/elections/create", electionData);
  return response.data;
};

export const updateElectionStatus = async (
  electionId: string,
  status: "active" | "inactive" | "completed"
) => {
  const response = await api.patch(`/elections/${electionId}/status`, {
    status,
  });
  return response.data;
};

export const deleteElection = async (electionId: string): Promise<void> => {
  await api.delete(`/elections/${electionId}/delete`);
};

export const getElections = async () => {
  const response = await api.get("/elections");
  return response.data;
};

export const getElectionById = async (electionId: string) => {
  const response = await api.get(`/elections/${electionId}`);
  return response.data;
};
