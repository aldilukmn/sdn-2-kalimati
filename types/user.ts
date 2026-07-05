export interface User {
  _id: string;
  username: string;
  role: string;

  createdAt: string;
  updatedAt: string;
}

export interface TeacherType {
  _id: string;
  username: string;
  fullName: string;
  nip: string;
  grade: string;
  title: string;
  role: string;
  treasurer?: boolean;
}