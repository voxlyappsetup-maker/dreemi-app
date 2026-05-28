import type {
  AuthResponse,
  GenerateStoryInput,
  LoginInput,
  RegisterInput,
  Story,
  StoryResponse,
  User,
} from "@dreemi/types";

export interface StoriesListResponse {
  success: boolean;
  stories: Story[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://dreemi-app.onrender.com";

export function pingBackend() {
  return fetch(`${API_URL}/health`, { method: "GET" }).catch(() => {});
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
  });

  const data = (await res.json()) as T & { error?: string };

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "An unexpected error occurred";
    throw new ApiError(res.status, message);
  }

  return data;
}

export async function register(
  input: RegisterInput
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function generateStory(
  input: GenerateStoryInput
): Promise<StoryResponse> {
  return apiFetch<StoryResponse>(
    "/api/stories/generate",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    true
  );
}

export async function fetchStories(_userId?: string): Promise<Story[]> {
  const data = await apiFetch<StoriesListResponse>("/api/stories", {}, true);
  return data.stories;
}

export async function fetchChildStories(_userId: string, childId: string): Promise<Story[]> {
  const data = await apiFetch<StoriesListResponse>(
    `/api/stories?childId=${encodeURIComponent(childId)}`,
    {},
    true,
  );
  return data.stories;
}

export async function getChild(id: string): Promise<Child> {
  const data = await apiFetch<{ success: boolean; children: Child[] }>(
    "/api/children",
    {},
    true,
  );
  const child = data.children.find((c) => c.id === id);
  if (!child) throw new ApiError(404, "Child not found");
  return child;
}

/** Create a Lemon Squeezy Checkout session and return the redirect URL. */
export async function createCheckout(variantId: number): Promise<string> {
  const data = await apiFetch<{ success: boolean; url: string }>(
    "/api/payments/checkout",
    { method: "POST", body: JSON.stringify({ variantId }) },
    true,
  );
  return data.url;
}

/** Fetch subscription details (includes provider URLs when available). */
export async function getSubscription(): Promise<unknown> {
  const data = await apiFetch<{ success: boolean; subscription: unknown; remote: unknown }>(
    "/api/payments/subscription",
    {},
    true,
  );
  return data;
}

/* ── Children CRUD ─────────────────────────────────────── */

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: string;
  skinTone: string;
  hairColor: string;
  personality: string | null;
  hobbies: string | null;
  favAnimal: string | null;
  avatarUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { stories: number };
}

export async function fetchChildren(): Promise<Child[]> {
  const data = await apiFetch<{ success: boolean; children: Child[] }>(
    "/api/children",
    {},
    true,
  );
  return data.children;
}

export async function createChild(input: {
  name: string;
  age: number;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
  personality?: string | null;
  hobbies?: string | null;
  favAnimal?: string | null;
}): Promise<Child> {
  const data = await apiFetch<{ success: boolean; child: Child }>(
    "/api/children",
    { method: "POST", body: JSON.stringify(input) },
    true,
  );
  return data.child;
}

export async function updateChild(
  id: string,
  input: {
    name?: string;
    age?: number;
    gender?: string;
    skinTone?: string;
    hairColor?: string;
    personality?: string | null;
    hobbies?: string | null;
    favAnimal?: string | null;
  },
): Promise<Child> {
  const data = await apiFetch<{ success: boolean; child: Child }>(
    `/api/children/${encodeURIComponent(id)}`,
    { method: "PUT", body: JSON.stringify(input) },
    true,
  );
  return data.child;
}

export async function deleteChild(id: string): Promise<void> {
  await apiFetch(
    `/api/children/${encodeURIComponent(id)}`,
    { method: "DELETE" },
    true,
  );
}

/** Fetch a single story by ID. Requires authentication — only the story owner can read it. */
export async function getStoryById(id: string): Promise<Story> {
  const data = await apiFetch<{ success: boolean; story: Story }>(
    `/api/stories/${encodeURIComponent(id)}`,
    {},
    true,
  );
  return data.story;
}

/** Delete a story owned by the current user. */
export async function deleteStory(storyId: string): Promise<void> {
  await apiFetch(
    `/api/stories/${encodeURIComponent(storyId)}`,
    { method: "DELETE" },
    true,
  );
}

/** Fetch the current user's profile from the API (fresh from database). */
export async function getMe(): Promise<User> {
  const data = await apiFetch<{ success: boolean; user: User }>(
    "/api/auth/me",
    {},
    true,
  );
  return data.user;
}

/** Update user profile (name and/or language). */
export async function updateProfile(data: { name?: string; language?: string }): Promise<User> {
  const res = await apiFetch<{ success: boolean; user: User }>(
    "/api/auth/profile",
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );
  return res.user;
}

/** Change password. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch(
    "/api/auth/password",
    { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) },
    true,
  );
}

/** GDPR: Export all user data as a readable HTML file. */
export async function exportUserData(): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(`${API_URL}/api/auth/export-data`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new ApiError(res.status, "Failed to export data");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dreemi-export.html";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** GDPR: Delete user account permanently. */
export async function deleteAccount(): Promise<void> {
  await apiFetch(
    "/api/auth/delete-account",
    { method: "DELETE", body: JSON.stringify({ confirm: "DELETE" }) },
    true,
  );
}

/** Cancel subscription at period end. Returns the date access ends. */
export async function cancelSubscription(): Promise<void> {
  await apiFetch(
    "/api/payments/cancel",
    { method: "POST" },
    true,
  );
}
