export interface LitnumTask {
  _id: string;
  academicYear: string;
  semester: string;
  grade: string;
  name: string;
  inputtedCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LitnumScore {
  _id: string;
  litnumId: string;
  studentId: string;
  score: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkLitnumScoreRequest {
  litnumId: string;
  scores: {
    studentId: string;
    score: number | null;
  }[];
}
