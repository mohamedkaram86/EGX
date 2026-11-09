import { Candle, StockItem, Timeframe } from '../types/market';

export const INITIAL_EGX_STOCKS: StockItem[] = [
  // Indices
  {
    id: 'EGX30',
    symbol: 'EGX30',
    nameAr: 'المؤشر الرئيسي المصري EGX 30',
    nameEn: 'EGX 30 Index',
    currentPrice: 50751.07,
    isIndex: true,
    reutersRic: '.EGX30',
    changePercent: -0.78,
    changeValue: -400.12,
    high24h: 51220.40,
    low24h: 50610.15,
    volume: 184500000,
    turnoverEGP: 3820000000,
    sector: 'مؤشرات السوق',
    dateStr: '2026-11-08'
  },
  {
    id: 'EGX33',
    symbol: 'EGX33',
    nameAr: 'مؤشر الشريعة الإسلامي EGX 33 Shariah',
    nameEn: 'EGX 33 Shariah Index',
    currentPrice: 6110.64,
    isIndex: true,
    reutersRic: '.EGX33',
    changePercent: 0.92,
    changeValue: 55.70,
    high24h: 6140.20,
    low24h: 6045.10,
    volume: 72000000,
    turnoverEGP: 1250000000,
    sector: 'مؤشرات السوق'
  },
  {
    id: 'EGX35LV',
    symbol: 'EGX35LV',
    nameAr: 'مؤشر EGX 35 منخفض التذبذب',
    nameEn: 'EGX 35 Low Volatility',
    currentPrice: 5918.80,
    isIndex: true,
    reutersRic: '.EGX35LV',
    changePercent: 1.77,
    changeValue: 102.94,
    high24h: 5940.00,
    low24h: 5820.30,
    volume: 45000000,
    turnoverEGP: 890000000,
    sector: 'مؤشرات السوق'
  },
  {
    id: 'EGX70',
    symbol: 'EGX70',
    nameAr: 'مؤشر EGX 70 EWI للشركات المتوسطة والصغيرة',
    nameEn: 'EGX 70 Equal Weight Index',
    currentPrice: 17567.23,
    isIndex: true,
    reutersRic: '.EGX70EWI',
    changePercent: 2.42,
    changeValue: 415.11,
    high24h: 17620.50,
    low24h: 17180.00,
    volume: 245000000,
    turnoverEGP: 2150000000,
    sector: 'مؤشرات السوق'
  },
  {
    id: 'EGX100',
    symbol: 'EGX100',
    nameAr: 'مؤشر EGX 100 EWI الأوسع نطاقاً',
    nameEn: 'EGX 100 Equal Weight Index',
    currentPrice: 23461.29,
    isIndex: true,
    reutersRic: '.EGX100EWI',
    changePercent: 1.96,
    changeValue: 450.95,
    high24h: 23550.00,
    low24h: 23040.20,
    volume: 380000000,
    turnoverEGP: 4800000000,
    sector: 'مؤشرات السوق'
  },

  // Blue Chips & Stocks
  {
    id: 'COMI',
    symbol: 'COMI',
    nameAr: 'البنك التجاري الدولي - مصر (CIB)',
    nameEn: 'Commercial International Bank',
    currentPrice: 81.20,
    isIndex: false,
    reutersRic: 'COMI.CA',
    changePercent: 0.74,
    changeValue: 0.60,
    high24h: 81.90,
    low24h: 80.50,
    volume: 12450000,
    turnoverEGP: 1010940000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'TMGH',
    symbol: 'TMGH',
    nameAr: 'مجموعة طلعت مصطفى القابضة',
    nameEn: 'Talaat Moustafa Group Holding',
    currentPrice: 58.00,
    isIndex: false,
    reutersRic: 'TMGH.CA',
    changePercent: -1.16,
    changeValue: -0.68,
    high24h: 59.20,
    low24h: 57.50,
    volume: 9800000,
    turnoverEGP: 568400000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'HRHO',
    symbol: 'HRHO',
    nameAr: 'مجموعة إي إف جي القابضة (هيرميس)',
    nameEn: 'EFG Holding',
    currentPrice: 21.55,
    isIndex: false,
    reutersRic: 'HRHO.CA',
    changePercent: 1.56,
    changeValue: 0.33,
    high24h: 21.90,
    low24h: 21.10,
    volume: 6400000,
    turnoverEGP: 137920000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'EAST',
    symbol: 'EAST',
    nameAr: 'الشرقية - إيسترن كومباني',
    nameEn: 'Eastern Company',
    currentPrice: 21.80,
    isIndex: false,
    reutersRic: 'EAST.CA',
    changePercent: 2.64,
    changeValue: 0.56,
    high24h: 22.20,
    low24h: 21.20,
    volume: 4200000,
    turnoverEGP: 91560000,
    sector: 'سلع استهلاكية'
  },
  {
    id: 'SWDY',
    symbol: 'SWDY',
    nameAr: 'السويدي إليكتريك',
    nameEn: 'Elsewedy Electric',
    currentPrice: 47.69,
    isIndex: false,
    reutersRic: 'SWDY.CA',
    changePercent: 0.44,
    changeValue: 0.21,
    high24h: 48.20,
    low24h: 47.10,
    volume: 3850000,
    turnoverEGP: 183606500,
    sector: 'صناعة وكهرباء'
  },
  {
    id: 'ETEL',
    symbol: 'ETEL',
    nameAr: 'المصرية للاتصالات (WE)',
    nameEn: 'Telecom Egypt',
    currentPrice: 32.77,
    isIndex: false,
    reutersRic: 'ETEL.CA',
    changePercent: 0.99,
    changeValue: 0.32,
    high24h: 33.20,
    low24h: 32.40,
    volume: 2900000,
    turnoverEGP: 95033000,
    sector: 'اتصالات وتكنولوجيا'
  },
  {
    id: 'ABUK',
    symbol: 'ABUK',
    nameAr: 'أبو قير للأسمدة والصناعات الكيماوية',
    nameEn: 'Abu Qir Fertilizers',
    currentPrice: 58.32,
    isIndex: false,
    reutersRic: 'ABUK.CA',
    changePercent: -1.24,
    changeValue: -0.73,
    high24h: 59.10,
    low24h: 58.00,
    volume: 3100000,
    turnoverEGP: 180792000,
    sector: 'أسمدة وبتروكيماويات'
  },
  {
    id: 'FWRY',
    symbol: 'FWRY',
    nameAr: 'فوري لتكنولوجيا البنوك والمدفوعات الإلكترونية',
    nameEn: 'Fawry for Banking & Payment Technology',
    currentPrice: 6.82,
    isIndex: false,
    reutersRic: 'FWRY.CA',
    changePercent: 1.04,
    changeValue: 0.07,
    high24h: 6.92,
    low24h: 6.74,
    volume: 18500000,
    turnoverEGP: 126170000,
    sector: 'اتصالات وتكنولوجيا'
  },
  {
    id: 'ORWE',
    symbol: 'ORWE',
    nameAr: 'النساجون الشرقيون للسجاد',
    nameEn: 'Oriental Weavers',
    currentPrice: 25.01,
    isIndex: false,
    reutersRic: 'ORWE.CA',
    changePercent: 3.05,
    changeValue: 0.74,
    high24h: 25.40,
    low24h: 24.20,
    volume: 1650000,
    turnoverEGP: 41266500,
    sector: 'منسوجات وسلع معمرة'
  },
  {
    id: 'PHDC',
    symbol: 'PHDC',
    nameAr: 'بالم هيلز للتعمير',
    nameEn: 'Palm Hills Developments',
    currentPrice: 4.72,
    isIndex: false,
    reutersRic: 'PHDC.CA',
    changePercent: 0.43,
    changeValue: 0.02,
    high24h: 4.78,
    low24h: 4.68,
    volume: 24000000,
    turnoverEGP: 113280000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'EFIH',
    symbol: 'EFIH',
    nameAr: 'إي فاينانس للاستثمارات المالية والرقمية',
    nameEn: 'e-finance for Digital & Financial Investments',
    currentPrice: 25.15,
    isIndex: false,
    reutersRic: 'EFIH.CA',
    changePercent: 0.60,
    changeValue: 0.15,
    high24h: 25.50,
    low24h: 24.90,
    volume: 3800000,
    turnoverEGP: 95570000,
    sector: 'اتصالات وتكنولوجيا'
  },
  {
    id: 'ALCN',
    symbol: 'ALCN',
    nameAr: 'الإسكندرية لتداول الحاويات والبضائع',
    nameEn: 'Alexandria Containers & Goods',
    currentPrice: 46.40,
    isIndex: false,
    reutersRic: 'ALCN.CA',
    changePercent: -0.15,
    changeValue: -0.07,
    high24h: 47.00,
    low24h: 46.20,
    volume: 2100000,
    turnoverEGP: 97440000,
    sector: 'نقل وشحن ولوجستيات'
  },
  {
    id: 'EGAL',
    symbol: 'EGAL',
    nameAr: 'مصر للألومنيوم',
    nameEn: 'Egypt Aluminum',
    currentPrice: 103.05,
    isIndex: false,
    reutersRic: 'EGAL.CA',
    changePercent: -0.82,
    changeValue: -0.85,
    high24h: 104.50,
    low24h: 102.50,
    volume: 850000,
    turnoverEGP: 87592500,
    sector: 'موارد أساسية وتعدين'
  },
  {
    id: 'ORAS',
    symbol: 'ORAS',
    nameAr: 'أوراسكوم للإنشاءات بي إل سي',
    nameEn: 'Orascom Construction PLC',
    currentPrice: 71.05,
    isIndex: false,
    reutersRic: 'ORAS.CA',
    changePercent: 0.00,
    changeValue: 0.00,
    high24h: 72.00,
    low24h: 70.80,
    volume: 420000,
    turnoverEGP: 29841000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'MFPC',
    symbol: 'MFPC',
    nameAr: 'مصر لإنتاج الأسمدة (موبكو)',
    nameEn: 'Misr Fertilizers Production (MOPCO)',
    currentPrice: 43.80,
    isIndex: false,
    reutersRic: 'MFPC.CA',
    changePercent: 2.05,
    changeValue: 0.88,
    high24h: 44.20,
    low24h: 42.80,
    volume: 4800000,
    turnoverEGP: 210240000,
    sector: 'أسمدة وبتروكيماويات'
  },
  {
    id: 'HELI',
    symbol: 'HELI',
    nameAr: 'مصر الجديدة للإسكان والتعمير',
    nameEn: 'Heliopolis Housing',
    currentPrice: 12.45,
    isIndex: false,
    reutersRic: 'HELI.CA',
    changePercent: 1.88,
    changeValue: 0.23,
    high24h: 12.65,
    low24h: 12.15,
    volume: 11200000,
    turnoverEGP: 139440000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'ESRS',
    symbol: 'ESRS',
    nameAr: 'حديد عز',
    nameEn: 'Ezz Steel',
    currentPrice: 148.50,
    isIndex: false,
    reutersRic: 'ESRS.CA',
    changePercent: 2.13,
    changeValue: 3.10,
    high24h: 151.00,
    low24h: 145.00,
    volume: 2450000,
    turnoverEGP: 363825000,
    sector: 'موارد أساسية وتعدين'
  },
  {
    id: 'ISPH',
    symbol: 'ISPH',
    nameAr: 'ابن سينا فارما',
    nameEn: 'Ibnsina Pharma',
    currentPrice: 3.82,
    isIndex: false,
    reutersRic: 'ISPH.CA',
    changePercent: -0.52,
    changeValue: -0.02,
    high24h: 3.90,
    low24h: 3.78,
    volume: 16500000,
    turnoverEGP: 63030000,
    sector: 'رعاية صحية وأدوية'
  },
  {
    id: 'CIEB',
    symbol: 'CIEB',
    nameAr: 'بنك كريدي أجريكول مصر',
    nameEn: 'Credit Agricole Egypt',
    currentPrice: 24.15,
    isIndex: false,
    reutersRic: 'CIEB.CA',
    changePercent: 0.84,
    changeValue: 0.20,
    high24h: 24.40,
    low24h: 23.90,
    volume: 1800000,
    turnoverEGP: 43470000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'ADIB',
    symbol: 'ADIB',
    nameAr: 'مصرف أبو ظبي الإسلامي - مصر',
    nameEn: 'Abu Dhabi Islamic Bank Egypt',
    currentPrice: 49.80,
    isIndex: false,
    reutersRic: 'ADIB.CA',
    changePercent: 1.63,
    changeValue: 0.80,
    high24h: 50.50,
    low24h: 48.90,
    volume: 2200000,
    turnoverEGP: 109560000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'QNBA',
    symbol: 'QNBA',
    nameAr: 'بنك قطر الوطني الأهلي (QNB الأهلي)',
    nameEn: 'Qatar National Bank Alahli',
    currentPrice: 38.40,
    isIndex: false,
    reutersRic: 'QNBA.CA',
    changePercent: 0.79,
    changeValue: 0.30,
    high24h: 38.90,
    low24h: 37.80,
    volume: 1450000,
    turnoverEGP: 55680000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'FAIT',
    symbol: 'FAIT',
    nameAr: 'بنك فيصل الإسلامي المصري (بالجنيه)',
    nameEn: 'Faisal Islamic Bank of Egypt',
    currentPrice: 36.20,
    isIndex: false,
    reutersRic: 'FAIT.CA',
    changePercent: -0.28,
    changeValue: -0.10,
    high24h: 36.60,
    low24h: 35.90,
    volume: 980000,
    turnoverEGP: 35476000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'CANA',
    symbol: 'CANA',
    nameAr: 'بنك قناة السويس',
    nameEn: 'Suez Canal Bank',
    currentPrice: 17.50,
    isIndex: false,
    reutersRic: 'CANA.CA',
    changePercent: 1.16,
    changeValue: 0.20,
    high24h: 17.80,
    low24h: 17.20,
    volume: 1250000,
    turnoverEGP: 21875000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'EXPA',
    symbol: 'EXPA',
    nameAr: 'البنك المصري لتنمية الصادرات (EBank)',
    nameEn: 'Export Development Bank of Egypt',
    currentPrice: 22.80,
    isIndex: false,
    reutersRic: 'EXPA.CA',
    changePercent: 1.79,
    changeValue: 0.40,
    high24h: 23.10,
    low24h: 22.30,
    volume: 2100000,
    turnoverEGP: 47880000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'BTFH',
    symbol: 'BTFH',
    nameAr: 'بلتون المالية القابضة',
    nameEn: 'Beltone Financial Holding',
    currentPrice: 3.42,
    isIndex: false,
    reutersRic: 'BTFH.CA',
    changePercent: 2.70,
    changeValue: 0.09,
    high24h: 3.50,
    low24h: 3.31,
    volume: 48500000,
    turnoverEGP: 165870000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'CCAP',
    symbol: 'CCAP',
    nameAr: 'شركة القلعة للاستشارات المالية',
    nameEn: 'Qalaa Holdings',
    currentPrice: 2.18,
    isIndex: false,
    reutersRic: 'CCAP.CA',
    changePercent: 1.87,
    changeValue: 0.04,
    high24h: 2.24,
    low24h: 2.12,
    volume: 38200000,
    turnoverEGP: 83276000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'BINV',
    symbol: 'BINV',
    nameAr: 'بي إنفستمنتس القابضة',
    nameEn: 'B Investments Holding',
    currentPrice: 21.60,
    isIndex: false,
    reutersRic: 'BINV.CA',
    changePercent: 0.93,
    changeValue: 0.20,
    high24h: 22.10,
    low24h: 21.30,
    volume: 1650000,
    turnoverEGP: 35640000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'CIIC',
    symbol: 'CIIC',
    nameAr: 'سي آي كابيتال القابضة',
    nameEn: 'CI Capital Holding',
    currentPrice: 6.85,
    isIndex: false,
    reutersRic: 'CIIC.CA',
    changePercent: 0.44,
    changeValue: 0.03,
    high24h: 6.98,
    low24h: 6.75,
    volume: 2400000,
    turnoverEGP: 16440000,
    sector: 'بنوك وخدمات مالية'
  },

  // Real Estate & Construction
  {
    id: 'MNHD',
    symbol: 'MNHD',
    nameAr: 'مدينة مصر للإسكان والتعمير',
    nameEn: 'Madinet Masr for Housing & Development',
    currentPrice: 4.88,
    isIndex: false,
    reutersRic: 'MNHD.CA',
    changePercent: 2.52,
    changeValue: 0.12,
    high24h: 4.95,
    low24h: 4.74,
    volume: 29000000,
    turnoverEGP: 141520000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'OCDI',
    symbol: 'OCDI',
    nameAr: 'السادس من أكتوبر للتنمية والاستثمار (سوديك)',
    nameEn: 'Sixth of October Development (SODIC)',
    currentPrice: 58.50,
    isIndex: false,
    reutersRic: 'OCDI.CA',
    changePercent: 1.39,
    changeValue: 0.80,
    high24h: 59.40,
    low24h: 57.50,
    volume: 1850000,
    turnoverEGP: 108225000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'EMFD',
    symbol: 'EMFD',
    nameAr: 'إعمار مصر للتنمية',
    nameEn: 'Emaar Misr for Development',
    currentPrice: 6.95,
    isIndex: false,
    reutersRic: 'EMFD.CA',
    changePercent: 1.91,
    changeValue: 0.13,
    high24h: 7.08,
    low24h: 6.80,
    volume: 14200000,
    turnoverEGP: 98690000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'ORHD',
    symbol: 'ORHD',
    nameAr: 'أوراسكوم للتنمية مصر',
    nameEn: 'Orascom Development Egypt',
    currentPrice: 16.40,
    isIndex: false,
    reutersRic: 'ORHD.CA',
    changePercent: 0.61,
    changeValue: 0.10,
    high24h: 16.70,
    low24h: 16.15,
    volume: 2800000,
    turnoverEGP: 45920000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'AMER',
    symbol: 'AMER',
    nameAr: 'مجموعة عامر القابضة (عامر جروب)',
    nameEn: 'Amer Group Holding',
    currentPrice: 0.95,
    isIndex: false,
    reutersRic: 'AMER.CA',
    changePercent: 3.26,
    changeValue: 0.03,
    high24h: 0.98,
    low24h: 0.91,
    volume: 34000000,
    turnoverEGP: 32300000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'ARAB',
    symbol: 'ARAB',
    nameAr: 'المطورون العرب القابضة',
    nameEn: 'Arab Developers Holding',
    currentPrice: 0.74,
    isIndex: false,
    reutersRic: 'ARAB.CA',
    changePercent: -1.33,
    changeValue: -0.01,
    high24h: 0.77,
    low24h: 0.72,
    volume: 42000000,
    turnoverEGP: 31080000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'UNIT',
    symbol: 'UNIT',
    nameAr: 'المتحدة للإسكان والتعمير',
    nameEn: 'United Housing & Development',
    currentPrice: 6.75,
    isIndex: false,
    reutersRic: 'UNIT.CA',
    changePercent: 1.50,
    changeValue: 0.10,
    high24h: 6.88,
    low24h: 6.62,
    volume: 3100000,
    turnoverEGP: 20925000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'ZEOT',
    symbol: 'ZEOT',
    nameAr: 'العربية للأسمنت',
    nameEn: 'Arabian Cement Company',
    currentPrice: 19.80,
    isIndex: false,
    reutersRic: 'ARAC.CA',
    changePercent: 1.02,
    changeValue: 0.20,
    high24h: 20.10,
    low24h: 19.50,
    volume: 1200000,
    turnoverEGP: 23760000,
    sector: 'عقارات وإنشاءات'
  },
  {
    id: 'MCQE',
    symbol: 'MCQE',
    nameAr: 'مصر للأسمنت - قنا',
    nameEn: 'Misr Cement - Qena',
    currentPrice: 28.50,
    isIndex: false,
    reutersRic: 'MCQE.CA',
    changePercent: 0.71,
    changeValue: 0.20,
    high24h: 29.00,
    low24h: 28.10,
    volume: 750000,
    turnoverEGP: 21375000,
    sector: 'عقارات وإنشاءات'
  },

  // Fertilizers & Petrochemicals
  {
    id: 'SKPC',
    symbol: 'SKPC',
    nameAr: 'سيدي كرير للبتروكيماويات (سيدبك)',
    nameEn: 'Sidi Kerir Petrochemicals',
    currentPrice: 32.75,
    isIndex: false,
    reutersRic: 'SKPC.CA',
    changePercent: 2.02,
    changeValue: 0.65,
    high24h: 33.20,
    low24h: 31.90,
    volume: 7600000,
    turnoverEGP: 248900000,
    sector: 'أسمدة وبتروكيماويات'
  },
  {
    id: 'AMOC',
    symbol: 'AMOC',
    nameAr: 'الإسكندرية للزيوت المعدنية (أموك)',
    nameEn: 'Alexandria Mineral Oils (AMOC)',
    currentPrice: 11.20,
    isIndex: false,
    reutersRic: 'AMOC.CA',
    changePercent: 1.36,
    changeValue: 0.15,
    high24h: 11.45,
    low24h: 11.00,
    volume: 14500000,
    turnoverEGP: 162400000,
    sector: 'أسمدة وبتروكيماويات'
  },
  {
    id: 'KIMA',
    symbol: 'KIMA',
    nameAr: 'الصناعات الكيماوية المصرية (كيما)',
    nameEn: 'Egyptian Chemical Industries (KIMA)',
    currentPrice: 13.85,
    isIndex: false,
    reutersRic: 'KIMA.CA',
    changePercent: 1.84,
    changeValue: 0.25,
    high24h: 14.10,
    low24h: 13.55,
    volume: 6800000,
    turnoverEGP: 94180000,
    sector: 'أسمدة وبتروكيماويات'
  },
  {
    id: 'PACH',
    symbol: 'PACH',
    nameAr: 'البويات والصناعات الكيماوية (باكين)',
    nameEn: 'Paints & Chemical Industries (Pachin)',
    currentPrice: 42.10,
    isIndex: false,
    reutersRic: 'PACH.CA',
    changePercent: 0.48,
    changeValue: 0.20,
    high24h: 42.70,
    low24h: 41.60,
    volume: 420000,
    turnoverEGP: 17682000,
    sector: 'أسمدة وبتروكيماويات'
  },

  // Food, Beverages & Agribusiness
  {
    id: 'JUFO',
    symbol: 'JUFO',
    nameAr: 'جهينة للصناعات الغذائية',
    nameEn: 'Juhayna Food Industries',
    currentPrice: 28.90,
    isIndex: false,
    reutersRic: 'JUFO.CA',
    changePercent: 1.76,
    changeValue: 0.50,
    high24h: 29.30,
    low24h: 28.20,
    volume: 3100000,
    turnoverEGP: 89590000,
    sector: 'أغذية ومشروبات'
  },
  {
    id: 'DOMT',
    symbol: 'DOMT',
    nameAr: 'الصناعات الغذائية العربية (دومتي)',
    nameEn: 'Arabian Food Industries (Domty)',
    currentPrice: 20.45,
    isIndex: false,
    reutersRic: 'DOMT.CA',
    changePercent: 0.74,
    changeValue: 0.15,
    high24h: 20.80,
    low24h: 20.10,
    volume: 1850000,
    turnoverEGP: 37832500,
    sector: 'أغذية ومشروبات'
  },
  {
    id: 'OBUR',
    symbol: 'OBUR',
    nameAr: 'عبور لاند للصناعات الغذائية',
    nameEn: 'Obour Land for Food Industries',
    currentPrice: 14.80,
    isIndex: false,
    reutersRic: 'OBUR.CA',
    changePercent: 1.02,
    changeValue: 0.15,
    high24h: 15.10,
    low24h: 14.50,
    volume: 2400000,
    turnoverEGP: 35520000,
    sector: 'أغذية ومشروبات'
  },
  {
    id: 'EFID',
    symbol: 'EFID',
    nameAr: 'إيديتا للصناعات الغذائية',
    nameEn: 'Edita Food Industries',
    currentPrice: 34.60,
    isIndex: false,
    reutersRic: 'EFID.CA',
    changePercent: -0.57,
    changeValue: -0.20,
    high24h: 35.10,
    low24h: 34.20,
    volume: 1100000,
    turnoverEGP: 38060000,
    sector: 'أغذية ومشروبات'
  },
  {
    id: 'DAPH',
    symbol: 'DAPH',
    nameAr: 'الدلتا للسكر',
    nameEn: 'Delta Sugar',
    currentPrice: 72.50,
    isIndex: false,
    reutersRic: 'SUGR.CA',
    changePercent: 1.40,
    changeValue: 1.00,
    high24h: 73.80,
    low24h: 71.00,
    volume: 950000,
    turnoverEGP: 68875000,
    sector: 'أغذية ومشروبات'
  },
  {
    id: 'CAFM',
    symbol: 'CAFM',
    nameAr: 'القاهرة للدواجن',
    nameEn: 'Cairo Poultry',
    currentPrice: 11.85,
    isIndex: false,
    reutersRic: 'POUL.CA',
    changePercent: 2.16,
    changeValue: 0.25,
    high24h: 12.05,
    low24h: 11.50,
    volume: 3800000,
    turnoverEGP: 45030000,
    sector: 'أغذية ومشروبات'
  },

  // Automotive, Cables & Industrial
  {
    id: 'AUTO',
    symbol: 'AUTO',
    nameAr: 'جي بي كوربوريشن (غبور أوتو)',
    nameEn: 'GB Corp (Ghabbour Auto)',
    currentPrice: 15.70,
    isIndex: false,
    reutersRic: 'AUTO.CA',
    changePercent: 1.95,
    changeValue: 0.30,
    high24h: 16.00,
    low24h: 15.30,
    volume: 4900000,
    turnoverEGP: 76930000,
    sector: 'صناعة وسيارات'
  },
  {
    id: 'MTIE',
    symbol: 'MTIE',
    nameAr: 'إم إم جروب للصناعة والتجارة العالمية',
    nameEn: 'MM Group for Industry & International Trade',
    currentPrice: 9.45,
    isIndex: false,
    reutersRic: 'MTIE.CA',
    changePercent: 1.28,
    changeValue: 0.12,
    high24h: 9.65,
    low24h: 9.25,
    volume: 5200000,
    turnoverEGP: 49140000,
    sector: 'صناعة وسيارات'
  },
  {
    id: 'EKHO',
    symbol: 'EKHO',
    nameAr: 'القابضة المصرية الكويتية (بالجنيه)',
    nameEn: 'Egypt Kuwait Holding (EGP)',
    currentPrice: 46.20,
    isIndex: false,
    reutersRic: 'EKHO.CA',
    changePercent: 0.87,
    changeValue: 0.40,
    high24h: 46.80,
    low24h: 45.60,
    volume: 1600000,
    turnoverEGP: 73920000,
    sector: 'صناعة وسيارات'
  },
  {
    id: 'ECAP',
    symbol: 'ECAP',
    nameAr: 'العز للسيراميك والبورسلين (الجوهرة)',
    nameEn: 'Al Ezz Ceramics & Porcelain (Gemma)',
    currentPrice: 26.80,
    isIndex: false,
    reutersRic: 'ECAP.CA',
    changePercent: 1.13,
    changeValue: 0.30,
    high24h: 27.20,
    low24h: 26.30,
    volume: 1350000,
    turnoverEGP: 36180000,
    sector: 'صناعة وسيارات'
  },

  // Healthcare & Pharma
  {
    id: 'RMDA',
    symbol: 'RMDA',
    nameAr: 'العاشر من رمضان للصناعات الدوائية (راميدا)',
    nameEn: 'Rameda Pharmaceuticals',
    currentPrice: 2.85,
    isIndex: false,
    reutersRic: 'RMDA.CA',
    changePercent: 1.42,
    changeValue: 0.04,
    high24h: 2.92,
    low24h: 2.78,
    volume: 12000000,
    turnoverEGP: 34200000,
    sector: 'رعاية صحية وأدوية'
  },
  {
    id: 'EIPICO',
    symbol: 'PHAR',
    nameAr: 'المصرية الدولية للصناعات الدوائية (إيبيكو)',
    nameEn: 'Egyptian International Pharmaceutical (EIPICO)',
    currentPrice: 51.50,
    isIndex: false,
    reutersRic: 'PHAR.CA',
    changePercent: 0.59,
    changeValue: 0.30,
    high24h: 52.20,
    low24h: 50.80,
    volume: 850000,
    turnoverEGP: 43775000,
    sector: 'رعاية صحية وأدوية'
  },
  {
    id: 'CLHO',
    symbol: 'CLHO',
    nameAr: 'مجموعة مستشفيات كليوباترا',
    nameEn: 'Cleopatra Hospital Group',
    currentPrice: 7.20,
    isIndex: false,
    reutersRic: 'CLHO.CA',
    changePercent: 0.98,
    changeValue: 0.07,
    high24h: 7.35,
    low24h: 7.05,
    volume: 3600000,
    turnoverEGP: 25920000,
    sector: 'رعاية صحية وأدوية'
  },

  // Technology & Telecom
  {
    id: 'RAYA',
    symbol: 'RAYA',
    nameAr: 'راية القابضة للتكنولوجيا والاتصالات',
    nameEn: 'Raya Holding for Financial Investments',
    currentPrice: 4.15,
    isIndex: false,
    reutersRic: 'RAYA.CA',
    changePercent: 2.22,
    changeValue: 0.09,
    high24h: 4.24,
    low24h: 4.02,
    volume: 8400000,
    turnoverEGP: 34860000,
    sector: 'اتصالات وتكنولوجيا'
  },
  {
    id: 'RACC',
    symbol: 'RACC',
    nameAr: 'راية لخدمات مراكز الاتصالات',
    nameEn: 'Raya Contact Center',
    currentPrice: 5.60,
    isIndex: false,
    reutersRic: 'RACC.CA',
    changePercent: 0.90,
    changeValue: 0.05,
    high24h: 5.75,
    low24h: 5.48,
    volume: 2100000,
    turnoverEGP: 11760000,
    sector: 'اتصالات وتكنولوجيا'
  },

  // Tourism & Logistics
  {
    id: 'EGTS',
    symbol: 'EGTS',
    nameAr: 'المصرية للمنتجعات السياحية',
    nameEn: 'Egyptian Resorts Company',
    currentPrice: 5.82,
    isIndex: false,
    reutersRic: 'EGTS.CA',
    changePercent: 2.83,
    changeValue: 0.16,
    high24h: 5.95,
    low24h: 5.62,
    volume: 16500000,
    turnoverEGP: 96030000,
    sector: 'سياحة وفنادق وترفيه'
  },
  {
    id: 'SHUAA',
    symbol: 'SHUAA',
    nameAr: 'الشمس للفنادق والمنشآت السياحية',
    nameEn: 'Al Shams Hotels & Tourism',
    currentPrice: 9.10,
    isIndex: false,
    reutersRic: 'SHUAA.CA',
    changePercent: 1.11,
    changeValue: 0.10,
    high24h: 9.30,
    low24h: 8.90,
    volume: 1450000,
    turnoverEGP: 13195000,
    sector: 'سياحة وفنادق وترفيه'
  },
  {
    id: 'CUTR',
    symbol: 'CUTR',
    nameAr: 'القناة للتوكيلات الملاحية',
    nameEn: 'Canal Shipping Agencies',
    currentPrice: 26.40,
    isIndex: false,
    reutersRic: 'CSAG.CA',
    changePercent: 1.54,
    changeValue: 0.40,
    high24h: 26.90,
    low24h: 25.80,
    volume: 1100000,
    turnoverEGP: 29040000,
    sector: 'نقل وشحن ولوجستيات'
  },
  {
    id: 'BDC',
    symbol: 'BDC',
    nameAr: 'بنك القاهرة',
    nameEn: 'Banque du Caire',
    currentPrice: 28.50,
    isIndex: false,
    reutersRic: 'BDC.CA',
    changePercent: 2.15,
    changeValue: 0.60,
    high24h: 29.20,
    low24h: 27.90,
    volume: 12500000,
    turnoverEGP: 356250000,
    sector: 'بنوك وخدمات مالية'
  },
  {
    id: 'HALAN',
    symbol: 'HALAN',
    nameAr: 'شركة إم إن تي حالا (MNT-Halan)',
    nameEn: 'MNT-Halan FinTech & Microfinance',
    currentPrice: 19.40,
    isIndex: false,
    reutersRic: 'HALAN.CA',
    changePercent: 3.47,
    changeValue: 0.65,
    high24h: 19.85,
    low24h: 18.70,
    volume: 21400000,
    turnoverEGP: 415160000,
    sector: 'اتصالات وتكنولوجيا'
  },
  {
    id: 'CNFN',
    symbol: 'CNFN',
    nameAr: 'كونتكت المالية القابضة',
    nameEn: 'Contact Financial Holding',
    currentPrice: 4.65,
    isIndex: false,
    reutersRic: 'CNFN.CA',
    changePercent: 1.31,
    changeValue: 0.06,
    high24h: 4.75,
    low24h: 4.55,
    volume: 5800000,
    turnoverEGP: 26970000,
    sector: 'بنوك وخدمات مالية'
  }
];

