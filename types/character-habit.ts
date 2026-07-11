export interface CharacterHabit {
  _id: string;
  name: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CharacterHabitCreateRequest {
  name: string;
  order: number;
}

export interface CharacterHabitUpdateRequest {
  name?: string;
  order?: number;
}
