import type {
  VoteCreateDto
} from "../interfaces/vote.interface";
import api from "./axios";

export const castVote = async (voteData: VoteCreateDto): Promise<void> => {
  await api.post("/votes/cast", voteData);
};

export const getResults = async (positionId: string) => {
  const response = await api.get(`/votes/${positionId}/results`);
  return response.data;
};
