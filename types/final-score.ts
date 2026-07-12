export interface ComponentScoreDto {
  key: string;
  rawScore: number;
  weight: number;
  weightedScore: number;
}

export interface FinalScoreEntry {
  _id: string;
  studentId: string;
  studentName: string;
  grade: string;
  subjectId: string;
  subjectName: string;
  semester: string;
  academicYear: string;
  componentScores: ComponentScoreDto[];
  finalScore: number | null;
  missingComponents: string[];
  calculatedAt?: string;
  isStale?: boolean;
}

export interface CalculateResponse {
  grade: string;
  semester: string;
  academicYear: string;
  totalStudents: number;
  totalSubjects: number;
  totalRecords: number;
  configUsed: {
    _id: string;
    components: { key: string; name: string; weight: number }[];
  };
}
