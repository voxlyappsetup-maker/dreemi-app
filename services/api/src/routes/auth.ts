import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Plan, User } from "@prisma/client";
import { prisma } from "../services/prisma.service";
import {
  signTokenPair,
  verifyRefreshToken,
} from "../services/jwt.service";
import { authenticateToken } from "../middleware/auth.middleware";
import { stripe } from "../services/stripe.service";

export const authRouter = Router();

const BCRYPT_ROUNDS = 12;
const INVALID_CREDENTIALS_MSG =
  "البريد الإلكتروني أو كلمة المرور غير صحيحة";

const languageSchema = z.enum(["ar", "en", "fr"], {
  errorMap: () => ({ message: "اللغة يجب أن تكون ar أو en أو fr" }),
});

const registerSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  name: z
    .string({ required_error: "الاسم مطلوب" })
    .min(1, "الاسم مطلوب")
    .max(100, "الاسم طويل جداً"),
  language: languageSchema,
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صالح"),
  password: z.string({ required_error: "كلمة المرور مطلوبة" }),
});

const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "رمز التحديث مطلوب" }).min(1),
});

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  language: string;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
};

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    language: user.language,
    plan: user.plan,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join("، ");
}

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const input = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        error: "البريد الإلكتروني مستخدم بالفعل",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        language: input.language,
      },
    });

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.status(201).json({
      success: true,
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل إنشاء الحساب" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user?.passwordHash) {
      res.status(401).json({
        success: false,
        error: INVALID_CREDENTIALS_MSG,
      });
      return;
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({
        success: false,
        error: INVALID_CREDENTIALS_MSG,
      });
      return;
    }

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.json({
      success: true,
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل تسجيل الدخول" });
  }
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const input = refreshSchema.parse(req.body);

    let userId: string;
    try {
      ({ userId } = verifyRefreshToken(input.refreshToken));
    } catch {
      res.status(401).json({
        success: false,
        error: "رمز التحديث غير صالح أو منتهي الصلاحية",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({
        success: false,
        error: "رمز التحديث غير صالح أو منتهي الصلاحية",
      });
      return;
    }

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل تحديث الرمز" });
  }
});

authRouter.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    res.json({ success: true, user: toPublicUser(user) });
  } catch {
    res.status(500).json({ success: false, error: "فشل جلب بيانات المستخدم" });
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/auth/export-data  (GDPR Article 20 — data portability)   */
/* ------------------------------------------------------------------ */

authRouter.get("/export-data", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        stories: { orderBy: { createdAt: "desc" } },
        subscription: true,
        children: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    const html = buildExportHtml(user);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="dreemi-export.html"');
    res.send(html);
  } catch (err) {
    console.error("[Auth] export-data error:", err);
    res.status(500).json({ success: false, error: "فشل تصدير البيانات" });
  }
});

