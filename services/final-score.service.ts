import { api } from "@/lib/api";

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

export default class FinalScoreService {
  static async getAll(params: { grade: string; subjectId?: string; semester: string; academicYear: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set("grade", params.grade);
    if (params.subjectId) searchParams.set("subjectId", params.subjectId);
    searchParams.set("semester", params.semester);
    searchParams.set("academicYear", params.academicYear);
    return await api<FinalScoreEntry[]>(`/final-scores?${searchParams.toString()}`);
  }

  static async calculate(data: { grade: string; subjectId?: string; semester: string; academicYear: string }) {
    return await api<CalculateResponse>("/final-scores/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
