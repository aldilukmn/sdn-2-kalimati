import { api } from "@/lib/api";
import type { CharacterHabit, CharacterHabitCreateRequest, CharacterHabitUpdateRequest } from "@/types/character-habit";

export default class CharacterHabitService {
  static async getAll(skipAuthRedirect = false) {
    return await api<CharacterHabit[]>("/character-habits", { skipAuthRedirect });
  }

  static async getById(id: string) {
    return await api<CharacterHabit>(`/character-habits/${id}`);
  }

  static async create(data: CharacterHabitCreateRequest) {
    return await api<CharacterHabit>("/character-habits", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async update(id: string, data: CharacterHabitUpdateRequest) {
    return await api<CharacterHabit>(`/character-habits/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async remove(id: string) {
    return await api<void>(`/character-habits/${id}`, {
      method: "DELETE",
    });
  }
}
