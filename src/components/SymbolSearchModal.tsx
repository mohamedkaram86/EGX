import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockItem } from '../types/market';

interface SymbolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  language: 'ar' | 'en';
}

export const SymbolSearchModal: React.FC<SymbolSearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
  language
}) => {
  const [query, setQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Extract unique sectors
  const sectors = ['all', ...Array.from(new Set(stocks.map(s => s.sector)))];

  const filtered = stocks.filter(s => {
    if (selectedSector !== 'all' && s.sector !== selectedSector) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.symbol.toLowerCase().includes(q) ||
      s.nameAr.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      (s.reutersRic || '').toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation (Arrow Up, Arrow Down, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < filtered.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectStock(filtered[selectedIndex]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-start justify-center p-4 pt-16 z-50 select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#141923] border border-slate-700/80 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              language === 'ar'
                ? 'ابحث عن أي سهم أو مؤشر في البورصة المصرية بالرمز أو الاسم...'
                : 'Search any EGX stock or index by symbol or name...'
            }
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-hidden font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sector Quick Filter Pills */}
        <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedSector === sec
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {sec === 'all' ? (language === 'ar' ? 'جميع القطاعات' : 'All Sectors') : sec}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              {language === 'ar' ? 'لم يتم العثور على سهم مطابق' : 'No matching symbols found'}
            </div>
          ) : (
            filtered.map((stock, i) => {
              const isSelected = i === selectedIndex;
              const isUp = stock.changePercent >= 0;

              return (
                <div
                  key={stock.id}
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-600/20 text-white' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center font-bold font-mono text-xs text-white shrink-0">
                      {stock.symbol.slice(0, 4)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white tracking-wide">
                          {stock.symbol}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-sans">
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-xs font-sans mt-0.5">
                        {language === 'ar' ? stock.nameAr : stock.nameEn}
                        {stock.reutersRic && (
                          <span className="ms-2 font-mono text-[10px] text-slate-500">
                            {stock.reutersRic}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-end font-mono shrink-0">
                    <span className="block font-bold text-sm text-white">
                      {stock.currentPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-medium ${
                        isUp ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isUp ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Keyboard Shortcut Guide */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">↑↓</kbd>{' '}
              {language === 'ar' ? 'للتنقل' : 'Navigate'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">Enter</kbd>{' '}
              {language === 'ar' ? 'للاختيار' : 'Select'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-mono">Esc</kbd>{' '}
              {language === 'ar' ? 'للإغلاق' : 'Close'}
            </span>
          </div>
          <span className="text-slate-400 font-mono">EGX Real-time Engine</span>
        </div>
      </div>
    </div>
  );
};
