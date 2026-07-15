export interface Task {
  _id: string;
  name: string;
  gradeSubjectId: string;
  semester: string;
  academicYear: string;
  order: number;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskScore {
  _id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  grade: string;
  subjectId: string;
  score: number;
  semester: string;
  academicYear: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BulkTaskScoreRequest {
  taskId: string;
  scores: { studentId: string; score: number }[];
}
