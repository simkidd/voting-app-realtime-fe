// types/vote.interface.ts

import type { Candidate, CandidatePhoto } from "./candidate.interface";
import type { Position } from "./position.interface";
import type { User } from "./user.interface";

export interface Vote {
  _id: string;
  voterId: string | User;
  positionId: string | Position;
  candidateId: string | Candidate;
  createdAt: Date;
}

export interface VoteCreateDto {
  positionId: string;
  candidateId: string;
}

export interface ElectionResult {
  position: {
    _id: string;
    title: string;
  };
  candidates: {
    _id: string;
    name: string;
    votes: number;
    photo?: CandidatePhoto;
    corporateId?: string;
  }[];
  totalVotes: number;
}

export interface ElectionResults {
  positionId: string;
  positionTitle: string;
  totalVotes: number;
  leadingCandidate?: {
    name: string;
    votes: number;
  };
}

export interface IResult {
  _id: string;
  name: string;
  department: string;
  photo: {
    imageUrl: string | null;
    publicId: string | null;
  };
  votes: number;
  percentage: number;
}