// Seeded pseudorandom generator for deterministic, consistent stock history
function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate historical daily candles following the Egyptian Exchange schedule:
 * Sunday - Thursday trading sessions (Friday & Saturday are weekends).
 */
export function generateCandlesForStock(stock: StockItem, numDays = 600): Candle[] {
  const seed = stock.symbol.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1) * 31, 1000);
  const rng = createRng(seed);

  // Reference date: Anchor dynamically to today's current date
  let d = new Date();
  const dates: number[] = [];

  while (dates.length < numDays) {
    const dayOfWeek = d.getUTCDay();
    // EGX Trading Days: Sunday (0), Monday (1), Tuesday (2), Wednesday (3), Thursday (4)
    // Closed on Friday (5) and Saturday (6)
    if (dayOfWeek !== 5 && dayOfWeek !== 6) {
      dates.push(+d);
    }
    d = new Date(+d - 86400000);
  }
  dates.reverse();

  let price = 100;
  let drift = 0;
  const rawCandles: Candle[] = [];

  for (let i = 0; i < numDays; i++) {
    if (i % 45 === 0) {
      drift = (rng() - 0.48) * 0.007;
    }

    const open = price * (1 + (rng() - 0.5) * 0.009);
    const change = drift + (rng() - 0.5) * 0.032;
    price = Math.max(2, price * (1 + change));

    const high = Math.max(open, price) * (1 + rng() * 0.012);
    const low = Math.min(open, price) * (1 - rng() * 0.012);
    const baseVol = stock.isIndex ? 150000000 : 3500000;
    const vol = Math.round((0.4 + rng() * 1.2) * baseVol * (1 + Math.abs(change) * 20));

    rawCandles.push({
      t: dates[i],
      o: open,
      h: high,
      l: low,
      c: price,
      v: vol
    });
  }

  // Scale the candle series so the last bar matches the exact current target price
  const lastRaw = rawCandles[rawCandles.length - 1];
  const targetPrice = stock.currentPrice;
  const scale = targetPrice / lastRaw.c;

  rawCandles.forEach(b => {
    b.o = +(b.o * scale).toFixed(2);
    b.h = +(b.h * scale).toFixed(2);
    b.l = +(b.l * scale).toFixed(2);
    b.c = +(b.c * scale).toFixed(2);
  });

  // Ensure last two candles reflect stock.changePercent precisely
  if (rawCandles.length >= 2) {
    const prevCandle = rawCandles[rawCandles.length - 2];
    const lastCandle = rawCandles[rawCandles.length - 1];

    const prevClose = targetPrice / (1 + stock.changePercent / 100);
    prevCandle.c = +prevClose.toFixed(2);
    prevCandle.h = +Math.max(prevCandle.h, prevClose).toFixed(2);
    prevCandle.l = +Math.min(prevCandle.l, prevClose).toFixed(2);

    lastCandle.o = prevCandle.c;
    lastCandle.c = targetPrice;
    lastCandle.h = +Math.max(lastCandle.h, lastCandle.o, lastCandle.c).toFixed(2);
    lastCandle.l = +Math.min(lastCandle.l, lastCandle.o, lastCandle.c).toFixed(2);
  }

  return rawCandles;
}

