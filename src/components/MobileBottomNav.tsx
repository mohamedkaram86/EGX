import React from 'react';
import {
  CandlestickChart,
  Layers,
  BarChart3,
  BookOpen,
  Search
} from 'lucide-react';

export type MobileTab = 'chart' | 'watchlist' | 'analysis' | 'orderbook';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onOpenSearch: () => void;
  language: 'ar' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenSearch,
  language
}) => {
  const tabs = [
    {
      id: 'chart' as MobileTab,
      labelAr: 'الشارت',
      labelEn: 'Chart',
      icon: <CandlestickChart className="w-5 h-5" />
    },
    {
      id: 'watchlist' as MobileTab,
      labelAr: 'الأسهم',
      labelEn: 'Watchlist',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'analysis' as MobileTab,
      labelAr: 'التحليل',
      labelEn: 'Analysis',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'orderbook' as MobileTab,
      labelAr: 'العمق',
      labelEn: 'Book',
      icon: <BookOpen className="w-5 h-5" />
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#0e121a]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 select-none">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] py-1 transition-colors ${
              isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-sans">
              {language === 'ar' ? tab.labelAr : tab.labelEn}
            </span>
          </button>
        );
      })}

      {/* Quick Search Button in Bottom Nav */}
      <button
        onClick={onOpenSearch}
        className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] min-w-[44px] py-1 text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight font-sans">
          {language === 'ar' ? 'بحث' : 'Search'}
        </span>
      </button>
    </nav>
  );
};
