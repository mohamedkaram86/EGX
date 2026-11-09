// Cloudflare Pages Function for /api/egx/quotes

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
  MFPC: 'MFPC.CA',
  CIEB: 'CIEB.CA',
  ADIB: 'ADIB.CA',
  EKHO: 'EKHO.CA',
  AMOC: 'AMOC.CA',
  ESRS: 'ESRS.CA',
  SKPC: 'SKPC.CA',
  ISPH: 'ISPH.CA',
  HELI: 'HELI.CA',
  MASR: 'MASR.CA',
  JUFO: 'JUFO.CA',
  DOMT: 'DOMT.CA',
  OCDI: 'OCDI.CA',
  BTFH: 'BTFH.CA',
  CCAP: 'CCAP.CA',
  GBCO: 'GBCO.CA',
  CNFN: 'CNFN.CA'
};

export async function onRequestGet() {
  const symbols = Object.keys(SYMBOL_MAP);
  const quotes: Record<string, any> = {};
  const now = Date.now();

  const promises = symbols.map(async sym => {
    const yahooSym = SYMBOL_MAP[sym];
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=5d`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!resp.ok) return;
      const data: any = await resp.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const curPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || curPrice;
        const chgVal = +(curPrice - prevClose).toFixed(2);
        const chgPct = prevClose ? +((chgVal / prevClose) * 100).toFixed(2) : 0;

        quotes[sym] = {
          price: curPrice,
          changePercent: chgPct,
          changeValue: chgVal,
          high: meta.regularMarketDayHigh || curPrice,
          low: meta.regularMarketDayLow || curPrice,
          volume: meta.regularMarketVolume || 0,
          updatedAt: now
        };
      }
    } catch {
      // Ignore
    }
  });

  await Promise.allSettled(promises);

  return new Response(
    JSON.stringify({
      success: true,
      updatedAt: new Date(now).toISOString(),
      quotes
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=30'
      }
    }
  );
}
