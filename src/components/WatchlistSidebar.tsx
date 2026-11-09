import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Upload,
  Star,
  TrendingUp,
  TrendingDown,
  X,
  FileSpreadsheet,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Candle, StockItem } from '../types/market';
import { parseCSVData } from '../data/egxStocks';

interface WatchlistSidebarProps {
  stocks: StockItem[];
  selectedStockId: string;
  onSelectStock: (stock: StockItem) => void;
  onAddStock: (stock: StockItem) => void;
  onImportCSV: (stock: StockItem, candles: Candle[]) => void;
  onToggleFavorite: (stockId: string) => void;
  onCloseMobile?: () => void;
  language: 'ar' | 'en';
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  stocks,
  selectedStockId,
  onSelectStock,
  onAddStock,
  onImportCSV,
  onToggleFavorite,
  onCloseMobile,
  language
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'indices' | 'stocks' | 'gainers' | 'losers' | 'favorites'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');

  // Extract unique sectors
  const sectors = useMemo(() => {
    return ['all', ...Array.from(new Set(stocks.map(s => s.sector)))];
  }, [stocks]);

  // Add stock dialog state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newRic, setNewRic] = useState('');
  const [newSector, setNewSector] = useState('أسهم عامة');

  // Import CSV dialog state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importSymbol, setImportSymbol] = useState('');
  const [importName, setImportName] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedCandles, setImportedCandles] = useState<Candle[] | null>(null);

  // Filtered & Sorted stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter(stock => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchSym = stock.symbol.toLowerCase().includes(q);
          const matchAr = stock.nameAr.toLowerCase().includes(q);
          const matchEn = stock.nameEn.toLowerCase().includes(q);
          const matchRic = (stock.reutersRic || '').toLowerCase().includes(q);
          if (!matchSym && !matchAr && !matchEn && !matchRic) return false;
        }

        // Sector filter
        if (selectedSector !== 'all' && stock.sector !== selectedSector) {
          return false;
        }

        // Tab category filter
        if (activeTab === 'indices') return !!stock.isIndex;
        if (activeTab === 'stocks') return !stock.isIndex;
        if (activeTab === 'gainers') return stock.changePercent > 0;
        if (activeTab === 'losers') return stock.changePercent < 0;
        if (activeTab === 'favorites') return !!stock.isFavorite;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.currentPrice - a.currentPrice;
        if (sortBy === 'change') return b.changePercent - a.changePercent;
        // Default sort: indices first, then symbol alphabetically
        if (a.isIndex && !b.isIndex) return -1;
        if (!a.isIndex && b.isIndex) return 1;
        return a.symbol.localeCompare(b.symbol);
      });
  }, [stocks, searchQuery, activeTab, selectedSector, sortBy]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newSymbol.trim().toUpperCase();
    const price = parseFloat(newPrice);
    if (!sym || isNaN(price) || price <= 0) return;

    const newStock: StockItem = {
      id: sym,
      symbol: sym,
      nameAr: newName.trim() || sym,
      nameEn: sym,
      currentPrice: price,
      isIndex: false,
      reutersRic: newRic.trim().toUpperCase() || `${sym}.CA`,
      changePercent: 0,
      changeValue: 0,
      high24h: price * 1.02,
      low24h: price * 0.98,
      volume: 100000,
      sector: newSector,
      isCustom: true
    };

    onAddStock(newStock);
    setShowAddModal(false);
    setNewSymbol('');
    setNewName('');
    setNewPrice('');
    setNewRic('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseCSVData(text);
      if (!parsed || parsed.length < 2) {
        setImportStatus('خطأ: لم يتم العثور على الأعمدة المطلوبة (Date, Open, High, Low, Close)');
        setImportedCandles(null);
        return;
      }
      setImportedCandles(parsed);
      setImportStatus(`تم العثور على ${parsed.length} شمعة بنجاح!`);
      if (!importSymbol) {
        const guessedSym = file.name.split('.')[0].toUpperCase().slice(0, 8);
        setImportSymbol(guessedSym);
        setImportName(guessedSym);
      }
    } catch {
      setImportStatus('تعذر قراءة محتوى الملف');
      setImportedCandles(null);
    }
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importedCandles || importedCandles.length === 0) return;
    const sym = (importSymbol.trim() || 'CUSTOM').toUpperCase();
    const lastBar = importedCandles[importedCandles.length - 1];
    const prevBar = importedCandles[importedCandles.length - 2] || lastBar;
    const chgVal = lastBar.c - prevBar.c;
    const chgPct = prevBar.c !== 0 ? (chgVal / prevBar.c) * 100 : 0;

    const importedStock: StockItem = {
      id: sym,
      symbol: sym,
      nameAr: importName.trim() || sym,
      nameEn: sym,
      currentPrice: lastBar.c,
      isIndex: false,
      reutersRic: `${sym}.CA`,
      changePercent: +chgPct.toFixed(2),
      changeValue: +chgVal.toFixed(2),
      high24h: lastBar.h,
      low24h: lastBar.l,
      volume: lastBar.v,
      sector: 'بيانات مستوردة',
      isCustom: true
    };

    onImportCSV(importedStock, importedCandles);
    setShowImportModal(false);
    setImportedCandles(null);
    setImportStatus(null);
  };

  return (
    <aside className="fixed inset-0 z-40 md:relative md:inset-auto w-full md:w-80 h-full border-e border-slate-800 bg-[#0e121a] dark:bg-[#0e121a] flex flex-col shrink-0 select-none overflow-hidden pb-16 md:pb-0">
      {/* Top Header Bar */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-white uppercase tracking-wider">
            {language === 'ar' ? 'قائمة المراقبة — البورصة المصرية' : 'EGX Watchlist'}
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[9px] font-medium border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {language === 'ar' ? 'مباشر' : 'LIVE'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">({filteredStocks.length})</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Add custom stock button */}
          <button
            onClick={() => setShowAddModal(true)}
            title={language === 'ar' ? 'إضافة سهم جديد' : 'Add custom stock'}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Import CSV button */}
          <button
            onClick={() => setShowImportModal(true)}
            title={language === 'ar' ? 'استيراد ملف بيانات CSV' : 'Import CSV Data'}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute top-1/2 -translate-y-1/2 start-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالرمز أو اسم الشركة...' : 'Filter by symbol or name...'}
            className="w-full bg-[#141923] border border-slate-800 rounded-md py-1.5 ps-8 pe-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 text-[11px]">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'indices', labelAr: 'المؤشرات', labelEn: 'Indices' },
            { id: 'stocks', labelAr: 'الأسهم', labelEn: 'Stocks' },
            { id: 'gainers', labelAr: 'الرابحة', labelEn: 'Gainers' },
            { id: 'losers', labelAr: 'الخاسرة', labelEn: 'Losers' },
            { id: 'favorites', labelAr: 'المفضلة', labelEn: 'Favorites' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {language === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Sector Quick Filter Dropdown */}
        <div className="mt-2 flex items-center justify-between gap-1.5 text-[10px]">
          <select
            value={selectedSector}
            onChange={e => setSelectedSector(e.target.value)}
            className="w-full bg-[#141923] border border-slate-800 rounded py-1 px-2 text-slate-300 focus:outline-hidden focus:border-blue-500 font-sans"
          >
            <option value="all">
              {language === 'ar' ? 'جميع قطاعات السوق (الكل)' : 'All EGX Sectors'}
            </option>
            {sectors
              .filter(s => s !== 'all')
              .map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="w-24 shrink-0 bg-[#141923] border border-slate-800 rounded py-1 px-1.5 text-slate-400 focus:outline-hidden font-sans"
          >
            <option value="symbol">{language === 'ar' ? 'الرمز' : 'Symbol'}</option>
            <option value="price">{language === 'ar' ? 'السعر' : 'Price'}</option>
            <option value="change">{language === 'ar' ? 'التغير %' : 'Change %'}</option>
          </select>
        </div>
      </div>

      {/* Stock Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredStocks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {language === 'ar' ? 'لا توجد نتائج مطابقة للبحث' : 'No matching symbols found'}
          </div>
        ) : (
          filteredStocks.map(stock => {
            const isSelected = stock.id === selectedStockId;
            const isUp = stock.changePercent >= 0;
            const isRecentlyTicked = !!(
              stock.lastTick &&
              stock.lastTickTime &&
              Date.now() - stock.lastTickTime < 1300
            );

            return (
              <div
                key={stock.id}
                onClick={() => {
                  onSelectStock(stock);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group flex items-center justify-between p-2.5 cursor-pointer transition-all duration-300 ${
                  isRecentlyTicked
                    ? stock.lastTick === 'up'
                      ? 'bg-emerald-500/20 shadow-inner'
                      : 'bg-rose-500/20 shadow-inner'
                    : isSelected
                    ? 'bg-blue-600/15 border-s-2 border-blue-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                {/* Left: Star + Symbol + Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(stock.id);
                    }}
                    className="text-slate-600 hover:text-amber-400 p-0.5 transition-colors"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        stock.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors tracking-wide">
                        {stock.symbol}
                      </span>
                      {stock.isIndex && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/15 text-purple-400 font-mono">
                          مؤشر
                        </span>
                      )}
                      {stock.isCustom && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-400 font-mono">
                          مخصص
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[140px] font-sans">
                      {language === 'ar' ? stock.nameAr : stock.nameEn}
                    </p>
                  </div>
                </div>

                {/* Right: Price + Change */}
                <div className="text-end font-mono shrink-0">
                  <span
                    className={`block font-semibold text-xs transition-colors duration-300 ${
                      isRecentlyTicked
                        ? stock.lastTick === 'up'
                          ? 'text-emerald-400 font-bold scale-105'
                          : 'text-rose-400 font-bold scale-105'
                        : 'text-slate-100'
                    }`}
                  >
                    {stock.currentPrice.toLocaleString('en-US', {
                      minimumFractionDigits: stock.currentPrice < 2 ? 3 : 2,
                      maximumFractionDigits: stock.currentPrice < 2 ? 3 : 2
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-medium transition-colors ${
                      isUp ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 shrink-0" />
                    )}
                    {isUp ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Custom Stock */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#141923] border border-slate-700 rounded-xl max-w-sm w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {language === 'ar' ? 'إضافة سهم جديد للقائمة' : 'Add Custom Stock'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'رمز السهم (مثل CIEB أو ESRS)' : 'Stock Ticker (e.g. CIEB)'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={newSymbol}
                  onChange={e => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="CIEB"
                  className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="بنك كريدي أجريكول مصر"
                  className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'السعر الحالي (بالجنيه المصري)' : 'Current Price (EGP)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  placeholder="24.15"
                  className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'كود رويترز RIC (اختياري)' : 'Reuters RIC Code (Optional)'}
                </label>
                <input
                  type="text"
                  value={newRic}
                  onChange={e => setNewRic(e.target.value.toUpperCase())}
                  placeholder="CIEB.CA"
                  className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white font-mono focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-500"
                >
                  {language === 'ar' ? '+ إضافة السهم' : 'Add Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import CSV Data */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#141923] border border-slate-700 rounded-xl max-w-md w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  {language === 'ar' ? 'استيراد بيانات تاريخية من ملف CSV' : 'Import CSV Data'}
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-slate-300 space-y-1">
                <p className="font-semibold text-white">
                  {language === 'ar' ? 'صيغة الملف المدعومة:' : 'Supported File Format:'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'ar'
                    ? 'ملف CSV أو TXT يحتوي على أعمدة: Date, Open, High, Low, Close, Volume'
                    : 'CSV or TXT file with columns: Date, Open, High, Low, Close, Volume'}
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {language === 'ar' ? 'اختر ملف CSV من جهازك' : 'Select CSV File'}
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  required
                  onChange={handleFileChange}
                  className="w-full text-slate-300 file:me-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
              </div>

              {importStatus && (
                <div
                  className={`p-2 rounded text-[11px] flex items-center gap-1.5 ${
                    importedCandles
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">
                    {language === 'ar' ? 'رمز السهم' : 'Stock Symbol'}
                  </label>
                  <input
                    type="text"
                    value={importSymbol}
                    onChange={e => setImportSymbol(e.target.value.toUpperCase())}
                    placeholder="MYSTOCK"
                    className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    {language === 'ar' ? 'اسم السهم' : 'Stock Name'}
                  </label>
                  <input
                    type="text"
                    value={importName}
                    onChange={e => setImportName(e.target.value)}
                    placeholder="سهمي المفضل"
                    className="w-full bg-[#0e121a] border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!importedCandles}
                  className="px-3 py-1.5 rounded bg-emerald-600 disabled:opacity-50 text-white font-medium hover:bg-emerald-500"
                >
                  {language === 'ar' ? '📥 تحميل الشارت الآن' : 'Load Chart Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
