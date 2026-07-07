export type LoginResult = string;

export interface JwtPayload {
  user: string;
  role: string;
  grade?: string;
  savingsHolder?: boolean;
  fullName?: string;
  iat: number;
  exp: number;
}
