# Dreemi

تطبيق يولّد قصص نوم للأطفال بالذكاء الاصطناعي — فريدة، لا تتكرر أبداً.

## هيكل المشروع

```
dreemi-app/
├── apps/web/          → Next.js 14 — الموقع الإلكتروني
├── services/api/      → Node.js + Express — واجهة برمجية
├── packages/types/    → أنواع TypeScript المشتركة
├── packages/config/   → إعدادات TypeScript المشتركة
└── prisma/            → Prisma ORM — مخطط قاعدة البيانات
```

## المتطلبات

| الأداة | الإصدار | التثبيت |
|--------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Lemon Squeezy Dashboard | — | [lemonsqueezy.com](https://www.lemonsqueezy.com) |

## التثبيت

```bash
git clone <repo-url> dreemi-app
cd dreemi-app
pnpm install
```

## متغيرات البيئة

### الملف الجذر: `.env`

```env
# قاعدة البيانات (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# الذكاء الاصطناعي
MISTRAL_API_KEY="..."

# المصادقة
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."

# Lemon Squeezy
LEMONSQUEEZY_API_KEY="..."
LEMONSQUEEZY_STORE_ID="..."
LEMONSQUEEZY_WEBHOOK_SECRET="..."
FRONTEND_URL="http://localhost:3000"

# التطبيق
NODE_ENV="development"
API_PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### ملف الويب: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# (لا حاجة لمفاتيح Lemon Squeezy عامة في الواجهة حالياً)
```

## التشغيل

تحتاج **٣ نوافذ طرفية** منفصلة:

### الطرفية ١ — واجهة برمجية (API)

```bash
cd services/api
pnpm dev
```

### الطرفية ٢ — الموقع (Web)

```bash
cd apps/web
pnpm dev
```

### الطرفية ٣ — Lemon Squeezy Webhook

اضبط Webhook في لوحة تحكم Lemon Squeezy إلى:

`http://localhost:3001/api/payments/webhook`

## الروابط المحلية

| الخدمة | الرابط |
|--------|--------|
| الموقع | http://localhost:3000 |
| واجهة برمجية | http://localhost:3001 |
| فحص الحالة | http://localhost:3001/health |
| Prisma Studio | `pnpm db:studio` |

### صفحات الموقع

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | http://localhost:3000 |
| الأسعار | http://localhost:3000/pricing |
| تسجيل الدخول | http://localhost:3000/login |
| إنشاء حساب | http://localhost:3000/register |
| لوحة التحكم | http://localhost:3000/dashboard |
| توليد قصة | http://localhost:3000/generate |

## الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# اختبارات المشروع بالكامل
pnpm run build

# فحص الأنماط
pnpm lint
```

## قاعدة البيانات

```bash
# تشغيل الترحيلات
pnpm db:migrate

# فتح Prisma Studio لتصفح البيانات
pnpm db:studio
```

## الخطط والأسعار

| الخطة | السعر | الحد |
|-------|-------|------|
| مجاني | €0 | ٣ قصص/شهر |
| فردي | €4.99/شهر أو €39.99/سنة | غير محدود |
| عائلي | €7.99/شهر | غير محدود + ٣ أطفال |

## واجهة برمجية (API)

| الطريقة | المسار | الحماية | الوصف |
|---------|--------|---------|-------|
| POST | `/api/auth/register` | عام | إنشاء حساب |
| POST | `/api/auth/login` | عام | تسجيل الدخول |
| POST | `/api/auth/refresh` | عام | تجديد الرمز |
| GET | `/api/stories` | عام | جلب القصص |
| GET | `/api/stories/:id` | عام | قصة واحدة |
| POST | `/api/stories/generate` | محمي | توليد قصة جديدة |
| POST | `/api/payments/checkout` | محمي | إنشاء رابط دفع Lemon Squeezy |
| GET | `/api/payments/subscription` | محمي | جلب حالة الاشتراك |
| POST | `/api/payments/cancel` | محمي | طلب إلغاء الاشتراك |
| POST | `/api/payments/webhook` | Lemon Squeezy | أحداث Webhook |

## التقنيات

- **الواجهة:** Next.js 14, Tailwind CSS, TypeScript
- **الخادم:** Node.js, Express, Prisma ORM
- **قاعدة البيانات:** PostgreSQL (Supabase)
- **الذكاء الاصطناعي:** Mistral AI
- **المدفوعات:** Lemon Squeezy
- **الأدوات:** pnpm, Turborepo, ESLint
