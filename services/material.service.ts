import { api } from "@/lib/api";
import type { Material, MaterialCreateRequest, MaterialUpdateRequest, ReorderItem } from "@/types/nilai-harian";

export default class MaterialService {
  static async getAll(chapterId: string) {
    return await api<Material[]>(`/materials?chapterId=${chapterId}`);
  }

  static async create(data: MaterialCreateRequest) {
    return await api<Material>("/materials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: MaterialUpdateRequest) {
    return await api<Material>(`/materials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async reorder(chapterId: string, items: ReorderItem[]) {
    return await api<void>("/materials/reorder", {
      method: "PUT",
      body: JSON.stringify({ chapterId, items }),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/materials/${id}`, {
      method: "DELETE",
    });
  }
}
