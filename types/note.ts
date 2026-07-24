export interface Note {
  _id: string;
  gradeSubjectId: string;
  content: string;
  date: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteCreateRequest {
  gradeSubjectId: string;
  content: string;
  date: string;
}

export interface NoteUpdateRequest {
  content: string;
}
