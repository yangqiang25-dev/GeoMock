import React, { useState, useEffect } from 'react';
import { AddressData, CountryCode, Gender } from './types/address';
import { generateAddress } from './utils/generator';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { AddressCard } from './components/AddressCard';
import { BatchGenerator } from './components/BatchGenerator';
import { FavoritesHistory } from './components/FavoritesHistory';
import { StandaloneSourceModal } from './components/StandaloneSourceModal';
import { AboutFaq } from './components/AboutFaq';
import { Check } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'geomock_favorites_v1';
const HISTORY_STORAGE_KEY = 'geomock_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'saved' | 'source'>('single');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<Gender>('all');
  const [taxFreeOnly, setTaxFreeOnly] = useState<boolean>(false);
  
  // Current active single address
  const [currentAddress, setCurrentAddress] = useState<AddressData>(() =>
    generateAddress({ country: 'US', gender: 'all' })
  );

  // Favorites & History
  const [favorites, setFavorites] = useState<AddressData[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<AddressData[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Handle single address generation
  const handleGenerateSingle = (
    countryOverride?: CountryCode,
    stateOverride?: string,
    taxFreeOverride?: boolean
  ) => {
    const targetCountry = countryOverride || selectedCountry;
    const targetState = stateOverride !== undefined ? stateOverride : selectedState;
    const isTaxFree =
      taxFreeOverride !== undefined
        ? taxFreeOverride
        : targetCountry === 'US' && (taxFreeOnly || targetState === '__TAX_FREE__');

    const newAddress = generateAddress({
      country: targetCountry,
      state: targetState || undefined,
      gender: selectedGender,
      taxFreeOnly: isTaxFree
    });
    setCurrentAddress(newAddress);

    // Append to history (keep max 30)
    setHistory((prev) => [newAddress, ...prev.slice(0, 29)]);
    showToast(
      newAddress.isTaxFreeState
        ? `已生成美国免税州 (${newAddress.state}) 真实地址`
        : `已生成 ${newAddress.countryName} 真实模拟地址`
    );
  };

  const handleTaxFreeToggle = (enabled: boolean) => {
    setTaxFreeOnly(enabled);
    if (enabled) {
      setSelectedCountry('US');
      setSelectedState('__TAX_FREE__');
      handleGenerateSingle('US', '__TAX_FREE__', true);
    } else {
      const nextState = selectedState === '__TAX_FREE__' ? '' : selectedState;
      setSelectedState(nextState);
      handleGenerateSingle(selectedCountry, nextState, false);
    }
  };

  const handleCountryChange = (c: CountryCode) => {
    setSelectedCountry(c);
    setSelectedState(''); // reset state filter on country change
    if (c !== 'US') {
      setTaxFreeOnly(false);
    }
    handleGenerateSingle(c, '', c === 'US' ? taxFreeOnly : false);
  };

  const handleSelectTaxFreeShortcut = () => {
    handleTaxFreeToggle(true);
  };

  const handleToggleFavorite = (addr: AddressData) => {
    const exists = favorites.some((f) => f.id === addr.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== addr.id));
      showToast(`已从收藏夹移除: ${addr.fullName}`);
    } else {
      setFavorites((prev) => [addr, ...prev]);
      showToast(`已成功收藏地址: ${addr.fullName}`);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    showToast('已移除该收藏');
  };

  const handleClearFavorites = () => {
    setFavorites([]);
    showToast('已清空全部收藏记录');
  };

  const handleClearHistory = () => {
    setHistory([]);
    showToast('已清空全部历史记录');
  };

  const handleSelectFromList = (addr: AddressData) => {
    setCurrentAddress(addr);
    setSelectedCountry(addr.country);
    setActiveTab('single');
    showToast(`已载入 ${addr.fullName} 的详细信息`);
  };

  const favoriteIds = new Set(favorites.map((f) => f.id));
  const isCurrentFavorite = favoriteIds.has(currentAddress.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCountry={selectedCountry}
        onSelectCountry={handleCountryChange}
        onGenerateNew={() => handleGenerateSingle()}
        savedCount={favorites.length}
        onToast={showToast}
      />

      {/* Main Viewport Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Single Generator Tab */}
        {activeTab === 'single' && (
          <div className="space-y-6">
            <FilterBar
              country={selectedCountry}
              onCountryChange={handleCountryChange}
              state={selectedState}
              onStateChange={setSelectedState}
              gender={selectedGender}
              onGenderChange={setSelectedGender}
              taxFreeOnly={taxFreeOnly}
              onTaxFreeOnlyChange={handleTaxFreeToggle}
              onGenerate={() => handleGenerateSingle()}
              onSelectTaxFreeShortcut={handleSelectTaxFreeShortcut}
            />

            <AddressCard
              address={currentAddress}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
              onToast={showToast}
            />

            <AboutFaq />
          </div>
        )}

        {/* Batch Generator Tab */}
        {activeTab === 'batch' && (
          <BatchGenerator
            onSelectAddress={handleSelectFromList}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
            onToast={showToast}
          />
        )}

        {/* Saved & History Tab */}
        {activeTab === 'saved' && (
          <FavoritesHistory
            favorites={favorites}
            history={history}
            onSelectAddress={handleSelectFromList}
            onRemoveFavorite={handleRemoveFavorite}
            onClearFavorites={handleClearFavorites}
            onClearHistory={handleClearHistory}
            onToast={showToast}
          />
        )}

        {/* Standalone Single-File Source Tab */}
        {activeTab === 'source' && (
          <StandaloneSourceModal onToast={showToast} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">GeoMock Studio</span>
            <span>· 全球真实格式测试数据与模拟身份生成器</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <button
              onClick={() => setActiveTab('source')}
              className="hover:text-blue-600 transition underline underline-offset-2 cursor-pointer"
            >
              纯离线单文件下载
            </button>
            <a
              href="/geomock-offline.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition underline underline-offset-2 cursor-pointer font-medium text-emerald-700"
            >
              100% 离线脱机版
            </a>
            <span>仅供开发测试与软件合规 QA 使用</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 transition-all animate-bounce-short">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
