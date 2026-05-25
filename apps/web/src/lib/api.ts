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

/** Fetch the current user's profile from the API (fresh from database). */
export async function getMe(): Promise<User> {
  const data = await apiFetch<{ success: boolean; user: User }>(
    "/api/auth/me",
    {},
    true,
  );
  return data.user;
}
