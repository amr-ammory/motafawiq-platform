# Cloudflare Worker — دليل النشر خطوة بخطوة

## المتطلبات
- حساب Cloudflare مجاني → https://dash.cloudflare.com/sign-up
- Node.js مثبت على جهازك

---

## الخطوات

### 1. ثبّت Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 2. أنشئ KV Namespace
```bash
npx wrangler kv:namespace create TG_CACHE
```
انسخ الـ `id` اللي يطلع والصقه في `wrangler.toml` محل `REPLACE_WITH_YOUR_KV_NAMESPACE_ID`

### 3. أضف المتغيرات السرية
```bash
npx wrangler secret put BOT_TOKEN
# اكتب توكن البوت تبعك (من @BotFather)

npx wrangler secret put CHANNEL_USERNAME
# اكتب:  @ENGENEERING7
```

### 4. انشر الـ Worker
```bash
npx wrangler deploy
```
يطلع رابط مثل:
`https://motafawiq-tg-proxy.YOUR-SUBDOMAIN.workers.dev`

### 5. حدّث الـ WORKER_URL في main.js
افتح `main.js` وغيّر السطر:
```js
const WORKER_URL = 'https://motafawiq-tg-proxy.YOUR-SUBDOMAIN.workers.dev';
```

---

## اختبر الـ Worker
افتح في المتصفح:
```
https://motafawiq-tg-proxy.YOUR-SUBDOMAIN.workers.dev
```
لازم يطلع:
```json
{ "count": 415, "cached": false }
```

---

## ملاحظات
- الـ Worker مجاني حتى **100,000 طلب/يوم**
- الرقم يتحدث كل **10 دقائق** تلقائياً
- في حالة خطأ يبقى الرقم الأخير المحفوظ ظاهر
