import React, { useState, useEffect } from 'react';
import { X, BookOpen, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockItem, TradeTick } from '../types/market';
import { generateOrderBook } from '../data/egxStocks';

interface OrderBookPanelProps {
  stock: StockItem;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const OrderBookPanel: React.FC<OrderBookPanelProps> = ({
  stock,
  onClose,
  language
}) => {
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(stock.currentPrice, stock.isIndex));
  const [recentTrades, setRecentTrades] = useState<TradeTick[]>([]);

  // Regenerate simulated order book when stock changes
  useEffect(() => {
    setOrderBook(generateOrderBook(stock.currentPrice, stock.isIndex));

    // Initial trades
    const initialTrades: TradeTick[] = [];
    const now = new Date();
    for (let i = 0; i < 8; i++) {
      const timeStr = new Date(now.getTime() - (8 - i) * 15000).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const isBuy = Math.random() > 0.45;
      const priceOffset = (Math.random() - 0.5) * (stock.currentPrice * 0.004);
      initialTrades.push({
        id: 't-' + i,
        time: timeStr,
        price: +(stock.currentPrice + priceOffset).toFixed(2),
        volume: Math.round(500 + Math.random() * 8500),
        side: isBuy ? 'buy' : 'sell'
      });
    }
    setRecentTrades(initialTrades.reverse());
  }, [stock]);

  const maxBidVol = Math.max(...orderBook.bids.map(b => b.volume), 1);
  const maxAskVol = Math.max(...orderBook.asks.map(a => a.volume), 1);

  return (
    <div className="fixed inset-0 z-40 md:relative md:inset-auto w-full md:w-80 h-full border-s border-slate-800 bg-[#0e121a] flex flex-col shrink-0 select-none overflow-hidden text-xs pb-16 md:pb-0">
      {/* Top Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-xs text-white">
            {language === 'ar' ? `عمق السوق — ${stock.symbol}` : `Order Book — ${stock.symbol}`}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Bid / Ask Ratio Strip */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 shrink-0 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-emerald-400 font-semibold">
            {language === 'ar' ? 'طلبات الشراء' : 'Bids'} {orderBook.bidRatio}%
          </span>
          <span className="text-slate-400 text-[10px]">
            {language === 'ar' ? 'الفارق:' : 'Spread:'} {orderBook.spread.toFixed(2)}
          </span>
          <span className="text-rose-400 font-semibold">
            {language === 'ar' ? 'عروض البيع' : 'Asks'} {100 - orderBook.bidRatio}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-slate-800">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${orderBook.bidRatio}%` }}
          />
          <div
            className="bg-rose-500 transition-all duration-500"
            style={{ width: `${100 - orderBook.bidRatio}%` }}
          />
        </div>
      </div>

      {/* Order Book Grid (Bids vs Asks) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono">
        {/* Asks (Sell Orders) */}
        <div>
          <div className="text-[10px] text-slate-400 font-sans mb-1 px-1 flex justify-between">
            <span>{language === 'ar' ? 'عروض البيع (Asks)' : 'Asks'}</span>
            <span>{language === 'ar' ? 'الكمية' : 'Volume'}</span>
          </div>
          <div className="space-y-0.5">
            {orderBook.asks.map((ask, i) => {
              const depthPct = Math.min(100, Math.round((ask.volume / maxAskVol) * 100));
              return (
                <div
                  key={i}
                  className="relative flex items-center justify-between px-2 py-1 rounded overflow-hidden text-[11px] hover:bg-slate-900"
                >
                  <div
                    className="absolute inset-y-0 end-0 bg-rose-500/15 pointer-events-none transition-all"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-rose-400 font-semibold relative z-10">
                    {ask.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2 relative z-10 text-slate-300">
                    <span>{ask.volume.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500">({ask.orders})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mid-Market Price Indicator */}
        <div className="py-1.5 px-3 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-sans">{language === 'ar' ? 'السعر الحالي:' : 'Last Price:'}</span>
          <span className="font-bold text-white text-sm">
            {stock.currentPrice.toFixed(2)}{' '}
            <span className="text-[10px] text-slate-400 font-normal">
              {stock.isIndex ? 'نقطة' : 'ج.م'}
            </span>
          </span>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          <div className="text-[10px] text-slate-400 font-sans mb-1 px-1 flex justify-between">
            <span>{language === 'ar' ? 'طلبات الشراء (Bids)' : 'Bids'}</span>
            <span>{language === 'ar' ? 'الكمية' : 'Volume'}</span>
          </div>
          <div className="space-y-0.5">
            {orderBook.bids.map((bid, i) => {
              const depthPct = Math.min(100, Math.round((bid.volume / maxBidVol) * 100));
              return (
                <div
                  key={i}
                  className="relative flex items-center justify-between px-2 py-1 rounded overflow-hidden text-[11px] hover:bg-slate-900"
                >
                  <div
                    className="absolute inset-y-0 end-0 bg-emerald-500/15 pointer-events-none transition-all"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-emerald-400 font-semibold relative z-10">
                    {bid.price.toFixed(2)}
                  </span>
                  <div className="flex items-center gap-2 relative z-10 text-slate-300">
                    <span>{bid.volume.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500">({bid.orders})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Executed Trades Tape */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[10px] text-slate-400 font-sans mb-1.5 px-1 flex justify-between">
            <span>{language === 'ar' ? 'آخر الصفقات المنفذة' : 'Recent Trades'}</span>
            <span>{language === 'ar' ? 'التوقيت' : 'Time'}</span>
          </div>
          <div className="space-y-1">
            {recentTrades.map(trade => (
              <div
                key={trade.id}
                className="flex items-center justify-between px-2 py-0.5 text-[10px] rounded hover:bg-slate-900"
              >
                <div className="flex items-center gap-1.5">
                  {trade.side === 'buy' ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-400" />
                  )}
                  <span
                    className={`font-semibold ${
                      trade.side === 'buy' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {trade.price.toFixed(2)}
                  </span>
                </div>
                <span className="text-slate-300">{trade.volume.toLocaleString()}</span>
                <span className="text-slate-500">{trade.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
