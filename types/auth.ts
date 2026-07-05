export type LoginResult = string;

export interface JwtPayload {
  user: string;
  role: string;
  grade?: string;
  treasurer?: boolean;
  fullName?: string;
  iat: number;
  exp: number;
}
