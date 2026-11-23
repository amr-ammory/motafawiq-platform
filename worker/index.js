/**
 * Cloudflare Worker — Telegram Subscriber Proxy
 * Public GET endpoint for the official Telegram channel subscriber count.
 */

const FRESH_CACHE_TTL_SECONDS = 600;
const STALE_CACHE_TTL_SECONDS = 86400;
const TELEGRAM_TIMEOUT_MS = 8000;
let pendingSubscriberLookup = null;

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(),
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405, {
        Allow: 'GET, OPTIONS'
      });
    }

    const rateLimiter = env.SUBSCRIBER_RATE_LIMITER;
    if (rateLimiter && typeof rateLimiter.limit === 'function') {
      try {
        const key = request.headers.get('cf-connecting-ip') || 'unknown';
        const decision = await rateLimiter.limit({ key });
        if (!decision?.success) {
          return jsonResponse({ error: 'Too many requests' }, 429, {
            'Retry-After': '60'
          });
        }
      } catch {
        console.error('[worker] Rate-limit check failed');
        return jsonResponse({ error: 'Service temporarily unavailable' }, 503);
      }
    }

    try {
      return jsonResponse(await getSubscriberCount(env));
    } catch {
      console.error('[worker] Subscriber count request failed');
      return jsonResponse({ error: 'Unable to retrieve subscriber count' }, 502);
    }
  }
};

function getSubscriberCount(env) {
  if (pendingSubscriberLookup) return pendingSubscriberLookup;
  pendingSubscriberLookup = loadSubscriberCount(env).finally(() => {
    pendingSubscriberLookup = null;
  });
  return pendingSubscriberLookup;
}

async function loadSubscriberCount(env) {
  const cache = env.TG_CACHE;

  if (cache) {
    try {
      const freshCount = parseCount(await cache.get('subscriber_count'));
      if (freshCount !== null) return { count: freshCount, cached: true };
    } catch {
      console.warn('[worker] KV cache read failed');
    }
  }

  try {
    const count = await fetchTelegramCount(env.BOT_TOKEN, env.CHANNEL_USERNAME);
    if (cache) {
      try {
        await Promise.all([
          cache.put('subscriber_count', String(count), {
            expirationTtl: FRESH_CACHE_TTL_SECONDS
          }),
          cache.put('subscriber_count_stale', String(count), {
            expirationTtl: STALE_CACHE_TTL_SECONDS
          })
        ]);
      } catch {
        console.warn('[worker] KV cache write failed');
      }
    }
    return { count, cached: false };
  } catch {
    if (cache) {
      try {
        const staleCount = parseCount(await cache.get('subscriber_count_stale'));
        if (staleCount !== null) {
          return { count: staleCount, cached: true, stale: true };
        }
      } catch {
        console.warn('[worker] Stale KV cache read failed');
      }
    }
    throw new Error('Subscriber count unavailable');
  }
}

async function fetchTelegramCount(botToken, channel) {
  if (typeof botToken !== 'string' || !botToken.trim()) {
    throw new Error('Worker configuration unavailable');
  }

  const chatId = typeof channel === 'string' ? channel.trim() : '';
  if (!/^@[A-Za-z0-9_]{5,32}$/.test(chatId) && !/^-?\d{1,20}$/.test(chatId)) {
    throw new Error('Worker configuration unavailable');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);
  try {
    const telegramUrl = new URL(`https://api.telegram.org/bot${botToken}/getChatMembersCount`);
    telegramUrl.searchParams.set('chat_id', chatId);

    const response = await fetch(telegramUrl.toString(), {
      method: 'GET',
      signal: controller.signal
    });
    if (!response.ok) throw new Error('Telegram API request failed');

    const payload = await response.json();
    const count = parseCount(payload?.result);
    if (payload?.ok !== true || count === null) {
      throw new Error('Telegram API response invalid');
    }
    return count;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseCount(value) {
  const count = Number(value);
  return Number.isSafeInteger(count) && count > 0 ? count : null;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff'
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(),
      ...extraHeaders
    }
  });
}
