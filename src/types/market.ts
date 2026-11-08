export type Timeframe = '15m' | '1h' | '4h' | '1D' | '1W' | '1M';
export type ChartType = 'candles' | 'line' | 'area' | 'heikin-ashi' | 'bars';
export type DrawingTool = 'cursor' | 'trendline' | 'horizontal' | 'measure';

export interface Candle {
  t: number; // timestamp in ms
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

export interface StockItem {
  id: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  currentPrice: number;
  isIndex?: boolean;
  reutersRic?: string;
  changePercent: number;
  changeValue: number;
  high24h: number;
  low24h: number;
  volume: number;
  turnoverEGP?: number;
  sector: string;
  isFavorite?: boolean;
  isCustom?: boolean;
  dateStr?: string;
}

export interface IndicatorConfig {
  ma20: boolean;
  ma50: boolean;
  ema200: boolean;
  bollinger: boolean;
  volume: boolean;
  rsi: boolean;
  macd: boolean;
  pivotPoints: boolean;
  fibonacci: boolean;
}

export interface ChartDrawing {
  id: string;
  type: 'trendline' | 'horizontal' | 'measure';
  color: string;
  p1: { xIndex: number; price: number; time: number };
  p2?: { xIndex: number; price: number; time: number };
}

export interface OrderBookLevel {
  price: number;
  volume: number;
  orders: number;
  totalVolume: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  bidRatio: number;
}

export interface TradeTick {
  id: string;
  time: string;
  price: number;
  volume: number;
  side: 'buy' | 'sell';
}

export interface TechnicalSummary {
  trend: string;
  trendType: 'bullish' | 'bearish' | 'neutral';
  maStatus: string;
  goldenCross?: string;
  rsiValue: number;
  rsiStatus: string;
  rsiSignal: 'bullish' | 'bearish' | 'neutral';
  macdStatus: string;
  macdSignal: 'bullish' | 'bearish' | 'neutral';
  bollingerStatus: string;
  volumeStatus: string;
  support: number;
  resistance: number;
  pivot: number;
  s1: number;
  s2: number;
  r1: number;
  r2: number;
  stopLoss: number;
  targetPrice: number;
  overallSignal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  overallScore: number; // e.g. -10 to +10
}
