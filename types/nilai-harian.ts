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

export interface Chapter {
  _id: string;
  gradeSubjectId: string;
  name: string;
  order: number;
  inputMode: "per_chapter" | "per_material";
  createdAt?: string;
  updatedAt?: string;
}

export interface ChapterCreateRequest {
  gradeSubjectId: string;
  name: string;
  inputMode?: "per_chapter" | "per_material";
}

export interface ChapterUpdateRequest {
  name?: string;
  order?: number;
  inputMode?: "per_chapter" | "per_material";
}

export interface ReorderItem {
  _id: string;
  order: number;
}

export interface Material {
  _id: string;
  chapterId: string;
  name: string;
  order: number;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialCreateRequest {
  chapterId: string;
  name: string;
}

export interface MaterialUpdateRequest {
  name?: string;
  order?: number;
}
