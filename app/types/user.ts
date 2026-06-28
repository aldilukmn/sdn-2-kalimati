interface TeacherType {
  _id: string;
  username: string;
  fullName: string;
  nip: string;
  grade: string;
  title: string;
  role: string;
}

interface UserApiResponse {
  result?: TeacherType[];
  data?: TeacherType[];
}
