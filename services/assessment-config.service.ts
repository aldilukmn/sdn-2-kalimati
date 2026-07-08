import { api } from "@/lib/api";
import type { AssessmentConfig, AssessmentComponent } from "@/types/nilai-harian";

export interface AssessmentConfigCreateRequest {
  grade: string;
  semester: string;
  academicYear: string;
  components: AssessmentComponent[];
}

export default class AssessmentConfigService {
  static async getAll(params?: { grade?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.grade) searchParams.set("grade", params.grade);
    const qs = searchParams.toString();
    return await api<AssessmentConfig[]>(`/assessment-configs${qs ? `?${qs}` : ""}`);
  }

  static async getActive(params: { grade: string; semester: string; academicYear: string }) {
    const searchParams = new URLSearchParams(params);
    return await api<AssessmentConfig>(`/assessment-configs/active?${searchParams.toString()}`);
  }

  static async create(data: AssessmentConfigCreateRequest) {
    return await api<AssessmentConfig>("/assessment-configs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: { components: AssessmentComponent[] }) {
    return await api<AssessmentConfig>(`/assessment-configs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/assessment-configs/${id}`, {
      method: "DELETE",
    });
  }
}
