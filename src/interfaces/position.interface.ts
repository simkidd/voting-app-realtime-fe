// types/position.interface.ts
import type { Candidate } from './candidate.interface';
import type { Election } from './election.interface';
import type { User } from './user.interface';

export interface Position {
  _id: string;
  title: string;
  description: string;
  electionId: string | Election;
  isActive: boolean;
  createdBy: string | User;
  candidates?: Candidate[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PositionCreateDto {
  title: string;
  description: string;
  electionId: string;
  isActive?: boolean;
}