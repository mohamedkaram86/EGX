import React, { useState } from 'react';
import {
  CandlestickChart,
  LineChart,
  AreaChart,
  SlidersHorizontal,
  Pencil,
  Minus,
  Maximize2,
  Camera,
  Download,
  Trash2,
  Check,
  TrendingUp,
  Ruler
} from 'lucide-react';
import { ChartType, DrawingTool, IndicatorConfig, Timeframe } from '../types/market';

interface ChartToolbarProps {
  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;
  chartType: ChartType;
  onChangeChartType: (type: ChartType) => void;
  indicators: IndicatorConfig;
  onToggleIndicator: (key: keyof IndicatorConfig) => void;
  activeDrawingTool: DrawingTool;
  onSelectDrawingTool: (tool: DrawingTool) => void;
  onClearDrawings: () => void;
  onExportImage: () => void;
  onExportCSV: () => void;
  language: 'ar' | 'en';
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  timeframe,
  onChangeTimeframe,
  chartType,
  onChangeChartType,
  indicators,
  onToggleIndicator,
  activeDrawingTool,
  onSelectDrawingTool,
  onClearDrawings,
  onExportImage,
  onExportCSV,
  language
}) => {
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const timeframes: { key: Timeframe; labelAr: string; labelEn: string }[] = [
    { key: '15m', labelAr: '15 د', labelEn: '15m' },
    { key: '1h', labelAr: '1 س', labelEn: '1h' },
    { key: '4h', labelAr: '4 س', labelEn: '4h' },
    { key: '1D', labelAr: 'يومي', labelEn: '1D' },
    { key: '1W', labelAr: 'أسبوعي', labelEn: '1W' },
    { key: '1M', labelAr: 'شهري', labelEn: '1M' }
  ];

  const chartTypes: { key: ChartType; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'candles', labelAr: 'شموع يابانية', labelEn: 'Candles', icon: <CandlestickChart className="w-3.5 h-3.5" /> },
    { key: 'line', labelAr: 'رسم خطي', labelEn: 'Line', icon: <LineChart className="w-3.5 h-3.5" /> },
    { key: 'area', labelAr: 'مساحة مظللة', labelEn: 'Area', icon: <AreaChart className="w-3.5 h-3.5" /> },
    { key: 'heikin-ashi', labelAr: 'هيكن آشي', labelEn: 'Heikin Ashi', icon: <CandlestickChart className="w-3.5 h-3.5 text-blue-400" /> },
    { key: 'bars', labelAr: 'أعمدة OHLC', labelEn: 'OHLC Bars', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> }
  ];

  const indicatorOptions: { key: keyof IndicatorConfig; labelAr: string; labelEn: string; color: string }[] = [
    { key: 'ma20', labelAr: 'متوسط متحرك 20 (MA 20)', labelEn: 'SMA 20', color: 'bg-amber-500' },
    { key: 'ma50', labelAr: 'متوسط متحرك 50 (MA 50)', labelEn: 'SMA 50', color: 'bg-purple-500' },
    { key: 'ema200', labelAr: 'متوسط أسي 200 (EMA 200)', labelEn: 'EMA 200', color: 'bg-sky-400' },
    { key: 'bollinger', labelAr: 'حدود بولنجر (Bollinger Bands 20, 2)', labelEn: 'Bollinger Bands', color: 'bg-blue-600' },
    { key: 'volume', labelAr: 'أحجام التداول (Volume)', labelEn: 'Volume Bars', color: 'bg-emerald-500' },
    { key: 'rsi', labelAr: 'مؤشر القوة النسبية (RSI 14)', labelEn: 'RSI (14)', color: 'bg-purple-600' },
    { key: 'macd', labelAr: 'مؤشر الماكد (MACD 12, 26, 9)', labelEn: 'MACD', color: 'bg-indigo-500' },
    { key: 'pivotPoints', labelAr: 'مستويات الدعم والمقاومة (Pivots)', labelEn: 'Pivot Points', color: 'bg-rose-500' },
    { key: 'fibonacci', labelAr: 'مستويات فيبوناتشي (Fibonacci)', labelEn: 'Fibonacci Levels', color: 'bg-teal-500' }
  ];

  return (
    <div className="h-10 border-b border-slate-800 bg-[#0e121a] dark:bg-[#0e121a] px-3 flex items-center justify-between gap-2 shrink-0 z-10 select-none overflow-x-auto no-scrollbar">
      {/* Left: Timeframe Switcher & Chart Type */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Timeframe Buttons */}
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-md border border-slate-800/80">
          {timeframes.map(tf => {
            const isActive = timeframe === tf.key;
            return (
              <button
                key={tf.key}
                onClick={() => onChangeTimeframe(tf.key)}
                className={`px-2 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {language === 'ar' ? tf.labelAr : tf.labelEn}
              </button>
            );
          })}
        </div>

        {/* Chart Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTypeMenu(!showTypeMenu);
              setShowIndicatorsMenu(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300 transition-colors whitespace-nowrap"
          >
            {chartTypes.find(c => c.key === chartType)?.icon}
            <span className="hidden sm:inline">
              {language === 'ar'
                ? chartTypes.find(c => c.key === chartType)?.labelAr
                : chartTypes.find(c => c.key === chartType)?.labelEn}
            </span>
          </button>

          {showTypeMenu && (
            <div className="absolute top-full mt-1.5 start-0 w-44 max-w-[calc(100vw-24px)] bg-[#141923] border border-slate-700/80 rounded-lg shadow-xl p-1 z-50">
              {chartTypes.map(t => (
                <button
                  key={t.key}
                  onClick={() => {
                    onChangeChartType(t.key);
                    setShowTypeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                    chartType === t.key
                      ? 'bg-blue-600/20 text-blue-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {t.icon}
                    <span>{language === 'ar' ? t.labelAr : t.labelEn}</span>
                  </div>
                  {chartType === t.key && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Indicators Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowIndicatorsMenu(!showIndicatorsMenu);
              setShowTypeMenu(false);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md border transition-all whitespace-nowrap ${
              showIndicatorsMenu
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'ar' ? 'المؤشرات' : 'Indicators'}</span>
            <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] flex items-center justify-center font-bold">
              {Object.values(indicators).filter(Boolean).length}
            </span>
          </button>

          {showIndicatorsMenu && (
            <div className="absolute top-full mt-1.5 start-0 w-72 max-w-[calc(100vw-24px)] bg-[#141923] border border-slate-700/80 rounded-lg shadow-2xl p-2 z-50 max-h-[70vh] overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 border-b border-slate-800/80 mb-1">
                {language === 'ar' ? 'المؤشرات وأدوات التحليل' : 'Technical Indicators'}
              </div>
              <div className="space-y-1">
                {indicatorOptions.map(ind => {
                  const isChecked = indicators[ind.key];
                  return (
                    <button
                      key={ind.key}
                      onClick={() => onToggleIndicator(ind.key)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md transition-colors ${
                        isChecked
                          ? 'bg-blue-600/15 text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ind.color}`} />
                        <span>{language === 'ar' ? ind.labelAr : ind.labelEn}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Drawing Tools Palette & Export */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center bg-slate-900/80 p-0.5 rounded-md border border-slate-800/80">
          {/* Default Cursor */}
          <button
            onClick={() => onSelectDrawingTool('cursor')}
            title={language === 'ar' ? 'مؤشر عادي' : 'Cursor'}
            className={`p-1.5 text-xs rounded transition-all ${
              activeDrawingTool === 'cursor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Trendline */}
          <button
            onClick={() => onSelectDrawingTool('trendline')}
            title={language === 'ar' ? 'رسم خط اتجاه' : 'Trendline'}
            className={`p-1.5 text-xs rounded transition-all ${
              activeDrawingTool === 'trendline'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>

          {/* Horizontal Line */}
          <button
            onClick={() => onSelectDrawingTool('horizontal')}
            title={language === 'ar' ? 'خط أفقي (دعم / مقاومة)' : 'Horizontal Level'}
            className={`p-1.5 text-xs rounded transition-all ${
              activeDrawingTool === 'horizontal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Measurement Tool */}
          <button
            onClick={() => onSelectDrawingTool('measure')}
            title={language === 'ar' ? 'أداة قياس النسبة والسعر' : 'Price & Bar Measure'}
            className={`p-1.5 text-xs rounded transition-all ${
              activeDrawingTool === 'measure'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>

          {/* Clear Drawings */}
          <button
            onClick={onClearDrawings}
            title={language === 'ar' ? 'مسح كل الرسومات' : 'Clear Drawings'}
            className="p-1.5 text-xs rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Screenshot snapshot */}
        <button
          onClick={onExportImage}
          title={language === 'ar' ? 'حفظ لقطة من الشارت' : 'Take Screenshot'}
          className="p-1.5 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>

        {/* Export Historical CSV */}
        <button
          onClick={onExportCSV}
          title={language === 'ar' ? 'تصدير البيانات التاريخية CSV' : 'Export Data CSV'}
          className="p-1.5 rounded-md border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
