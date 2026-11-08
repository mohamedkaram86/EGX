import { Candle, TechnicalSummary } from '../types/market';

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(candles: Candle[], period: number): (number | null)[] {
  return candles.map((_, i) => {
    if (i < period - 1) return null;
    const sum = candles.slice(i - period + 1, i + 1).reduce((acc, c) => acc + c.c, 0);
    return +(sum / period).toFixed(2);
  });
}

/**
 * Exponential Moving Average (EMA)
 */
export function calculateEMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prevEma = 0;

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const initialSma = candles.slice(0, period).reduce((acc, c) => acc + c.c, 0) / period;
      prevEma = initialSma;
      result.push(+initialSma.toFixed(2));
    } else {
      const currentEma: number = candles[i].c * k + prevEma * (1 - k);
      prevEma = currentEma;
      result.push(+currentEma.toFixed(2));
    }
  }

  return result;
}

/**
 * Bollinger Bands (Upper, Middle, Lower)
 */
export function calculateBollingerBands(
  candles: Candle[],
  period = 20,
  stdDevMultiplier = 2
): ({ lower: number; middle: number; upper: number } | null)[] {
  const sma = calculateSMA(candles, period);

  return candles.map((_, i) => {
    const mid = sma[i];
    if (mid === null) return null;

    const slice = candles.slice(i - period + 1, i + 1);
    const variance = slice.reduce((acc, c) => acc + Math.pow(c.c - mid, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upper = +(mid + stdDevMultiplier * stdDev).toFixed(2);
    const lower = +(mid - stdDevMultiplier * stdDev).toFixed(2);

    return { lower, middle: mid, upper };
  });
}

/**
 * Relative Strength Index (RSI 14)
 */
export function calculateRSI(candles: Candle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  let avgGain = 0;
  let avgLoss = 0;

  candles.forEach((candle, i) => {
    if (i === 0) {
      result.push(null);
      return;
    }

    const change = candle.c - candles[i - 1].c;
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);

    if (i <= period) {
      avgGain += gain / period;
      avgLoss += loss / period;
      if (i === period) {
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);
        result.push(+rsi.toFixed(2));
      } else {
        result.push(null);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(+rsi.toFixed(2));
    }
  });

  return result;
}

/**
 * MACD (12, 26, 9)
 */
export interface MACDPoint {
  macd: number;
  signal: number;
  histogram: number;
}

export function calculateMACD(
  candles: Candle[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): (MACDPoint | null)[] {
  const fastEMA = calculateEMA(candles, fastPeriod);
  const slowEMA = calculateEMA(candles, slowPeriod);

  const macdLine: (number | null)[] = [];
  candles.forEach((_, i) => {
    if (fastEMA[i] !== null && slowEMA[i] !== null) {
      macdLine.push(+((fastEMA[i] as number) - (slowEMA[i] as number)).toFixed(2));
    } else {
      macdLine.push(null);
    }
  });

  // Calculate EMA of macdLine for signal line
  const validMacdValues: { index: number; value: number }[] = [];
  macdLine.forEach((val, index) => {
    if (val !== null) validMacdValues.push({ index, value: val });
  });

  const signalLineMap = new Map<number, number>();
  if (validMacdValues.length >= signalPeriod) {
    const k = 2 / (signalPeriod + 1);
    let prevSignal = validMacdValues.slice(0, signalPeriod).reduce((s, v) => s + v.value, 0) / signalPeriod;
    signalLineMap.set(validMacdValues[signalPeriod - 1].index, +prevSignal.toFixed(2));

    for (let j = signalPeriod; j < validMacdValues.length; j++) {
      const curSignal = validMacdValues[j].value * k + prevSignal * (1 - k);
      prevSignal = curSignal;
      signalLineMap.set(validMacdValues[j].index, +curSignal.toFixed(2));
    }
  }

  return candles.map((_, i) => {
    const macd = macdLine[i];
    const signal = signalLineMap.get(i);
    if (macd === null || signal === undefined) return null;
    const histogram = +(macd - signal).toFixed(2);
    return { macd, signal, histogram };
  });
}

/**
 * Comprehensive Technical Analysis Engine
 */
export function generateTechnicalAnalysis(
  candles: Candle[],
  symbolName: string
): TechnicalSummary {
  const N = candles.length;
  if (N < 30) {
    return {
      trend: 'بيانات غير كافية',
      trendType: 'neutral',
      maStatus: 'لا توجد بيانات كافية',
      rsiValue: 50,
      rsiStatus: 'محايد',
      rsiSignal: 'neutral',
      macdStatus: 'محايد',
      macdSignal: 'neutral',
      bollingerStatus: 'طبيعي',
      volumeStatus: 'طبيعي',
      support: 0,
      resistance: 0,
      pivot: 0,
      s1: 0,
      s2: 0,
      r1: 0,
      r2: 0,
      stopLoss: 0,
      targetPrice: 0,
      overallSignal: 'neutral',
      overallScore: 0
    };
  }

  const last = candles[N - 1];
  const prev = candles[N - 2];
  const currentPrice = last.c;

  const ma20 = calculateSMA(candles, 20);
  const ma50 = calculateSMA(candles, 50);
  const ema200 = calculateEMA(candles, Math.min(200, N - 1));
  const rsiArr = calculateRSI(candles, 14);
  const bbArr = calculateBollingerBands(candles, 20);
  const macdArr = calculateMACD(candles);

  const m20Val = ma20[N - 1] || currentPrice;
  const m50Val = ma50[N - 1] || currentPrice;
  const e200Val = ema200[N - 1] || currentPrice;
  const rsiVal = rsiArr[N - 1] ?? 50;
  const bbVal = bbArr[N - 1];
  const macdVal = macdArr[N - 1];

  let score = 0;

  // 1. Moving Averages Trend Analysis
  let trendText = '';
  let trendType: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let maStatusText = '';

  if (currentPrice > m20Val && m20Val > m50Val) {
    trendType = 'bullish';
    trendText = 'اتجاه صاعد قوي فوق متوسطي 20 و 50 يوم';
    maStatusText = `السعر (${currentPrice.toFixed(2)}) أعلى من متوسط 20 (${m20Val.toFixed(2)}) والمتوسط 50 (${m50Val.toFixed(2)})`;
    score += 3;
  } else if (currentPrice < m20Val && m20Val < m50Val) {
    trendType = 'bearish';
    trendText = 'اتجاه هابط تحت متوسطي 20 و 50 يوم';
    maStatusText = `السعر (${currentPrice.toFixed(2)}) أدنى من متوسط 20 (${m20Val.toFixed(2)}) والمتوسط 50 (${m50Val.toFixed(2)})`;
    score -= 3;
  } else if (currentPrice > m20Val) {
    trendType = 'bullish';
    trendText = 'زخم إيجابي قصير الأجل فوق متوسط 20';
    maStatusText = `السعر يحاول تأكيد الاستقرار أعلى من متوسط 20 (${m20Val.toFixed(2)})`;
    score += 1;
  } else {
    trendType = 'neutral';
    trendText = 'حركة عرضية وتذبذب حول المتوسطات السعرية';
    maStatusText = `تذبذب متقارب بين متوسط 20 (${m20Val.toFixed(2)}) ومتوسط 50 (${m50Val.toFixed(2)})`;
  }

  // Golden cross / Death cross detection within last 12 bars
  let crossEvent = '';
  for (let k = Math.max(50, N - 12); k < N; k++) {
    const prevDiff = (ma20[k - 1] || 0) - (ma50[k - 1] || 0);
    const currDiff = (ma20[k] || 0) - (ma50[k] || 0);
    if (prevDiff <= 0 && currDiff > 0) {
      crossEvent = '⚡ تقاطع ذهبي إيجابي: اختراق متوسط 20 لمتوسط 50 صعوداً';
      score += 2;
      break;
    }
    if (prevDiff >= 0 && currDiff < 0) {
      crossEvent = '⚠️ تقاطع الموت السلبي: كسر متوسط 20 لمتوسط 50 هبوطاً';
      score -= 2;
      break;
    }
  }

  // 2. RSI Analysis
  let rsiText = '';
  let rsiSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (rsiVal >= 70) {
    rsiText = `تشبع شرائي مرتفع (${rsiVal.toFixed(1)}) — احتمال تهدئة أو جني أرباح`;
    rsiSignal = 'neutral';
    score -= 1;
  } else if (rsiVal <= 30) {
    rsiText = `تشبع بيعي حاد (${rsiVal.toFixed(1)}) — ارتداد مضاربي متوقع`;
    rsiSignal = 'bullish';
    score += 2;
  } else if (rsiVal >= 55) {
    rsiText = `قوة وزخم إيجابي متصاعد (${rsiVal.toFixed(1)}) دون إفراط شرائي`;
    rsiSignal = 'bullish';
    score += 2;
  } else if (rsiVal <= 45) {
    rsiText = `زخم سلبي ضعيف (${rsiVal.toFixed(1)}) تحت مستوى 50`;
    rsiSignal = 'bearish';
    score -= 1;
  } else {
    rsiText = `مستوى محايد ومتوازن (${rsiVal.toFixed(1)})`;
    rsiSignal = 'neutral';
  }

  // 3. MACD Analysis
  let macdText = '';
  let macdSignal: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (macdVal) {
    if (macdVal.histogram > 0 && macdVal.macd > macdVal.signal) {
      macdText = `إشارة إيجابية — خط الماكد أعلى من خط الإشارة (+${macdVal.histogram.toFixed(2)})`;
      macdSignal = 'bullish';
      score += 2;
    } else if (macdVal.histogram < 0 && macdVal.macd < macdVal.signal) {
      macdText = `إشارة سلبية — خط الماكد أسفل خط الإشارة (${macdVal.histogram.toFixed(2)})`;
      macdSignal = 'bearish';
      score -= 2;
    } else {
      macdText = `تقارب خطوط الماكد بانتظار إشارة تأكيد`;
      macdSignal = 'neutral';
    }
  } else {
    macdText = 'جاري احتساب الماكد';
  }

  // 4. Bollinger Bands Analysis
  let bbText = 'نطاق سعري معتدل';
  if (bbVal) {
    const range = bbVal.upper - bbVal.lower;
    const bandPos = (currentPrice - bbVal.lower) / (range || 1);
    if (bandPos >= 0.95) {
      bbText = `ملامسة الحد العلوي (${bbVal.upper.toFixed(2)}) — اندفاع شرائي قوي`;
      score += 1;
    } else if (bandPos <= 0.05) {
      bbText = `ملامسة الحد السفلي (${bbVal.lower.toFixed(2)}) — اختبار دعم القناة`;
    } else {
      bbText = `داخل نطاق بولنجر (${bbVal.lower.toFixed(2)} - ${bbVal.upper.toFixed(2)}) عند ${(bandPos * 100).toFixed(0)}%`;
    }
  }

  // 5. Volume Analysis (compared to 20-day average)
  const volSlice = candles.slice(-21, -1);
  const avgVol = volSlice.reduce((s, b) => s + b.v, 0) / (volSlice.length || 1);
  const volRatio = last.v / (avgVol || 1);
  let volText = '';

  if (volRatio >= 1.6) {
    volText = `أحجام تداول مرتفعة جداً (${volRatio.toFixed(1)} ضعف المتوسط) تؤكد جدية الحركة`;
    score += last.c >= last.o ? 2 : -2;
  } else if (volRatio >= 1.1) {
    volText = `نشاط تداول نشط أعلى من المعتاد (${volRatio.toFixed(1)}x)`;
  } else {
    volText = `سيولة هادئة (${volRatio.toFixed(1)}x متوسط 20 جلسة)`;
  }

  // 6. Support & Resistance (Classic Pivots based on previous candle)
  const high = prev.h;
  const low = prev.l;
  const close = prev.c;
  const pivot = +((high + low + close) / 3).toFixed(2);
  const r1 = +(2 * pivot - low).toFixed(2);
  const s1 = +(2 * pivot - high).toFixed(2);
  const r2 = +(pivot + (high - low)).toFixed(2);
  const s2 = +(pivot - (high - low)).toFixed(2);

  // 20-session high / low
  const window20 = candles.slice(-20);
  const res20 = Math.max(...window20.map(b => b.h));
  const sup20 = Math.min(...window20.map(b => b.l));

  // Calculated Stop Loss and Target
  const atr = Math.max(last.h - last.l, Math.abs(last.h - prev.c), Math.abs(last.l - prev.c));
  const stopLoss = +(currentPrice - atr * 1.5).toFixed(2);
  const targetPrice = +(currentPrice + atr * 2.5).toFixed(2);

  // Determine overall signal
  let overallSignal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell' = 'neutral';
  if (score >= 5) overallSignal = 'strong_buy';
  else if (score >= 2) overallSignal = 'buy';
  else if (score <= -5) overallSignal = 'strong_sell';
  else if (score <= -2) overallSignal = 'sell';
  else overallSignal = 'neutral';

  return {
    trend: trendText,
    trendType,
    maStatus: maStatusText,
    goldenCross: crossEvent || undefined,
    rsiValue: rsiVal,
    rsiStatus: rsiText,
    rsiSignal,
    macdStatus: macdText,
    macdSignal,
    bollingerStatus: bbText,
    volumeStatus: volText,
    support: sup20,
    resistance: res20,
    pivot,
    s1,
    s2,
    r1,
    r2,
    stopLoss,
    targetPrice,
    overallSignal,
    overallScore: score
  };
}
