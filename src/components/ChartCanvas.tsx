import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Candle,
  ChartDrawing,
  ChartType,
  DrawingTool,
  IndicatorConfig,
  StockItem
} from '../types/market';
import {
  calculateBollingerBands,
  calculateEMA,
  calculateMACD,
  calculateRSI,
  calculateSMA
} from '../utils/indicators';

interface ChartCanvasProps {
  candles: Candle[];
  stock: StockItem;
  chartType: ChartType;
  indicators: IndicatorConfig;
  activeDrawingTool: DrawingTool;
  drawings: ChartDrawing[];
  onAddDrawing: (drawing: ChartDrawing) => void;
  isDarkTheme?: boolean;
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  candles,
  stock,
  chartType,
  indicators,
  activeDrawingTool,
  drawings,
  onAddDrawing,
  isDarkTheme = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport navigation state (55 candles for mobile, 110 for desktop)
  const [visibleCount, setVisibleCount] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 55 : 110
  );
  const [offsetRight, setOffsetRight] = useState<number>(0);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [mouseY, setMouseY] = useState<number>(-1);
  const [activeDrawingStart, setActiveDrawingStart] = useState<{
    xIndex: number;
    price: number;
    time: number;
  } | null>(null);

  // Keep mouse drag state in ref to avoid re-binding listeners
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    initialOffset: number;
  }>({
    isDragging: false,
    startX: 0,
    initialOffset: 0
  });

  const pinchRef = useRef<{
    initialDistance: number;
    initialCount: number;
  }>({
    initialDistance: 0,
    initialCount: 110
  });

  // Calculate indicator series
  const ma20Series = useRef<(number | null)[]>([]);
  const ma50Series = useRef<(number | null)[]>([]);
  const ema200Series = useRef<(number | null)[]>([]);
  const bbSeries = useRef<({ lower: number; middle: number; upper: number } | null)[]>([]);
  const rsiSeries = useRef<(number | null)[]>([]);
  const macdSeries = useRef<({ macd: number; signal: number; histogram: number } | null)[]>([]);

  useEffect(() => {
    if (!candles || candles.length === 0) return;
    ma20Series.current = calculateSMA(candles, 20);
    ma50Series.current = calculateSMA(candles, 50);
    ema200Series.current = calculateEMA(candles, Math.min(200, candles.length));
    bbSeries.current = calculateBollingerBands(candles, 20);
    rsiSeries.current = calculateRSI(candles, 14);
    macdSeries.current = calculateMACD(candles);
  }, [candles]);

  const formatPrice = (p: number) => {
    if (isNaN(p)) return '0.00';
    if (stock.isIndex || p >= 1000) {
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return p.toFixed(2);
  };

  const formatVol = (v: number) => {
    if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    return v.toString();
  };

  // Main Drawing Engine
  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !candles || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Theme color palette
    const colors = isDarkTheme
      ? {
          bg: '#0e121a',
          grid: '#1e2430',
          gridSub: '#161a24',
          axisText: '#7d8594',
          crosshair: '#4a5568',
          text: '#d1d4dc',
          up: '#089981',
          upFill: 'rgba(8, 153, 129, 0.25)',
          down: '#f23645',
          downFill: 'rgba(242, 54, 69, 0.25)',
          ma20: '#f59e0b',
          ma50: '#8b5cf6',
          ema200: '#38bdf8',
          bbBand: 'rgba(41, 98, 255, 0.08)',
          bbLine: '#2962ff',
          rsiLine: '#a855f7',
          macdLine: '#3b82f6',
          macdSignal: '#f97316',
          priceTagBg: '#2a2e39',
          badgeText: '#ffffff'
        }
      : {
          bg: '#ffffff',
          grid: '#e8edf3',
          gridSub: '#f1f5f9',
          axisText: '#64748b',
          crosshair: '#94a3b8',
          text: '#0f172a',
          up: '#089981',
          upFill: 'rgba(8, 153, 129, 0.2)',
          down: '#f23645',
          downFill: 'rgba(242, 54, 69, 0.2)',
          ma20: '#d97706',
          ma50: '#7c3aed',
          ema200: '#0284c7',
          bbBand: 'rgba(37, 99, 235, 0.06)',
          bbLine: '#2563eb',
          rsiLine: '#9333ea',
          macdLine: '#2563eb',
          macdSignal: '#ea580c',
          priceTagBg: '#334155',
          badgeText: '#ffffff'
        };

    const N = candles.length;
    const clampedOffset = Math.max(0, Math.min(N - 10, offsetRight));
    const endIndex = N - clampedOffset;
    const startIndex = Math.max(0, endIndex - visibleCount);
    const count = endIndex - startIndex;

    // Layout dimensions
    const priceAxisWidth = width < 640 ? 54 : 68;
    const timeAxisHeight = 24;
    const plotWidth = width - priceAxisWidth;
    const plotHeight = height - timeAxisHeight;

    // Sub-pane heights
    const showVol = indicators.volume;
    const showSubOsc = indicators.rsi || indicators.macd;

    let volHeight = 0;
    let oscHeight = 0;

    if (showVol && showSubOsc) {
      volHeight = Math.round(plotHeight * 0.14);
      oscHeight = Math.round(plotHeight * 0.2);
    } else if (showVol) {
      volHeight = Math.round(plotHeight * 0.18);
    } else if (showSubOsc) {
      oscHeight = Math.round(plotHeight * 0.24);
    }

    const priceHeight = plotHeight - volHeight - oscHeight;
    const volTop = priceHeight;
    const oscTop = priceHeight + volHeight;

    const candleWidth = plotWidth / count;
    const getX = (i: number) => (i - startIndex) * candleWidth + candleWidth / 2;

    // Find Price extremes (min / max) in visible window
    let maxPrice = -Infinity;
    let minPrice = Infinity;

    for (let i = startIndex; i < endIndex; i++) {
      const c = candles[i];
      maxPrice = Math.max(maxPrice, c.h);
      minPrice = Math.min(minPrice, c.l);

      if (indicators.bollinger && bbSeries.current[i]) {
        maxPrice = Math.max(maxPrice, bbSeries.current[i]!.upper);
        minPrice = Math.min(minPrice, bbSeries.current[i]!.lower);
      }
      if (indicators.ma20 && ma20Series.current[i]) {
        maxPrice = Math.max(maxPrice, ma20Series.current[i]!);
        minPrice = Math.min(minPrice, ma20Series.current[i]!);
      }
      if (indicators.ma50 && ma50Series.current[i]) {
        maxPrice = Math.max(maxPrice, ma50Series.current[i]!);
        minPrice = Math.min(minPrice, ma50Series.current[i]!);
      }
    }

    if (minPrice === Infinity || maxPrice === -Infinity || minPrice === maxPrice) {
      minPrice = stock.currentPrice * 0.95;
      maxPrice = stock.currentPrice * 1.05;
    }

    // Add 6% padding top and bottom for comfortable viewing
    const pricePadding = (maxPrice - minPrice) * 0.06;
    maxPrice += pricePadding;
    minPrice = Math.max(0.001, minPrice - pricePadding);

    const getY = (p: number) => {
      const ratio = (maxPrice - p) / (maxPrice - minPrice);
      return 12 + ratio * (priceHeight - 24);
    };

    const getPriceFromY = (y: number) => {
      const ratio = (y - 12) / (priceHeight - 24);
      return maxPrice - ratio * (maxPrice - minPrice);
    };

    // Clear background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Grid Lines & Price Axis Labels
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';

    const numPriceSteps = 6;
    for (let k = 0; k <= numPriceSteps; k++) {
      const p = minPrice + ((maxPrice - minPrice) * k) / numPriceSteps;
      const y = getY(p);

      ctx.strokeStyle = colors.grid;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(plotWidth, y);
      ctx.stroke();

      // Right axis price label
      ctx.fillStyle = colors.axisText;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(p), plotWidth + 6, y);
    }

    // Divider lines between panes
    if (showVol) {
      ctx.strokeStyle = colors.grid;
      ctx.beginPath();
      ctx.moveTo(0, volTop);
      ctx.lineTo(width, volTop);
      ctx.stroke();
    }
    if (showSubOsc) {
      ctx.strokeStyle = colors.grid;
      ctx.beginPath();
      ctx.moveTo(0, oscTop);
      ctx.lineTo(width, oscTop);
      ctx.stroke();
    }

    // Bottom time axis divider
    ctx.strokeStyle = colors.grid;
    ctx.beginPath();
    ctx.moveTo(0, plotHeight);
    ctx.lineTo(width, plotHeight);
    ctx.stroke();

    // Right price axis vertical divider
    ctx.beginPath();
    ctx.moveTo(plotWidth, 0);
    ctx.lineTo(plotWidth, height);
    ctx.stroke();

    // 2. Draw Time Axis Dates
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = colors.axisText;
    const timeStep = Math.max(1, Math.round(count / 7));

    for (let i = startIndex; i < endIndex; i += timeStep) {
      const c = candles[i];
      const x = getX(i);

      // Subtle vertical grid line
      ctx.strokeStyle = colors.gridSub;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, plotHeight);
      ctx.stroke();

      const d = new Date(c.t);
      const dateLabel = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        timeZone: 'UTC'
      });
      ctx.fillText(dateLabel, x, plotHeight + timeAxisHeight / 2);
    }

    // Clip plotting area to avoid leaking over price / time axes
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, plotWidth, priceHeight);
    ctx.clip();

    // 3. Support & Resistance Pivot Overlays
    if (indicators.pivotPoints && candles.length >= 20) {
      const recentWindow = candles.slice(-20);
      const localHigh = Math.max(...recentWindow.map(b => b.h));
      const localLow = Math.min(...recentWindow.map(b => b.l));

      // Resistance line
      ctx.strokeStyle = 'rgba(242, 54, 69, 0.45)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, getY(localHigh));
      ctx.lineTo(plotWidth, getY(localHigh));
      ctx.stroke();

      // Support line
      ctx.strokeStyle = 'rgba(8, 153, 129, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, getY(localLow));
      ctx.lineTo(plotWidth, getY(localLow));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Fibonacci Retracement Levels
    if (indicators.fibonacci && candles.length >= 30) {
      const fibWindow = candles.slice(-35);
      const fibHigh = Math.max(...fibWindow.map(b => b.h));
      const fibLow = Math.min(...fibWindow.map(b => b.l));
      const fibDiff = fibHigh - fibLow;

      const fibLevels = [
        { ratio: 0, label: '0.0%' },
        { ratio: 0.236, label: '23.6%' },
        { ratio: 0.382, label: '38.2%' },
        { ratio: 0.5, label: '50.0%' },
        { ratio: 0.618, label: '61.8%' },
        { ratio: 0.786, label: '78.6%' },
        { ratio: 1.0, label: '100.0%' }
      ];

      fibLevels.forEach(lvl => {
        const p = fibLow + fibDiff * (1 - lvl.ratio);
        const y = getY(p);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(plotWidth, y);
        ctx.stroke();
        ctx.fillStyle = colors.axisText;
        ctx.textAlign = 'left';
        ctx.fillText(`Fib ${lvl.label} (${formatPrice(p)})`, 10, y - 4);
      });
      ctx.setLineDash([]);
    }

    // 5. Bollinger Bands Fill & Lines
    if (indicators.bollinger) {
      const bbs = bbSeries.current;
      ctx.fillStyle = colors.bbBand;
      ctx.beginPath();
      let hasStarted = false;

      // Upper contour
      for (let i = startIndex; i < endIndex; i++) {
        if (bbs[i]) {
          const x = getX(i);
          const y = getY(bbs[i]!.upper);
          if (!hasStarted) {
            ctx.moveTo(x, y);
            hasStarted = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }

      // Lower contour (backwards)
      for (let i = endIndex - 1; i >= startIndex; i--) {
        if (bbs[i]) {
          const x = getX(i);
          const y = getY(bbs[i]!.lower);
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Upper, Middle, Lower lines
      ['upper', 'middle', 'lower'].forEach(key => {
        ctx.strokeStyle = colors.bbLine;
        ctx.lineWidth = key === 'middle' ? 1 : 1.2;
        ctx.globalAlpha = key === 'middle' ? 0.45 : 0.8;
        ctx.beginPath();
        let started = false;
        for (let i = startIndex; i < endIndex; i++) {
          if (bbs[i]) {
            const x = getX(i);
            const val = (bbs[i] as any)[key];
            const y = getY(val);
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    }

    // 6. Moving Averages Lines
    const drawLine = (data: (number | null)[], color: string, width = 1.5) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      let started = false;
      for (let i = startIndex; i < endIndex; i++) {
        if (data[i] !== null) {
          const x = getX(i);
          const y = getY(data[i]!);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
      ctx.lineWidth = 1;
    };

    if (indicators.ma20) drawLine(ma20Series.current, colors.ma20, 1.5);
    if (indicators.ma50) drawLine(ma50Series.current, colors.ma50, 1.5);
    if (indicators.ema200) drawLine(ema200Series.current, colors.ema200, 1.5);

    // 7. Render Price Series (Candles, Line, Area, Heikin-Ashi, Bars)
    const bodyWidth = Math.max(1.5, candleWidth * 0.72);

    if (chartType === 'candles' || chartType === 'heikin-ashi') {
      for (let i = startIndex; i < endIndex; i++) {
        const c = candles[i];
        const isUp = c.c >= c.o;
        const color = isUp ? colors.up : colors.down;
        const x = getX(i);

        // High-Low Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, getY(c.h));
        ctx.lineTo(x, getY(c.l));
        ctx.stroke();

        // Real Body
        const topY = getY(Math.max(c.o, c.c));
        const bottomY = getY(Math.min(c.o, c.c));
        const bodyHeight = Math.max(1, bottomY - topY);

        ctx.fillStyle = color;
        ctx.fillRect(x - bodyWidth / 2, topY, bodyWidth, bodyHeight);
      }
    } else if (chartType === 'line' || chartType === 'area') {
      ctx.strokeStyle = colors.bbLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = startIndex; i < endIndex; i++) {
        const x = getX(i);
        const y = getY(candles[i].c);
        if (i === startIndex) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (chartType === 'area') {
        ctx.lineTo(getX(endIndex - 1), priceHeight);
        ctx.lineTo(getX(startIndex), priceHeight);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, priceHeight);
        gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0.00)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    } else if (chartType === 'bars') {
      // Classic OHLC tick bars
      for (let i = startIndex; i < endIndex; i++) {
        const c = candles[i];
        const isUp = c.c >= c.o;
        const color = isUp ? colors.up : colors.down;
        const x = getX(i);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, getY(c.h));
        ctx.lineTo(x, getY(c.l));

        // Open tick (left)
        ctx.moveTo(x - bodyWidth / 2, getY(c.o));
        ctx.lineTo(x, getY(c.o));

        // Close tick (right)
        ctx.moveTo(x, getY(c.c));
        ctx.lineTo(x + bodyWidth / 2, getY(c.c));
        ctx.stroke();
      }
    }

    // 8. User Drawings (Trendlines, Horizontal lines, Measurements)
    drawings.forEach(d => {
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 1.8;

      if (d.type === 'horizontal') {
        const y = getY(d.p1.price);
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(plotWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (d.type === 'trendline' && d.p2) {
        const x1 = getX(d.p1.xIndex);
        const y1 = getY(d.p1.price);
        const x2 = getX(d.p2.xIndex);
        const y2 = getY(d.p2.price);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (d.type === 'measure' && d.p2) {
        const x1 = getX(d.p1.xIndex);
        const y1 = getY(d.p1.price);
        const x2 = getX(d.p2.xIndex);
        const y2 = getY(d.p2.price);

        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
        ctx.strokeStyle = '#3b82f6';
        ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));

        const priceDiff = d.p2.price - d.p1.price;
        const pctDiff = (priceDiff / d.p1.price) * 100;
        const barsCount = Math.abs(d.p2.xIndex - d.p1.xIndex);

        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText(
          `${priceDiff >= 0 ? '+' : ''}${formatPrice(priceDiff)} (${pctDiff >= 0 ? '+' : ''}${pctDiff.toFixed(2)}%) · ${barsCount} شموع`,
          Math.min(x1, x2) + 6,
          Math.min(y1, y2) + 16
        );
      }
    });

    // 9. Active drawing preview while dragging/drawing
    if (activeDrawingStart && activeDrawingTool !== 'cursor') {
      const x1 = getX(activeDrawingStart.xIndex);
      const y1 = getY(activeDrawingStart.price);
      const curX = hoverIndex >= 0 ? getX(hoverIndex) : x1;
      const curY = mouseY >= 0 ? mouseY : y1;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);

      if (activeDrawingTool === 'trendline') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(curX, curY);
        ctx.stroke();
      } else if (activeDrawingTool === 'measure') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fillRect(Math.min(x1, curX), Math.min(y1, curY), Math.abs(curX - x1), Math.abs(curY - y1));
        ctx.strokeRect(Math.min(x1, curX), Math.min(y1, curY), Math.abs(curX - x1), Math.abs(curY - y1));
      }
      ctx.setLineDash([]);
    }

    // 10. Last Price Line (Beacon) across price plot
    const lastBar = candles[N - 1];
    const lastY = getY(lastBar.c);
    const lastIsUp = lastBar.c >= lastBar.o;
    const lastColor = lastIsUp ? colors.up : colors.down;

    if (clampedOffset === 0) {
      ctx.strokeStyle = lastColor;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, lastY);
      ctx.lineTo(plotWidth, lastY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore(); // end price pane clipping

    // 11. Last Price Tag in Right Axis
    if (clampedOffset === 0) {
      ctx.fillStyle = lastColor;
      ctx.fillRect(plotWidth, lastY - 10, priceAxisWidth, 20);
      ctx.fillStyle = colors.badgeText;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatPrice(lastBar.c), plotWidth + 6, lastY);
    }

    // 12. Volume Pane
    if (showVol) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, volTop, plotWidth, volHeight);
      ctx.clip();

      let maxVol = 0;
      for (let i = startIndex; i < endIndex; i++) {
        maxVol = Math.max(maxVol, candles[i].v);
      }
      maxVol = maxVol || 1;

      for (let i = startIndex; i < endIndex; i++) {
        const c = candles[i];
        const isUp = c.c >= c.o;
        const color = isUp ? colors.up : colors.down;
        const h = (c.v / maxVol) * (volHeight - 8);
        const x = getX(i);

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(x - bodyWidth / 2, volTop + volHeight - h, bodyWidth, h);
      }
      ctx.globalAlpha = 1;

      // Volume Title & Max Volume Tag
      ctx.fillStyle = colors.axisText;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`الحجم (Volume): ${formatVol(maxVol)}`, 8, volTop + 14);

      ctx.restore();
    }

    // 13. Sub-Oscillator Pane: RSI or MACD
    if (showSubOsc) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, oscTop, plotWidth, oscHeight);
      ctx.clip();

      if (indicators.rsi) {
        // RSI 14
        const rsiY = (v: number) => oscTop + 8 + ((100 - v) / 100) * (oscHeight - 16);

        // 70 and 30 Overbought / Oversold dashed lines
        ctx.strokeStyle = colors.grid;
        ctx.setLineDash([4, 4]);
        [30, 50, 70].forEach(level => {
          const y = rsiY(level);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(plotWidth, y);
          ctx.stroke();

          ctx.fillStyle = colors.axisText;
          ctx.textAlign = 'right';
          ctx.fillText(level.toString(), plotWidth - 6, y - 2);
        });
        ctx.setLineDash([]);

        // RSI Line
        const rsiData = rsiSeries.current;
        ctx.strokeStyle = colors.rsiLine;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        let rsiStarted = false;
        for (let i = startIndex; i < endIndex; i++) {
          if (rsiData[i] !== null) {
            const x = getX(i);
            const y = rsiY(rsiData[i]!);
            if (!rsiStarted) {
              ctx.moveTo(x, y);
              rsiStarted = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
        ctx.stroke();
        ctx.lineWidth = 1;

        // Current RSI label
        const curRsi = rsiData[endIndex - 1];
        ctx.fillStyle = colors.rsiLine;
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`RSI (14): ${curRsi !== null && curRsi !== undefined ? curRsi.toFixed(1) : '--'}`, 8, oscTop + 14);
      } else if (indicators.macd) {
        // MACD (12, 26, 9)
        const macdData = macdSeries.current;
        let maxHist = 0.001;
        for (let i = startIndex; i < endIndex; i++) {
          if (macdData[i]) {
            maxHist = Math.max(maxHist, Math.abs(macdData[i]!.histogram), Math.abs(macdData[i]!.macd));
          }
        }
        maxHist *= 1.2;

        const zeroY = oscTop + oscHeight / 2;
        const macdY = (v: number) => zeroY - (v / maxHist) * (oscHeight / 2 - 8);

        // Zero line
        ctx.strokeStyle = colors.grid;
        ctx.beginPath();
        ctx.moveTo(0, zeroY);
        ctx.lineTo(plotWidth, zeroY);
        ctx.stroke();

        // Histogram bars
        for (let i = startIndex; i < endIndex; i++) {
          const m = macdData[i];
          if (m) {
            const x = getX(i);
            const h = (m.histogram / maxHist) * (oscHeight / 2 - 8);
            ctx.fillStyle = m.histogram >= 0 ? colors.up : colors.down;
            ctx.fillRect(x - bodyWidth / 2, zeroY - h, bodyWidth, h);
          }
        }

        // MACD line & Signal line
        const drawOscLine = (key: 'macd' | 'signal', color: string) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          let started = false;
          for (let i = startIndex; i < endIndex; i++) {
            const m = macdData[i];
            if (m) {
              const x = getX(i);
              const y = macdY(m[key]);
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
          }
          ctx.stroke();
        };

        drawOscLine('macd', colors.macdLine);
        drawOscLine('signal', colors.macdSignal);

        // Header label
        ctx.fillStyle = colors.axisText;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('MACD (12, 26, 9)', 8, oscTop + 14);
      }

      ctx.restore();
    }

    // 14. Interactive Crosshairs & Dynamic Readout
    if (hoverIndex >= startIndex && hoverIndex < endIndex) {
      const crossX = getX(hoverIndex);
      const targetCandle = candles[hoverIndex];

      // Vertical crosshair line
      ctx.strokeStyle = colors.crosshair;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(crossX, 0);
      ctx.lineTo(crossX, plotHeight);
      ctx.stroke();

      // Horizontal crosshair line (only if within price pane)
      if (mouseY >= 0 && mouseY <= priceHeight) {
        ctx.beginPath();
        ctx.moveTo(0, mouseY);
        ctx.lineTo(plotWidth, mouseY);
        ctx.stroke();

        // Price badge on right axis
        const hoveredPrice = getPriceFromY(mouseY);
        ctx.fillStyle = colors.priceTagBg;
        ctx.fillRect(plotWidth, mouseY - 10, priceAxisWidth, 20);
        ctx.fillStyle = colors.badgeText;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatPrice(hoveredPrice), plotWidth + 6, mouseY);
      }

      ctx.setLineDash([]);

      // Date badge on bottom time axis
      const hoveredDate = new Date(targetCandle.t).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC'
      });
      const badgeWidth = ctx.measureText(hoveredDate).width + 16;
      ctx.fillStyle = colors.priceTagBg;
      ctx.fillRect(Math.max(0, Math.min(crossX - badgeWidth / 2, plotWidth - badgeWidth)), plotHeight + 2, badgeWidth, 20);
      ctx.fillStyle = colors.badgeText;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hoveredDate, Math.max(badgeWidth / 2, Math.min(crossX, plotWidth - badgeWidth / 2)), plotHeight + 12);
    }
  }, [
    candles,
    stock,
    chartType,
    indicators,
    visibleCount,
    offsetRight,
    hoverIndex,
    mouseY,
    drawings,
    activeDrawingStart,
    activeDrawingTool,
    isDarkTheme
  ]);

  // Keep chart updated on state/prop change
  useEffect(() => {
    renderChart();
  }, [renderChart]);

  // Auto-resize observer
  useEffect(() => {
    const handleResize = () => renderChart();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [renderChart]);

  // Calculate mouse coordinate to candle index
  const getIndexFromX = (clientX: number): number => {
    const canvas = canvasRef.current;
    if (!canvas || !candles || candles.length === 0) return -1;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const priceAxisWidth = canvas.clientWidth < 640 ? 54 : 68;
    const plotWidth = canvas.clientWidth - priceAxisWidth;

    const N = candles.length;
    const clampedOffset = Math.max(0, Math.min(N - 10, offsetRight));
    const endIndex = N - clampedOffset;
    const startIndex = Math.max(0, endIndex - visibleCount);
    const count = endIndex - startIndex;

    if (x < 0 || x > plotWidth || count <= 0) return -1;
    const candleWidth = plotWidth / count;
    const index = Math.floor(startIndex + x / candleWidth);
    return Math.max(0, Math.min(N - 1, index));
  };

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const idx = getIndexFromX(e.clientX);
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if (activeDrawingTool !== 'cursor' && idx >= 0) {
      const price = candles[idx].c;
      const time = candles[idx].t;

      if (activeDrawingTool === 'horizontal') {
        onAddDrawing({
          id: 'draw-' + Date.now(),
          type: 'horizontal',
          color: '#38bdf8',
          p1: { xIndex: idx, price, time }
        });
        return;
      }

      if (!activeDrawingStart) {
        setActiveDrawingStart({ xIndex: idx, price, time });
      } else {
        // Complete trendline or measure tool
        onAddDrawing({
          id: 'draw-' + Date.now(),
          type: activeDrawingTool,
          color: activeDrawingTool === 'measure' ? '#3b82f6' : '#38bdf8',
          p1: activeDrawingStart,
          p2: { xIndex: idx, price, time }
        });
        setActiveDrawingStart(null);
      }
      return;
    }

    // Standard panning
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      initialOffset: offsetRight
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMouseY(e.clientY - rect.top);

    const idx = getIndexFromX(e.clientX);
    setHoverIndex(idx);

    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.startX;
      const isMobile = canvas.clientWidth < 640;
      const priceAxisWidth = isMobile ? 54 : 68;
      const plotWidth = canvas.clientWidth - priceAxisWidth;
      const candleWidth = plotWidth / visibleCount;
      const deltaBars = Math.round(deltaX / candleWidth);

      const maxOffset = candles.length - visibleCount;
      const newOffset = Math.max(0, Math.min(maxOffset, dragRef.current.initialOffset + deltaBars));
      setOffsetRight(newOffset);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    dragRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.12 : 0.89;
    setVisibleCount(prev => {
      const next = Math.round(prev * zoomFactor);
      return Math.max(15, Math.min(candles.length, next));
    });
  };

  // Touch pinch-to-zoom support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = {
        initialDistance: dist,
        initialCount: visibleCount
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current.initialDistance > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = pinchRef.current.initialDistance / dist;
      const nextCount = Math.round(pinchRef.current.initialCount * ratio);
      setVisibleCount(Math.max(15, Math.min(candles.length, nextCount)));
    }
  };

  // Active bar for OHLC legend readout
  const activeCandle =
    hoverIndex >= 0 && hoverIndex < candles.length
      ? candles[hoverIndex]
      : candles[candles.length - 1];

  const prevCandle =
    hoverIndex > 0 && hoverIndex < candles.length
      ? candles[hoverIndex - 1]
      : candles.length >= 2
      ? candles[candles.length - 2]
      : activeCandle;

  const barChange = activeCandle ? activeCandle.c - prevCandle.c : 0;
  const barChangePct = prevCandle && prevCandle.c !== 0 ? (barChange / prevCandle.c) * 100 : 0;
  const isUp = activeCandle ? activeCandle.c >= activeCandle.o : true;

  const activeIndex = hoverIndex >= 0 ? hoverIndex : candles.length - 1;
  const activeMa20 = ma20Series.current[activeIndex];
  const activeMa50 = ma50Series.current[activeIndex];
  const activeEma200 = ema200Series.current[activeIndex];
  const activeRsi = rsiSeries.current[activeIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden touch-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Top OHLC & Active Indicators Header Strip */}
      <div className="absolute top-2 left-2 right-2 md:left-3 md:right-20 z-10 flex flex-wrap items-center gap-x-2 md:gap-x-4 gap-y-1 text-[10px] md:text-[11px] font-mono pointer-events-none drop-shadow-sm">
        {activeCandle && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 bg-[#0e121a]/90 backdrop-blur-xs px-2 py-0.5 md:py-1 rounded border border-slate-700/50">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">O:</span>
              <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {formatPrice(activeCandle.o)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">H:</span>
              <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {formatPrice(activeCandle.h)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">L:</span>
              <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {formatPrice(activeCandle.l)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">C:</span>
              <span className={isUp ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {formatPrice(activeCandle.c)}
              </span>
            </div>
            <span
              className={`font-semibold ${
                barChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {barChange >= 0 ? '+' : ''}
              {formatPrice(barChange)} ({barChangePct >= 0 ? '+' : ''}
              {barChangePct.toFixed(2)}%)
            </span>
            <div className="hidden xs:flex items-center gap-1">
              <span className="text-slate-400">V:</span>
              <span className="text-slate-300">{formatVol(activeCandle.v)}</span>
            </div>
          </div>
        )}

        {/* Indicator Tags */}
        <div className="hidden sm:flex items-center gap-2 text-[10px]">
          {indicators.ma20 && activeMa20 !== null && (
            <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              MA20: {formatPrice(activeMa20)}
            </span>
          )}
          {indicators.ma50 && activeMa50 !== null && (
            <span className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              MA50: {formatPrice(activeMa50)}
            </span>
          )}
          {indicators.ema200 && activeEma200 !== null && (
            <span className="text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
              EMA200: {formatPrice(activeEma200)}
            </span>
          )}
          {indicators.rsi && activeRsi !== null && (
            <span className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
              RSI: {activeRsi?.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          setHoverIndex(-1);
          setMouseY(-1);
          dragRef.current.isDragging = false;
        }}
      />
    </div>
  );
};
