/**
 * Cloudflare Worker — Telegram Subscriber Proxy
 * يجيب عدد المشتركين من تلغرام ويرجعه بـ JSON مع CORS headers
 * يحفظ الرقم بـ KV Cache لمدة 10 دقائق لتقليل الطلبات
 */

export default {
  async fetch(request, env) {

    // ====== CORS preflight ======
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders()
      });
    }

    try {
      // ====== تحقق من الـ Cache أولاً (KV) ======
      const cached = await env.TG_CACHE.get('subscriber_count');
      if (cached) {
        return jsonResponse({ count: parseInt(cached), cached: true });
      }

      // ====== اجلب من Telegram API ======
      const BOT_TOKEN = env.BOT_TOKEN;          // متغير بيئة سري
      const CHANNEL   = env.CHANNEL_USERNAME;   // مثال: @ENGENEERING7

      const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMembersCount?chat_id=${CHANNEL}`;
      const tgRes  = await fetch(tgUrl);
      const tgData = await tgRes.json();

      if (!tgData.ok) {
        throw new Error(`Telegram error: ${tgData.description}`);
      }

      const count = tgData.result;

      // ====== احفظ بالـ KV لمدة 10 دقائق (600 ثانية) ======
      await env.TG_CACHE.put('subscriber_count', String(count), {
        expirationTtl: 600
      });

      return jsonResponse({ count, cached: false });

    } catch (err) {
      // في حالة خطأ → رجّع 0 بدل ما يكسر الصفحة
      return jsonResponse({ count: 0, error: err.message }, 500);
    }
  }
};

/* ====== Helpers ====== */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}
