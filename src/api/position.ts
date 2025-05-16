import type {
  PositionCreateDto
} from "../interfaces/position.interface";
import api from "./axios";

export const createPosition = async (positionData: PositionCreateDto) => {
  const response = await api.post("/positions", positionData);
  return response.data;
};

export const togglePositionStatus = async (positionId: string) => {
  const response = await api.patch(`/positions/${positionId}/status`);
  return response.data;
};

export const deletePosition = async (positionId: string): Promise<void> => {
  await api.delete(`/positions/${positionId}/delete`);
};

export const getPositions = async (electionId?: string) => {
  const url = electionId ? `/positions?electionId=${electionId}` : "/positions";
  const response = await api.get(url);
  return response.data;
};
