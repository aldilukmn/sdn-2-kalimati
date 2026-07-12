export interface AssessmentScore {
  _id: string;
  studentId: string;
  studentName: string;
  grade: string;
  subjectId: string;
  componentKey: string;
  score: number;
  semester: string;
  academicYear: string;
  recordedBy: string;
}

export interface BulkAssessmentScoreRequest {
  subjectId: string;
  componentKey: string;
  semester: string;
  academicYear: string;
  scores: { studentId: string; score: number }[];
}
