# قصص بلا نهاية 📖✨

تطبيق يولّد قصص نوم للأطفال بالذكاء الاصطناعي — فريدة، لا تتكرر أبداً.

## البدء السريع

```bash
# تثبيت المكتبات
pnpm install

# تشغيل قاعدة البيانات
docker compose -f infra/docker/docker-compose.dev.yml up -d

# تشغيل كل التطبيقات
pnpm dev
```

## الهيكل

- `apps/web`      — Next.js 14 (الموقع)
- `apps/mobile`   — Flutter (iOS + Android)
- `apps/admin`    — لوحة الإدارة
- `services/api`  — Backend API
- `packages/`     — مكتبات مشتركة
