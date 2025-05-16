// types/candidate.interface.ts
import type { Position } from "./position.interface";

export interface CandidatePhoto {
  imageUrl: string;
  publicId: string | null;
}

export interface Candidate {
  _id: string;
  name: string;
  department: string;
  corporateId: string;
  positionId: string | Position;
  electionId: string;
  photo: CandidatePhoto;
  qualifications: string[];
  manifesto: string;
  votes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CandidateCreateDto {
  name: string;
  corporateId: string;
  positionId: string;
  electionId: string;
  photo: CandidatePhoto;
  qualifications: string[];
  manifesto: string;
}
