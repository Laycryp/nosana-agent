# ---------- Stage 1: builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# انسخ manifest أولاً لاستفادة الكاش
COPY package.json package-lock.json* ./
RUN npm ci

# انسخ السورس وابنِ TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: runner ----------
FROM node:22-alpine AS runner
WORKDIR /app

# تبعيات التشغيل فقط (أصغر حجم)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# انسخ المخرجات الجاهزة للتشغيل
COPY --from=builder /app/dist ./dist

# الإعدادات
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.js"]
