import crypto from "node:crypto";

type JsonApiResponse<T = unknown> = {
  data?: T;
  errors?: Array<{ status?: string; title?: string; detail?: string }>;
};

function getApiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return key;
}

function getStoreId(): string {
  const id = process.env.LEMONSQUEEZY_STORE_ID;
  if (!id) throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  return id;
}

async function lemonFetch<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const res = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${getApiKey()}`,
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  const json = (text ? JSON.parse(text) : {}) as JsonApiResponse;

  if (!res.ok) {
    const msg =
      json?.errors?.[0]?.detail ??
      json?.errors?.[0]?.title ??
      `Lemon Squeezy API error (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}

export function verifyLemonSqueezyWebhook(
  rawBody: Buffer,
  signatureHeader: string | undefined,
): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) return false;
  const signature = signatureHeader ?? "";

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const provided = Buffer.from(signature, "utf8");
  if (digest.length !== provided.length) return false;
  return crypto.timingSafeEqual(digest, provided);
}

export async function createCheckoutUrl(input: {
  variantId: number;
  userId: string;
  userEmail: string;
  redirectUrl: string;
}): Promise<string> {
  const storeId = getStoreId();

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        product_options: {
          redirect_url: input.redirectUrl,
        },
        checkout_data: {
          email: input.userEmail,
          custom: {
            user_id: input.userId,
          },
        },
      },
      relationships: {
        store: {
          data: { type: "stores", id: String(storeId) },
        },
        variant: {
          data: { type: "variants", id: String(input.variantId) },
        },
      },
    },
  };

  const res = await lemonFetch<{
    data: { attributes: { url: string } };
  }>("/checkouts", { method: "POST", body: JSON.stringify(payload) });

  const url = res?.data?.attributes?.url;
  if (!url) throw new Error("Missing checkout URL from Lemon Squeezy response");
  return url;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await lemonFetch(`/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function getSubscription(subscriptionId: string) {
  return lemonFetch<unknown>(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "GET",
  });
}

