/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ChartDrawing,
  ChartType,
  DrawingTool,
  IndicatorConfig,
  StockItem,
  Timeframe,
  Candle
} from './types/market';
import {
  INITIAL_EGX_STOCKS,
  aggregateCandles,
  calculateHeikinAshi,
  generateCandlesForStock
} from './data/egxStocks';
import { generateTechnicalAnalysis } from './utils/indicators';
import { Header } from './components/Header';
import { ChartToolbar } from './components/ChartToolbar';
import { ChartCanvas } from './components/ChartCanvas';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { TechnicalAnalysisPanel } from './components/TechnicalAnalysisPanel';
import { OrderBookPanel } from './components/OrderBookPanel';
import { SymbolSearchModal } from './components/SymbolSearchModal';
import { MobileBottomNav, MobileTab } from './components/MobileBottomNav';
import { BarChart3 } from 'lucide-react';

export default function App() {
  // 1. Stocks State: merge initial stocks with any persisted user favorites or custom stocks
  const [stocks, setStocks] = useState<StockItem[]>(() => {
    try {
      localStorage.removeItem('egx_stocks_v1');
      localStorage.removeItem('egx_stocks_v2');
      localStorage.removeItem('egx_stocks_v3');
      localStorage.removeItem('egx_stocks_v4');

      const savedStr = localStorage.getItem('egx_stocks_v5');
      if (savedStr) {
        const savedList: StockItem[] = JSON.parse(savedStr);
        // Safety check: if old COMI was saved with outdated 128 price, auto-purge
        const comi = savedList.find(s => s.id === 'COMI');
        if (comi && comi.currentPrice > 100) {
          localStorage.removeItem('egx_stocks_v5');
          return INITIAL_EGX_STOCKS;
        }

        const savedMap = new Map(savedList.map(s => [s.id, s]));
        const merged = INITIAL_EGX_STOCKS.map(initStock => {
          const found = savedMap.get(initStock.id);
          return found ? { ...initStock, isFavorite: found.isFavorite } : initStock;
        });
        const customStocks = savedList.filter(s => s.isCustom && !INITIAL_EGX_STOCKS.some(i => i.id === s.id));
        return [...merged, ...customStocks];
      }
    } catch {}
    return INITIAL_EGX_STOCKS;
  });

  const [currentStockId, setCurrentStockId] = useState<string>('COMI');

  // 2. Cache of base daily candles per stock
  const [dailyCandlesMap, setDailyCandlesMap] = useState<Record<string, Candle[]>>({});

  // 3. View Settings
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');

  // 4. Indicator Configs
  const [indicators, setIndicators] = useState<IndicatorConfig>({
    ma20: true,
    ma50: true,
    ema200: false,
    bollinger: false,
    volume: true,
    rsi: true,
    macd: false,
    pivotPoints: false,
    fibonacci: false
  });

  // 5. Drawing Tools
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingTool>('cursor');
  const [drawingsMap, setDrawingsMap] = useState<Record<string, ChartDrawing[]>>({});

  // 6. UI Toggles & Mobile Navigation Tab
  const [showWatchlist, setShowWatchlist] = useState<boolean>(true);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(true);
  const [showOrderBook, setShowOrderBook] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [mobileTab, setMobileTab] = useState<MobileTab>('chart');

  // Sync dark class on html document
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkTheme]);

  // Sync RTL / LTR document direction
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persist stocks updates (favorites / custom additions)
  useEffect(() => {
    try {
      localStorage.setItem('egx_stocks_v5', JSON.stringify(stocks));
    } catch {}
  }, [stocks]);

  // Fetch live market quotes from server API on mount and periodically
  useEffect(() => {
    const fetchLiveQuotes = async () => {
      try {
        const res = await fetch('/api/egx/quotes');
        const data = await res.json();
        if (data.success && data.quotes) {
          setStocks(prev => prev.map(s => {
            const live = data.quotes[s.symbol];
            if (live) {
              return {
                ...s,
                currentPrice: live.price,
                changePercent: live.changePercent,
                changeValue: live.changeValue,
                high24h: live.high || s.high24h,
                low24h: live.low || s.low24h,
                volume: live.volume || s.volume,
                dateStr: new Date(live.updatedAt).toISOString().split('T')[0]
              };
            }
            return s;
          }));
        }
      } catch {}
    };

    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 60000);
    return () => clearInterval(interval);
  }, []);

  // Ensure current stock exists
  const currentStock = useMemo(() => {
    return stocks.find(s => s.id === currentStockId) || stocks[0];
  }, [stocks, currentStockId]);

  // Ensure daily candles exist for current stock (try live server first, fallback to generated)
  useEffect(() => {
    if (!dailyCandlesMap[currentStock.id]) {
      const generated = generateCandlesForStock(currentStock, 600);
      setDailyCandlesMap(prev => ({ ...prev, [currentStock.id]: generated }));

      // Fetch real historical candles from API if available
      fetch(`/api/egx/chart/${encodeURIComponent(currentStock.symbol)}`)
        .then(r => r.json())
        .then(res => {
          if (res.success && Array.isArray(res.candles) && res.candles.length >= 10) {
            setDailyCandlesMap(prev => ({ ...prev, [currentStock.id]: res.candles }));
          }
        })
        .catch(() => {});
    }
  }, [currentStock, dailyCandlesMap]);

  // Process candles for active timeframe and chart type
  const baseCandles = dailyCandlesMap[currentStock.id] || [];
  const aggregatedCandles = useMemo(() => {
    if (baseCandles.length === 0) return [];
    return aggregateCandles(baseCandles, timeframe);
  }, [baseCandles, timeframe]);

  const activeCandles = useMemo(() => {
    if (chartType === 'heikin-ashi') {
      return calculateHeikinAshi(aggregatedCandles);
    }
    return aggregatedCandles;
  }, [aggregatedCandles, chartType]);

  // Technical Summary
  const technicalSummary = useMemo(() => {
    return generateTechnicalAnalysis(aggregatedCandles, currentStock.symbol);
  }, [aggregatedCandles, currentStock.symbol]);

  // Indices subset for quick header chips
  const indices = useMemo(() => {
    return stocks.filter(s => s.isIndex);
  }, [stocks]);

  // Live Simulation Interval (Realistic tick-by-tick order updates)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setDailyCandlesMap(prevMap => {
        const currentSeries = prevMap[currentStock.id];
        if (!currentSeries || currentSeries.length === 0) return prevMap;

        const updated = [...currentSeries];
        const last = { ...updated[updated.length - 1] };

        // Small realistic tick delta (-0.2% to +0.2%)
        const deltaPct = (Math.random() - 0.49) * 0.0035;
        const newPrice = +(last.c * (1 + deltaPct)).toFixed(2);
        last.c = newPrice;
        last.h = +Math.max(last.h, newPrice).toFixed(2);
        last.l = +Math.min(last.l, newPrice).toFixed(2);
        last.v += Math.round(5000 + Math.random() * 25000);

        updated[updated.length - 1] = last;

        // Also update stock's current price in stocks list
        setStocks(prevStocks =>
          prevStocks.map(s => {
            if (s.id !== currentStock.id) return s;
            const prevClose = updated.length >= 2 ? updated[updated.length - 2].c : newPrice;
            const chgVal = +(newPrice - prevClose).toFixed(2);
            const chgPct = +((chgVal / prevClose) * 100).toFixed(2);
            return {
              ...s,
              currentPrice: newPrice,
              changeValue: chgVal,
              changePercent: chgPct,
              high24h: Math.max(s.high24h, newPrice),
              low24h: Math.min(s.low24h, newPrice),
              volume: s.volume + Math.round(1000 + Math.random() * 5000)
            };
          })
        );

        return { ...prevMap, [currentStock.id]: updated };
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [isLiveSimulating, currentStock.id]);

  // Keyboard shortcut listener (Cmd/Ctrl + K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleIndicator = (key: keyof IndicatorConfig) => {
    setIndicators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddStock = (newStock: StockItem) => {
    setStocks(prev => [newStock, ...prev]);
    const candles = generateCandlesForStock(newStock, 600);
    setDailyCandlesMap(prev => ({ ...prev, [newStock.id]: candles }));
    setCurrentStockId(newStock.id);
  };

  const handleImportCSV = (importedStock: StockItem, candles: Candle[]) => {
    setStocks(prev => [importedStock, ...prev.filter(s => s.id !== importedStock.id)]);
    setDailyCandlesMap(prev => ({ ...prev, [importedStock.id]: candles }));
    setCurrentStockId(importedStock.id);
  };

  const handleToggleFavorite = (stockId: string) => {
    setStocks(prev =>
      prev.map(s => (s.id === stockId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleAddDrawing = (drawing: ChartDrawing) => {
    setDrawingsMap(prev => ({
      ...prev,
      [currentStock.id]: [...(prev[currentStock.id] || []), drawing]
    }));
    // Return to cursor after completed drawing
    setActiveDrawingTool('cursor');
  };

  const handleClearDrawings = () => {
    setDrawingsMap(prev => ({ ...prev, [currentStock.id]: [] }));
  };

  // Export Screenshot
  const handleExportImage = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `EGX_${currentStock.symbol}_${timeframe}_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Export Historical CSV
  const handleExportCSV = () => {
    if (activeCandles.length === 0) return;
    let csv = 'Date,Open,High,Low,Close,Volume\n';
    activeCandles.forEach(b => {
      const d = new Date(b.t).toISOString().slice(0, 10);
      csv += `${d},${b.o},${b.h},${b.l},${b.c},${b.v}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `EGX_${currentStock.symbol}_${timeframe}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentDrawings = drawingsMap[currentStock.id] || [];

  const handleSelectStock = (stock: StockItem) => {
    setCurrentStockId(stock.id);
    setMobileTab('chart');
  };

  const handleMobileTabChange = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'analysis') {
      setShowAnalysis(true);
      setTimeout(() => {
        const el = document.getElementById('technical-analysis-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else if (tab === 'chart') {
      const mainEl = document.getElementById('chart-main-scroll');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  const handleRefreshPrices = async () => {
    setIsRefreshingPrices(true);
    try {
      const res = await fetch('/api/egx/quotes');
      const data = await res.json();
      if (data.success && data.quotes) {
        setStocks(prev => prev.map(s => {
          const live = data.quotes[s.symbol];
          if (live) {
            return {
              ...s,
              currentPrice: live.price,
              changePercent: live.changePercent,
              changeValue: live.changeValue,
              high24h: live.high || s.high24h,
              low24h: live.low || s.low24h,
              volume: live.volume || s.volume,
              dateStr: new Date(live.updatedAt).toISOString().split('T')[0]
            };
          }
          return s;
        }));
      }
    } catch {}
    finally {
      setTimeout(() => setIsRefreshingPrices(false), 600);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0e14] dark:bg-[#0b0e14] text-slate-200 antialiased font-sans">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        currentStock={currentStock}
        onOpenSearch={() => setIsSearchOpen(true)}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(prev => !prev)}
        showAnalysis={showAnalysis}
        onToggleAnalysis={() => setShowAnalysis(prev => !prev)}
        showOrderBook={showOrderBook}
        onToggleOrderBook={() => setShowOrderBook(prev => !prev)}
        showWatchlist={showWatchlist}
        onToggleWatchlist={() => {
          setShowWatchlist(prev => !prev);
          setMobileTab(prev => (prev === 'watchlist' ? 'chart' : 'watchlist'));
        }}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(prev => !prev)}
        language={language}
        onToggleLanguage={() => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'))}
        indices={indices}
        onSelectStock={handleSelectStock}
        onRefreshPrices={handleRefreshPrices}
        isRefreshingPrices={isRefreshingPrices}
      />

      {/* 2. Main Workstation Area */}
      <div className="flex-1 flex overflow-hidden relative pb-14 md:pb-0">
        {/* Left Watchlist Sidebar (Desktop: side panel | Mobile: full drawer when mobileTab === 'watchlist') */}
        {(showWatchlist || mobileTab === 'watchlist') && (
          <div className={mobileTab === 'watchlist' ? 'block' : 'hidden md:block'}>
            <WatchlistSidebar
              stocks={stocks}
              selectedStockId={currentStock.id}
              onSelectStock={handleSelectStock}
              onAddStock={handleAddStock}
              onImportCSV={handleImportCSV}
              onToggleFavorite={handleToggleFavorite}
              onCloseMobile={() => setMobileTab('chart')}
              language={language}
            />
          </div>
        )}

        {/* Center: Chart Workspace */}
        <main
          id="chart-main-scroll"
          className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto md:overflow-hidden bg-[#0e121a] relative"
        >
          {/* Chart Controls Toolbar */}
          <ChartToolbar
            timeframe={timeframe}
            onChangeTimeframe={setTimeframe}
            chartType={chartType}
            onChangeChartType={setChartType}
            indicators={indicators}
            onToggleIndicator={handleToggleIndicator}
            activeDrawingTool={activeDrawingTool}
            onSelectDrawingTool={setActiveDrawingTool}
            onClearDrawings={handleClearDrawings}
            onExportImage={handleExportImage}
            onExportCSV={handleExportCSV}
            language={language}
          />

          {/* Interactive Chart Canvas Viewport */}
          <div className="h-[52vh] sm:h-[58vh] md:h-auto md:flex-1 relative overflow-hidden bg-[#0e121a] shrink-0 md:shrink">
            <ChartCanvas
              candles={activeCandles}
              stock={currentStock}
              chartType={chartType}
              indicators={indicators}
              activeDrawingTool={activeDrawingTool}
              drawings={currentDrawings}
              onAddDrawing={handleAddDrawing}
              isDarkTheme={isDarkTheme}
            />
          </div>

          {/* Bottom Technical Analysis Panel (Directly Under the Chart) */}
          {showAnalysis ? (
            <div id="technical-analysis-section" className="shrink-0 w-full border-t border-slate-800">
              <TechnicalAnalysisPanel
                summary={technicalSummary}
                stock={currentStock}
                timeframeLabel={timeframe}
                onClose={() => setShowAnalysis(false)}
                language={language}
              />
            </div>
          ) : (
            <div className="shrink-0 p-2.5 bg-[#0e121a] border-t border-slate-800 flex items-center justify-center">
              <button
                onClick={() => setShowAnalysis(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-md transition-all font-medium"
              >
                <BarChart3 className="w-4 h-4" />
                <span>
                  {language === 'ar'
                    ? 'عرض التحليل الفني ومستويات الدعم والمقاومة تحت الشارت'
                    : 'Show Technical Analysis & Pivots under chart'}
                </span>
              </button>
            </div>
          )}
        </main>

        {/* Right Depth of Market / Order Book Panel */}
        {(showOrderBook || mobileTab === 'orderbook') && (
          <div className={mobileTab === 'orderbook' ? 'block' : 'hidden md:block'}>
            <OrderBookPanel
              stock={currentStock}
              onClose={() => {
                setShowOrderBook(false);
                setMobileTab('chart');
              }}
              language={language}
            />
          </div>
        )}
      </div>

      {/* 3. Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onChangeTab={handleMobileTabChange}
        onOpenSearch={() => setIsSearchOpen(true)}
        language={language}
      />

      {/* 4. Symbol Search Spotlight Modal */}
      <SymbolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        onSelectStock={handleSelectStock}
        language={language}
      />
    </div>
  );
}
