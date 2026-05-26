export type Language = "ar" | "en" | "fr";

export type Plan = "FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL";

export interface User {
  id: string;
  email: string;
  name: string | null;
  language: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  error?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  language: Language;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface GenerateStoryInput {
  childName: string;
  childAge: number;
  theme: string;
  moral?: string;
  language: Language;
  duration?: number;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  language: string;
  theme: string;
  moral: string | null;
  childName: string;
  childAge: number;
  audioUrl: string | null;
  imageUrl: string | null;
  userId: string;
  childId: string | null;
  isFavorite: boolean;
  createdAt: string;
}

export interface StoryResponse {
  success: boolean;
  story: Story;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
}
