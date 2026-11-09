// Cloudflare Pages Function for /api/egx/chart/[symbol]

const SYMBOL_MAP: Record<string, string> = {
  EGX30: '^CASE30',
  COMI: 'COMI.CA',
  TMGH: 'TMGH.CA',
  HRHO: 'HRHO.CA',
  EAST: 'EAST.CA',
  SWDY: 'SWDY.CA',
  ETEL: 'ETEL.CA',
  ABUK: 'ABUK.CA',
  FWRY: 'FWRY.CA',
  ORWE: 'ORWE.CA',
  PHDC: 'PHDC.CA',
  EFIH: 'EFIH.CA',
  ALCN: 'ALCN.CA',
  EGAL: 'EGAL.CA',
  ORAS: 'ORAS.CA',
  MFPC: 'MFPC.CA'
};

export async function onRequestGet(context: any) {
  const sym = String(context.params.symbol || '').toUpperCase();
  const yahooSym = SYMBOL_MAP[sym] || (sym.endsWith('.CA') ? sym : `${sym}.CA`);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=1y`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ success: false, message: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data: any = await resp.json();
    const result = data?.chart?.result?.[0];
    if (!result) {
      return new Response(JSON.stringify({ success: false, message: 'No data' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const timestamps = result.timestamp || [];
    const quote = result.indicators?.quote?.[0] || {};
    const opens = quote.open || [];
    const highs = quote.high || [];
    const lows = quote.low || [];
    const closes = quote.close || [];
    const volumes = quote.volume || [];

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] !== null && closes[i] !== undefined) {
        candles.push({
          t: timestamps[i] * 1000,
          o: +(opens[i] || closes[i]).toFixed(2),
          h: +(highs[i] || closes[i]).toFixed(2),
          l: +(lows[i] || closes[i]).toFixed(2),
          c: +closes[i].toFixed(2),
          v: Math.round(volumes[i] || 0)
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        symbol: sym,
        candles
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=180, s-maxage=180'
        }
      }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
