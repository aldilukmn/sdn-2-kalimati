import { api } from "@/lib/api";

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

export default class AssessmentScoreService {
  static async getAll(params: { subjectId: string; componentKey: string; semester: string; academicYear: string }) {
    const searchParams = new URLSearchParams(params);
    return await api<AssessmentScore[]>(`/assessment-scores?${searchParams.toString()}`);
  }

  static async bulkCreate(data: BulkAssessmentScoreRequest) {
    return await api<{ message: string }>("/assessment-scores/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { score: number }) {
    return await api<AssessmentScore>(`/assessment-scores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}
