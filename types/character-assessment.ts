export interface HabitEntry {
  habitId: string;
  value: "A" | "B" | "C" | "D";
  weight: number;
}

export interface CharacterAssessment {
  _id: string;
  studentId: string;
  name: string;
  grade: string;
  academicYear: string;
  semester: string;
  month: string;
  monthOrder: number;
  habits: HabitEntry[];
  totalWeight: number;
  maxWeight: number;
  characterScore: number;
  recordedBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentListItem {
  _id: string;
  studentId: string;
  name: string;
  grade: string;
  academicYear: string;
  semester: string;
  month: string;
  monthOrder: number;
  characterScore: number;
  updatedAt?: string;
}

export interface AssessmentCreateRequest {
  studentId: string;
  name: string;
  grade: string;
  academicYear: string;
  semester: string;
  month: string;
  monthOrder: number;
  habits: { habitId: string; value: "A" | "B" | "C" | "D" }[];
}

export interface AssessmentUpdateRequest {
  studentId?: string;
  name?: string;
  grade?: string;
  academicYear?: string;
  semester?: string;
  month?: string;
  monthOrder?: number;
  habits?: { habitId: string; value: "A" | "B" | "C" | "D" }[];
}

export interface HistoryItem {
  month: string;
  monthOrder: number;
  characterScore: number;
}
