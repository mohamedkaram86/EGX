import {
  Search,
  Activity,
  BarChart3,
  BookOpen,
  Sun,
  Moon,
  ExternalLink,
  Layers,
  Sparkles,
  Play,
  Square,
  RotateCw
} from 'lucide-react';
import { StockItem } from '../types/market';

interface HeaderProps {
  currentStock: StockItem;
  onOpenSearch: () => void;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
  showAnalysis: boolean;
  onToggleAnalysis: () => void;
  showOrderBook: boolean;
  onToggleOrderBook: () => void;
  showWatchlist: boolean;
  onToggleWatchlist: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  language: 'ar' | 'en';
  onToggleLanguage: () => void;
  indices: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onRefreshPrices?: () => void;
  isRefreshingPrices?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStock,
  onOpenSearch,
  isLiveSimulating,
  onToggleLiveSimulation,
  showAnalysis,
  onToggleAnalysis,
  showOrderBook,
  onToggleOrderBook,
  showWatchlist,
  onToggleWatchlist,
  isDarkTheme,
  onToggleTheme,
  language,
  onToggleLanguage,
  indices,
  onSelectStock,
  onRefreshPrices,
  isRefreshingPrices
}) => {
  // TradingView direct link helper
  const getTradingViewUrl = () => {
    const symbolMap: Record<string, string> = {
      EGX70: 'EGX70EWI',
      EGX100: 'EGX100EWI',
      EGX30C: 'EGX30CAP'
    };
    const s = symbolMap[currentStock.symbol] || currentStock.symbol;
    return `https://www.tradingview.com/chart/?symbol=EGX:${encodeURIComponent(s)}`;
  };

  const isUp = currentStock.changePercent >= 0;

  return (
    <header className="h-13 md:h-14 border-b border-slate-800 bg-[#0e121a] dark:bg-[#0e121a] text-slate-200 px-2.5 md:px-4 flex items-center justify-between gap-2 md:gap-3 shrink-0 select-none z-20">
      {/* Zone 1: Brand & Logo + Active Stock Quick Trigger */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0">
        <button
          onClick={onToggleWatchlist}
          title={language === 'ar' ? 'تبديل قائمة الأسهم والمراقبة' : 'Toggle Watchlist'}
          className={`p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border transition-colors ${
            showWatchlist
              ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
              : 'border-slate-800 hover:bg-slate-800 text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Brand identity */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-xs text-xs md:text-sm">
            EGX
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-bold text-xs md:text-sm tracking-tight text-white">
                MOHAMED <span className="text-emerald-400">EL AKKAD</span>
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              EGX Charts
            </span>
          </div>
        </div>

        {/* Current Active Symbol Quick Badge (Clickable on Mobile & Desktop to open Search) */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 md:gap-2 px-2 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-start transition-colors"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs md:text-sm text-white tracking-wide font-mono">
                {currentStock.symbol}
              </span>
              <span className="hidden md:inline-block text-[11px] text-slate-400 truncate max-w-[120px]">
                {language === 'ar' ? currentStock.nameAr : currentStock.nameEn}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] md:text-xs">
              <span className="font-semibold text-white">
                {currentStock.currentPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <span
                className={`font-semibold ${
                  isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUp ? '+' : ''}
                {currentStock.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation & Quick Search Bar */}
      <div className="hidden sm:flex items-center gap-2 max-w-md w-full justify-center">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full max-w-[260px] px-3 py-1.5 text-xs bg-slate-900/90 hover:bg-slate-800/90 text-slate-400 border border-slate-700/60 rounded-lg transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">
              {language === 'ar' ? 'بحث (COMI, TMGH)...' : 'Search (COMI, TMGH)...'}
            </span>
          </div>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Major EGX Indices Strip (Desktop) */}
        <div className="hidden xl:flex items-center gap-1.5">
          {indices.slice(0, 3).map(idx => {
            const up = idx.changePercent >= 0;
            return (
              <button
                key={idx.id}
                onClick={() => onSelectStock(idx)}
                className={`px-2 py-0.5 text-[11px] rounded border transition-all ${
                  currentStock.id === idx.id
                    ? 'bg-blue-600/20 border-blue-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1 font-mono">
                  <span className="font-semibold">{idx.symbol}</span>
                  <span className={up ? 'text-emerald-400' : 'text-rose-400'}>
                    {up ? '+' : ''}
                    {idx.changePercent.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          title={language === 'ar' ? 'بحث' : 'Search'}
        >
          <Search className="w-4 h-4 text-blue-400" />
        </button>

        {/* Live Prices Sync Button */}
        {onRefreshPrices && (
          <button
            onClick={onRefreshPrices}
            disabled={isRefreshingPrices}
            className="flex items-center gap-1.5 px-2 md:px-2.5 py-1.5 min-h-[38px] text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all whitespace-nowrap"
            title={language === 'ar' ? 'تحديث أسعار البورصة اللحظية' : 'Refresh live market quotes'}
          >
            <RotateCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshingPrices ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{language === 'ar' ? 'تحديث الأسعار' : 'Refresh'}</span>
          </button>
        )}

        {/* Live Simulator Toggle */}
        <button
          onClick={onToggleLiveSimulation}
          className={`flex items-center gap-1.5 px-2 md:px-2.5 py-1.5 min-h-[38px] text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
            isLiveSimulating
              ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
              : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300'
          }`}
          title={
            language === 'ar'
              ? 'محاكاة حركة الأسعار في الجلسة الحية'
              : 'Live market tick simulator'
          }
        >
          {isLiveSimulating ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="hidden sm:inline">{language === 'ar' ? 'جلسة حية' : 'Live Active'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
              <span className="hidden sm:inline">{language === 'ar' ? 'تحديث مباشر' : 'Live Sim'}</span>
            </>
          )}
        </button>

        {/* Technical Analysis Panel Toggle (Desktop only; on mobile it's in bottom bar) */}
        <button
          onClick={onToggleAnalysis}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${
            showAnalysis
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'التحليل الفني' : 'Analysis'}</span>
        </button>

        {/* Order Book / Depth Toggle */}
        <button
          onClick={onToggleOrderBook}
          className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${
            showOrderBook
              ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
              : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'عمق السوق' : 'Order Book'}</span>
        </button>

        {/* TradingView Direct Link */}
        <a
          href={getTradingViewUrl()}
          target="_blank"
          rel="noopener noreferrer"
          title="عرض في TradingView"
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors whitespace-nowrap"
        >
          <span>TradingView</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDarkTheme ? 'الوضع النهاري' : 'الوضع الليلي'}
          className="p-1.5 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
        >
          {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Language Toggle */}
        <button
          onClick={onToggleLanguage}
          title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          className="px-2 py-1 text-xs font-medium rounded-md border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors font-mono"
        >
          {language === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
    </header>
  );
};
