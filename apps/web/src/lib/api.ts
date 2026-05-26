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
        : "حدث خطأ غير متوقع";
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

export async function fetchStories(userId: string): Promise<Story[]> {
  const data = await apiFetch<StoriesListResponse>(
    `/api/stories?userId=${encodeURIComponent(userId)}`
  );
  return data.stories;
}

/** Create a Stripe Checkout session and return the redirect URL. */
export async function createCheckout(priceId: string): Promise<string> {
  const data = await apiFetch<{ success: boolean; url: string }>(
    "/api/payments/create-checkout",
    { method: "POST", body: JSON.stringify({ priceId }) },
    true,
  );
  return data.url;
}

/** Create a Stripe Customer Portal session and return the redirect URL. */
export async function createPortal(): Promise<string> {
  const data = await apiFetch<{ success: boolean; url: string }>(
    "/api/payments/create-portal",
    { method: "POST" },
    true,
  );
  return data.url;
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

/** Fetch a single story by ID (public, no auth required). */
export async function getStoryById(id: string): Promise<Story> {
  const data = await apiFetch<{ success: boolean; story: Story }>(
    `/api/stories/${encodeURIComponent(id)}`,
  );
  return data.story;
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
export async function cancelSubscription(): Promise<string> {
  const data = await apiFetch<{ success: boolean; periodEnd: string }>(
    "/api/payments/cancel-subscription",
    { method: "POST" },
    true,
  );
  return data.periodEnd;
}
