export interface Subject {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectCreateRequest {
  name: string;
}

export interface SubjectUpdateRequest {
  name?: string;
}

export interface GradeSubject {
  _id: string;
  subjectId: string;
  subjectName?: string;
  grade: string;
  semester: string;
  academicYear: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GradeSubjectCreateRequest {
  subjectId: string;
  grade: string;
  semester: string;
  academicYear: string;
}

export interface GradeSubjectUpdateRequest {
  grade?: string;
  semester?: string;
  academicYear?: string;
}

export interface GradeSubjectQueryParams {
  grade?: string;
  semester?: string;
  academicYear?: string;
}