/**
 * Aggregate base daily candles into intraday, weekly, or monthly timeframes
 */
export function aggregateCandles(dailyCandles: Candle[], timeframe: Timeframe): Candle[] {
  if (timeframe === '1D') {
    return dailyCandles;
  }

  if (timeframe === '15m' || timeframe === '1h' || timeframe === '4h') {
    // Generate simulated intraday sub-bars for the latest 60 sessions
    const recent = dailyCandles.slice(-60);
    const subBarsPerDay = timeframe === '15m' ? 18 : timeframe === '1h' ? 5 : 2;
    const intervalMs = (4.5 * 3600 * 1000) / subBarsPerDay; // 10:00 AM to 2:30 PM = 4.5 hours
    const result: Candle[] = [];

    recent.forEach((day, dayIndex) => {
      // 10:00 AM Cairo time (+2 UTC)
      const dayStart = day.t + 8 * 3600 * 1000;
      let curPrice = day.o;
      const targetClose = day.c;
      const step = (targetClose - day.o) / subBarsPerDay;

      for (let s = 0; s < subBarsPerDay; s++) {
        const barTime = dayStart + s * intervalMs;
        const o = curPrice;
        const c = s === subBarsPerDay - 1 ? targetClose : o + step + (Math.sin(dayIndex + s) * 0.4 * (day.h - day.l)) / subBarsPerDay;
        const h = Math.max(o, c) + Math.abs(day.h - day.l) * 0.15;
        const l = Math.min(o, c) - Math.abs(day.h - day.l) * 0.15;
        const v = Math.round(day.v / subBarsPerDay);

        result.push({
          t: barTime,
          o: +o.toFixed(2),
          h: +Math.max(h, o, c).toFixed(2),
          l: +Math.min(l, o, c).toFixed(2),
          c: +c.toFixed(2),
          v
        });
        curPrice = c;
      }
    });

    return result;
  }

  // Weekly or Monthly aggregation
  const groups = new Map<number, Candle>();

  dailyCandles.forEach(candle => {
    const date = new Date(candle.t);
    let key: number;

    if (timeframe === '1M') {
      key = date.getUTCFullYear() * 12 + date.getUTCMonth();
    } else {
      // 1W
      const sundayTime = new Date(candle.t - date.getUTCDay() * 86400000);
      key = Math.floor(+sundayTime / (86400000 * 7));
    }

    if (!groups.has(key)) {
      groups.set(key, { ...candle });
    } else {
      const existing = groups.get(key)!;
      existing.h = Math.max(existing.h, candle.h);
      existing.l = Math.min(existing.l, candle.l);
      existing.c = candle.c;
      existing.v += candle.v;
    }
  });

  return Array.from(groups.values());
}

