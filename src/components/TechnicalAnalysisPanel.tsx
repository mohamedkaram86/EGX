import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldAlert,
  Target,
  Compass,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { TechnicalSummary, StockItem } from '../types/market';

interface TechnicalAnalysisPanelProps {
  summary: TechnicalSummary;
  stock: StockItem;
  timeframeLabel: string;
  onClose: () => void;
  language: 'ar' | 'en';
}

export const TechnicalAnalysisPanel: React.FC<TechnicalAnalysisPanelProps> = ({
  summary,
  stock,
  timeframeLabel,
  onClose,
  language
}) => {
  const signalConfigs = {
    strong_buy: {
      labelAr: 'شراء قوي (Strong Buy)',
      labelEn: 'Strong Buy',
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
      badge: 'bg-emerald-600 text-white'
    },
    buy: {
      labelAr: 'شراء (Buy)',
      labelEn: 'Buy',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badge: 'bg-emerald-500 text-white'
    },
    neutral: {
      labelAr: 'محايد / مراقبة (Neutral)',
      labelEn: 'Neutral',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      badge: 'bg-amber-500 text-white'
    },
    sell: {
      labelAr: 'بيع / تخفيف (Sell)',
      labelEn: 'Sell',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      badge: 'bg-rose-500 text-white'
    },
    strong_sell: {
      labelAr: 'بيع قوي (Strong Sell)',
      labelEn: 'Strong Sell',
      color: 'text-rose-500 bg-rose-500/20 border-rose-500/40',
      badge: 'bg-rose-600 text-white'
    }
  };

  const signal = signalConfigs[summary.overallSignal] || signalConfigs.neutral;

  return (
    <div className="relative border-t border-slate-800 bg-[#0e121a] text-slate-200 p-3 md:p-4 max-h-[60vh] md:max-h-72 overflow-y-auto shrink-0 select-none pb-16 md:pb-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">
              {language === 'ar'
                ? `التحليل الفني الذكي — ${stock.symbol} (${timeframeLabel})`
                : `Technical Analysis — ${stock.symbol} (${timeframeLabel})`}
            </h3>
          </div>

          {/* Overall Signal Pill */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${signal.color}`}
          >
            <span>{language === 'ar' ? signal.labelAr : signal.labelEn}</span>
            <span className="font-mono text-[10px]">
              ({summary.overallScore > 0 ? '+' : ''}
              {summary.overallScore})
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of indicators breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Trend & Moving Averages */}
        <div className="bg-[#141923] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'ar' ? 'الاتجاه والمتوسطات' : 'Trend & MAs'}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{summary.trend}</p>
          <p className="text-slate-400 text-[10px]">{summary.maStatus}</p>
          {summary.goldenCross && (
            <p className="text-amber-400 font-semibold text-[10px] mt-1">
              {summary.goldenCross}
            </p>
          )}
        </div>

        {/* Card 2: RSI & Momentum */}
        <div className="bg-[#141923] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span>{language === 'ar' ? 'الزخم ومؤشر القوة RSI' : 'Momentum & RSI'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-mono text-white">
              {summary.rsiValue.toFixed(1)}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                summary.rsiSignal === 'bullish'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : summary.rsiSignal === 'bearish'
                  ? 'bg-rose-500/15 text-rose-400'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {summary.rsiStatus}
            </span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">{summary.macdStatus}</p>
        </div>

        {/* Card 3: Volatility & Bollinger */}
        <div className="bg-[#141923] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? 'التذبذب وأحجام التداول' : 'Volatility & Volume'}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {summary.bollingerStatus}
          </p>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            {summary.volumeStatus}
          </p>
        </div>

        {/* Card 4: Pivots & Key Levels */}
        <div className="bg-[#141923] p-3 rounded-lg border border-slate-800/80 space-y-1.5 font-mono">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 font-sans">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'نقاط الارتكاز والدعوم' : 'Pivots & S/R Levels'}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <div className="text-slate-400">
              {language === 'ar' ? 'نقطة الارتكاز P:' : 'Pivot:'}{' '}
              <span className="text-white font-bold">{summary.pivot.toFixed(2)}</span>
            </div>
            <div className="text-emerald-400">
              {language === 'ar' ? 'دعم S1:' : 'S1:'}{' '}
              <span className="font-semibold">{summary.s1.toFixed(2)}</span>
            </div>
            <div className="text-rose-400">
              {language === 'ar' ? 'مقاومة R1:' : 'R1:'}{' '}
              <span className="font-semibold">{summary.r1.toFixed(2)}</span>
            </div>
            <div className="text-blue-400">
              {language === 'ar' ? 'الهدف الفني:' : 'Target:'}{' '}
              <span className="font-semibold">{summary.targetPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {language === 'ar'
            ? 'تنبيه: التحليل الفني يتم احتسابه آلياً وفقاً لمؤشرات السوق، ولا يعد توصية مباشرة بالشراء أو البيع.'
            : 'Disclaimer: Automated technical analysis calculated from historical market indicators. Not direct financial advice.'}
        </span>
        <span className="font-mono text-slate-400">
          EGX Market Session: Sun-Thu 10:00 - 14:30 Cairo (UTC+2)
        </span>
      </div>
    </div>
  );
};
