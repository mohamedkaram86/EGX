import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache for live EGX prices
let cachedQuotes: Record<string, { price: number; changePercent: number; changeValue: number; high: number; low: number; volume: number; updatedAt: number }> = {};
let lastFetchTime = 0;

// Major EGX symbols mapping to Yahoo Finance
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

async function fetchLiveQuotes() {
  const now = Date.now();
  // Cache for 60 seconds
  if (now - lastFetchTime < 60000 && Object.keys(cachedQuotes).length > 0) {
    return cachedQuotes;
  }

  const symbols = Object.keys(SYMBOL_MAP);
  const promises = symbols.map(async sym => {
    const yahooSym = SYMBOL_MAP[sym];
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=5d`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const curPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || curPrice;
        const chgVal = +(curPrice - prevClose).toFixed(2);
        const chgPct = prevClose ? +((chgVal / prevClose) * 100).toFixed(2) : 0;
        const high = meta.regularMarketDayHigh || curPrice;
        const low = meta.regularMarketDayLow || curPrice;
        const volume = meta.regularMarketVolume || 0;

        cachedQuotes[sym] = {
          price: curPrice,
          changePercent: chgPct,
          changeValue: chgVal,
          high,
          low,
          volume,
          updatedAt: now
        };
      }
    } catch {
      // Ignore transient failures per symbol
    }
  });

  await Promise.allSettled(promises);
  lastFetchTime = now;
  return cachedQuotes;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API: Get live EGX quotes
  app.get('/api/egx/quotes', async (req, res) => {
    try {
      const quotes = await fetchLiveQuotes();
      res.json({
        success: true,
        updatedAt: new Date(lastFetchTime).toISOString(),
        quotes
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message, quotes: cachedQuotes });
    }
  });

  // API: Historical chart candles for a specific stock
  app.get('/api/egx/chart/:symbol', async (req, res) => {
    const sym = req.params.symbol.toUpperCase();
    const yahooSym = SYMBOL_MAP[sym] || (sym.endsWith('.CA') ? sym : `${sym}.CA`);
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSym)}?interval=1d&range=1y`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!resp.ok) {
        return res.status(404).json({ success: false, message: 'Stock data not found' });
      }
      const data = await resp.json();
      const result = data?.chart?.result?.[0];
      if (!result) {
        return res.status(404).json({ success: false, message: 'No chart data' });
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

      res.json({
        success: true,
        symbol: sym,
        candles
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EGX Charts Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
