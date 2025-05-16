import type { User } from "./user.interface";

// types/election.interface.ts
export interface Election {
  _id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: 'active' | 'inactive' | 'completed';
  createdBy: string | User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ElectionCreateDto {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status?: 'active' | 'inactive' | 'completed';
}