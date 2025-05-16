// types/user.interface.ts
export interface User {
  _id: string;
  corporateId: string;
  name: string;
  email: string;
  role: 'admin' | 'voter';
  department: string;
  hasVoted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}