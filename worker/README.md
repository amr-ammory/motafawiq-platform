# Cloudflare Worker — دليل النشر خطوة بخطوة

## المتطلبات
- حساب Cloudflare يملك Worker وKV Namespace المستخدمين في هذا المشروع.
- Node.js مثبت على الجهاز.
- Wrangler إصدار 4.36.0 أو أحدث لدعم إعداد Rate Limiting الحالي.

---

## الخطوات

### 1. ثبّت Wrangler وسجّل الدخول
```bash
npm install -g "wrangler@^4.36.0"
wrangler login
```

### 2. راجع ربط KV
ملف `wrangler.toml` يحتوي بالفعل على معرّف KV Namespace الحالي. إذا كنت تنشر على حساب Cloudflare نفسه، اتركه كما هو. عند استخدام حساب أو مساحة KV جديدة، أنشئ مساحة جديدة ثم حدّث قيمة `id` في الملف:

```bash
npx wrangler kv namespace create TG_CACHE
```

### 3. أضف المتغيرات السرية
```bash
npx wrangler secret put BOT_TOKEN
# أدخل توكن البوت من @BotFather عند الطلب؛ لا تضعه في الملفات.

npx wrangler secret put CHANNEL_USERNAME
# أدخل @ENGENEERING7
```

### 4. انشر الـ Worker
```bash
cd worker
npx wrangler deploy
```

ينبغي أن يبقى عنوان Worker المنشور مطابقاً لـ `WORKER_URL` في `main.js`. إذا تغيّر اسم النطاق، حدّث العنوان هناك أيضاً.

---

## اختبار آمن
افتح عنوان Worker في المتصفح بطلب GET عادي. عند النجاح يعيد JSON من الشكل:

```json
{ "count": 415, "cached": false }
```

قد تظهر `cached: true` عند وجود قيمة حديثة في KV، أو `stale: true` إذا تعذر الوصول إلى Telegram وعُرض آخر عدد معروف من الكاش الاحتياطي. لا ترسل طلبات ضغط أو تختبر نموذج التعليقات ببيانات حقيقية.

---

## السلوك والحماية
- يحتفظ KV بالعدد حديثاً لمدة 10 دقائق، وبنسخة احتياطية لمدة تصل إلى 24 ساعة.
- يقبل Worker طلبات GET وOPTIONS فقط، ويرفض بقية الطرق.
- حد الطلبات مضبوط مبدئياً على 120 طلباً في الدقيقة لكل عنوان IP عبر Cloudflare Rate Limiting API. هذا الحد تقريبي ومحلي لكل موقع Cloudflare، وقد يتأثر بمشاركة عدة زوار لعنوان IP واحد؛ لا يعدّ جداراً عالمياً صارماً.
- مهلة طلب Telegram هي 8 ثوانٍ. لا يعيد Worker تفاصيل الخطأ أو بيانات السر للمتصفح.