/**
 * Calculate Heikin-Ashi candlestick series
 */
export function calculateHeikinAshi(candles: Candle[]): Candle[] {
  const haCandles: Candle[] = [];

  for (let i = 0; i < candles.length; i++) {
    const cur = candles[i];
    const prev = haCandles[i - 1];

    const haClose = (cur.o + cur.h + cur.l + cur.c) / 4;
    const haOpen = i === 0 ? (cur.o + cur.c) / 2 : (prev.o + prev.c) / 2;
    const haHigh = Math.max(cur.h, haOpen, haClose);
    const haLow = Math.min(cur.l, haOpen, haClose);

    haCandles.push({
      t: cur.t,
      o: +haOpen.toFixed(2),
      h: +haHigh.toFixed(2),
      l: +haLow.toFixed(2),
      c: +haClose.toFixed(2),
      v: cur.v
    });
  }

  return haCandles;
}

/**
 * Generate simulated Depth of Market (Level 2 Order Book)
 */
export function generateOrderBook(currentPrice: number, isIndex = false): { bids: any[]; asks: any[]; spread: number; bidRatio: number } {
  const tickSize = isIndex ? 1.0 : currentPrice > 100 ? 0.1 : 0.01;
  const bids: any[] = [];
  const asks: any[] = [];

  let cumBidVol = 0;
  for (let i = 1; i <= 6; i++) {
    const price = +(currentPrice - i * tickSize * (1 + Math.random() * 0.4)).toFixed(2);
    const volume = Math.round(15000 + Math.random() * 85000 * (7 - i));
    const orders = Math.floor(4 + Math.random() * 22);
    cumBidVol += volume;
    bids.push({ price, volume, orders, totalVolume: cumBidVol });
  }

  let cumAskVol = 0;
  for (let i = 1; i <= 6; i++) {
    const price = +(currentPrice + i * tickSize * (1 + Math.random() * 0.4)).toFixed(2);
    const volume = Math.round(14000 + Math.random() * 82000 * (7 - i));
    const orders = Math.floor(3 + Math.random() * 20);
    cumAskVol += volume;
    asks.push({ price, volume, orders, totalVolume: cumAskVol });
  }

  const spread = +(asks[0].price - bids[0].price).toFixed(2);
  const bidRatio = Math.round((cumBidVol / (cumBidVol + cumAskVol)) * 100);

  return { bids, asks, spread, bidRatio };
}