function buildExportHtml(user: User & {
  stories: Array<{
    id: string; title: string; content: string; language: string;
    theme: string; moral: string | null; childName: string; childAge: number;
    isFavorite: boolean; createdAt: Date;
  }>;
  subscription: {
    plan: string; status: string;
    currentPeriodStart: Date; currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  } | null;
  children: Array<{ id: string; name: string; age: number; createdAt: Date }>;
}): string {
  const isAr = user.language === "ar";
  const dir = isAr ? "rtl" : "ltr";
  const now = new Date();

  const LANG_FLAGS: Record<string, string> = { ar: "🇸🇦", en: "🇬🇧", fr: "🇫🇷" };
  const LANG_NAMES: Record<string, string> = { ar: "العربية", en: "English", fr: "Français" };
  const PLAN_NAMES: Record<string, string> = {
    FREE: isAr ? "مجاني" : "Free",
    INDIVIDUAL: isAr ? "فردي" : "Individual",
    FAMILY: isAr ? "عائلي" : "Family",
    SCHOOL: isAr ? "مدرسي" : "School",
  };
  const STATUS_NAMES: Record<string, string> = {
    active: isAr ? "نشط" : "Active",
    canceled: isAr ? "ملغى" : "Canceled",
    past_due: isAr ? "متأخر" : "Past Due",
    trialing: isAr ? "تجريبي" : "Trial",
  };

  function esc(s: string | null | undefined): string {
    if (!s) return "";
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function fmtDate(d: Date): string {
    return new Intl.DateTimeFormat(isAr ? "ar" : "en", {
      year: "numeric", month: "long", day: "numeric",
    }).format(new Date(d));
  }

  function storyContentToHtml(content: string): string {
    return content
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(p => `<p style="margin:0 0 14px;line-height:1.9">${esc(p.trim()).replace(/\n/g, "<br>")}</p>`)
      .join("\n");
  }

  const storiesHtml = user.stories.map((s) => `
    <div style="page-break-inside:avoid;border:1px solid #e5e7eb;border-radius:16px;padding:28px 24px;margin-bottom:24px;background:#fff">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:#7c3aed;font-weight:600">${esc(s.childName)} · ${s.childAge} ${isAr ? "سنوات" : "years"}</span>
        <div style="display:flex;gap:8px;align-items:center">
          <span style="font-size:12px;padding:2px 10px;border-radius:20px;background:#f3f4f6">${LANG_FLAGS[s.language] || ""} ${LANG_NAMES[s.language] || s.language}</span>
          <span style="font-size:12px;color:#9ca3af">${fmtDate(s.createdAt)}</span>
          ${s.isFavorite ? '<span style="color:#ef4444">❤</span>' : ""}
        </div>
      </div>
      <h3 style="font-size:22px;font-weight:700;color:#1e293b;margin:0 0 6px">${esc(s.title)}</h3>
      <p style="font-size:12px;color:#64748b;margin:0 0 16px">${isAr ? "الموضوع" : "Theme"}: ${esc(s.theme)}</p>
      <div style="font-size:15px;color:#334155">
        ${storyContentToHtml(s.content)}
      </div>
      ${s.moral ? `
      <div style="margin-top:18px;padding:14px 18px;border-radius:12px;background:#f5f3ff">
        <strong style="font-size:13px;color:#7c3aed">${isAr ? "القيمة المستفادة" : "Moral"}</strong>
        <p style="margin:4px 0 0;font-size:14px;color:#475569">${esc(s.moral)}</p>
      </div>` : ""}
    </div>`).join("\n");

  const subHtml = user.subscription ? `
    <div style="border:1px solid #e5e7eb;border-radius:16px;padding:24px;background:#fff">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "الخطة" : "Plan"}</span><strong>${PLAN_NAMES[user.subscription.plan] || user.subscription.plan}</strong></div>
        <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "الحالة" : "Status"}</span><strong>${STATUS_NAMES[user.subscription.status] || user.subscription.status}</strong></div>
        <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "بداية الفترة" : "Period Start"}</span>${fmtDate(user.subscription.currentPeriodStart)}</div>
        <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "نهاية الفترة" : "Period End"}</span>${fmtDate(user.subscription.currentPeriodEnd)}</div>
      </div>
    </div>` : `<p style="color:#64748b">${isAr ? "لا يوجد اشتراك" : "No subscription"}</p>`;

  return `<!DOCTYPE html>
<html lang="${user.language}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dreemi — ${isAr ? "تصدير البيانات" : "Data Export"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: ${isAr ? "'Noto Sans Arabic'," : ""} 'Inter', system-ui, sans-serif;
    background: #f8f7ff; color: #1e293b; line-height: 1.6;
    padding: 40px 20px;
  }
  .container { max-width: 800px; margin: 0 auto; }
  @media print {
    body { background: #fff; padding: 0; font-size: 12pt; }
    .no-print { display: none !important; }
    .story-card { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div style="text-align:center;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #ede9fe">
    <div style="display:inline-block;background:#7c3aed;color:#fff;width:56px;height:56px;border-radius:16px;line-height:56px;font-size:24px;font-weight:700;margin-bottom:12px">D</div>
    <h1 style="font-size:28px;font-weight:700;color:#1e293b;margin:0">Dreemi</h1>
    <p style="font-size:14px;color:#64748b;margin-top:4px">${isAr ? "تصدير البيانات" : "Data Export"} — ${fmtDate(now)}</p>
    <p style="font-size:13px;color:#94a3b8;margin-top:2px">${esc(user.name)} · ${esc(user.email)}</p>
  </div>

  <!-- Profile -->
  <section style="margin-bottom:32px">
    <h2 style="font-size:20px;font-weight:700;color:#7c3aed;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #ede9fe">
      ${isAr ? "الملف الشخصي" : "Profile"}
    </h2>
    <div style="border:1px solid #e5e7eb;border-radius:16px;padding:24px;background:#fff;display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "الاسم" : "Name"}</span><strong>${esc(user.name)}</strong></div>
      <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "البريد" : "Email"}</span><strong>${esc(user.email)}</strong></div>
      <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "اللغة" : "Language"}</span>${LANG_FLAGS[user.language] || ""} ${LANG_NAMES[user.language] || user.language}</div>
      <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "الخطة" : "Plan"}</span>${PLAN_NAMES[user.plan] || user.plan}</div>
      <div><span style="font-size:12px;color:#64748b;display:block">${isAr ? "عضو منذ" : "Member Since"}</span>${fmtDate(user.createdAt)}</div>
    </div>
  </section>

  <!-- Stories -->
  <section style="margin-bottom:32px">
    <h2 style="font-size:20px;font-weight:700;color:#7c3aed;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #ede9fe">
      ${isAr ? "القصص" : "Stories"} (${user.stories.length})
    </h2>
    ${user.stories.length === 0
      ? `<p style="color:#64748b">${isAr ? "لا توجد قصص بعد" : "No stories yet"}</p>`
      : storiesHtml}
  </section>

  <!-- Subscription -->
  <section style="margin-bottom:32px">
    <h2 style="font-size:20px;font-weight:700;color:#7c3aed;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #ede9fe">
      ${isAr ? "الاشتراك" : "Subscription"}
    </h2>
    ${subHtml}
  </section>

  <!-- Footer -->
  <div style="text-align:center;padding-top:24px;border-top:1px solid #ede9fe;color:#94a3b8;font-size:12px">
    <p>${isAr ? "تم التصدير بموجب المادة ٢٠ من قانون GDPR — حق نقل البيانات" : "Exported under GDPR Article 20 — Right to Data Portability"}</p>
    <p style="margin-top:4px">© ${now.getFullYear()} Dreemi</p>
  </div>

</div>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  DELETE /api/auth/delete-account  (GDPR Article 17 — right to erasure) */
/* ------------------------------------------------------------------ */

const deleteSchema = z.object({
  confirm: z.literal("DELETE", {
    errorMap: () => ({ message: 'يجب كتابة "DELETE" للتأكيد' }),
  }),
});

authRouter.delete("/delete-account", authenticateToken, async (req: Request, res: Response) => {
  try {
    deleteSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { subscription: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    // Cancel active Stripe subscription if exists
    if (user.subscription?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
        console.log(`[Auth] cancelled Stripe sub ${user.subscription.stripeSubscriptionId}`);
      } catch (err) {
        console.warn("[Auth] failed to cancel Stripe subscription:", err);
      }
    }

    // Prisma cascades will delete stories, children, and subscription
    await prisma.user.delete({ where: { id: req.userId } });

    console.log(`[Auth] ✓ account deleted: user=${req.userId} email=${user.email}`);
    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(err) });
      return;
    }
    console.error("[Auth] delete-account error:", err);
    res.status(500).json({ success: false, error: "فشل حذف الحساب" });
  }
});