/**
 * Flexible CSV parsing function for historical price imports
 */
export function parseCSVData(rawText: string): Candle[] | null {
  const lines = rawText.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  if (lines.length < 3) return null;

  const delimiter = lines[0].includes('\t')
    ? '\t'
    : lines[0].includes(';') && !lines[0].includes(',')
    ? ';'
    : ',';

  const splitLine = (line: string) => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === delimiter && !inQuotes) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.trim());
  };

  const parseNumber = (val: string) => {
    const clean = (val || '').replace(/[,%\s$]/g, '');
    const mult = { K: 1e3, M: 1e6, B: 1e9 }[clean.slice(-1).toUpperCase()] || 1;
    return parseFloat(clean) * mult;
  };

  const headers = splitLine(lines[0]).map(h => h.toLowerCase());
  const findIdx = (keywords: string[]) =>
    headers.findIndex(h => keywords.some(k => h.includes(k)));

  const dateIdx = findIdx(['date', 'time', 'تاريخ']);
  const openIdx = findIdx(['open', 'افتتاح']);
  const highIdx = findIdx(['high', 'اعلى', 'أعلى']);
  const lowIdx = findIdx(['low', 'ادنى', 'أدنى']);
  const closeIdx = findIdx(['close', 'price', 'last', 'اغلاق', 'إغلاق']);
  const volIdx = findIdx(['vol', 'حجم', 'كمية']);

  if (dateIdx < 0 || openIdx < 0 || highIdx < 0 || lowIdx < 0 || closeIdx < 0) {
    return null;
  }

  const parsed: Candle[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = splitLine(lines[i]);
    if (row.length < 5) continue;

    const rawDate = row[dateIdx];
    let timestamp = NaN;

    if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      timestamp = Date.parse(rawDate.slice(0, 10) + 'T00:00:00Z');
    } else {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        timestamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
      }
    }

    const o = parseNumber(row[openIdx]);
    const h = parseNumber(row[highIdx]);
    const l = parseNumber(row[lowIdx]);
    const c = parseNumber(row[closeIdx]);
    const v = volIdx >= 0 ? parseNumber(row[volIdx]) || 0 : 100000;

    if ([timestamp, o, h, l, c].some(isNaN)) continue;

    parsed.push({
      t: timestamp,
      o,
      h: Math.max(h, o, c),
      l: Math.min(l, o, c),
      c,
      v
    });
  }

  parsed.sort((a, b) => a.t - b.t);
  return parsed.length >= 3 ? parsed : null;
}
