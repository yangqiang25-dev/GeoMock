import React from 'react';
import { CountryCode } from '../types/address';
import { COUNTRIES } from '../data/countries';
import { RefreshCw, Code, Bookmark, Layers, MapPin, Download } from 'lucide-react';
import { STANDALONE_HTML_CODE } from '../utils/standaloneHtml';
import { downloadFile } from '../utils/export';

interface HeaderProps {
  activeTab: 'single' | 'batch' | 'saved' | 'source';
  setActiveTab: (tab: 'single' | 'batch' | 'saved' | 'source') => void;
  selectedCountry: CountryCode;
  onSelectCountry: (code: CountryCode) => void;
  onGenerateNew: () => void;
  savedCount: number;
  onToast?: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCountry,
  onSelectCountry,
  onGenerateNew,
  savedCount,
  onToast
}) => {
  const handleDownloadOffline = () => {
    downloadFile(STANDALONE_HTML_CODE, 'geomock-offline.html', 'text/html;charset=utf-8;');
    if (onToast) {
      onToast('已开始下载 geomock-offline.html 纯离线单文件！双击即可离线使用');
    }
  };
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('single');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              GM
            </div>
            <span>GeoMock</span>
          </a>

          {/* Zone 2: 4-6 text navigation links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'single'
                  ? 'text-blue-600 bg-blue-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>地址生成器</span>
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'batch'
                  ? 'text-blue-600 bg-blue-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>批量生成导出</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'text-blue-600 bg-blue-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>已收藏</span>
              {savedCount > 0 && (
                <span className="text-[11px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'source'
                  ? 'text-blue-600 bg-blue-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>离线单文件</span>
            </button>
          </nav>
        </div>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Quick country dropdown selector */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => onSelectCountry(e.target.value as CountryCode)}
              aria-label="选择生成国家"
              className="appearance-none bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              {(Object.keys(COUNTRIES) as CountryCode[]).map((c) => (
                <option key={c} value={c}>
                  {COUNTRIES[c].info.flag} {COUNTRIES[c].info.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-xs">
              ▼
            </div>
          </div>

          {/* Download offline HTML single-file direct button */}
          <button
            onClick={handleDownloadOffline}
            title="下载 100% 离线脱机单文件 HTML（双击即用，无需服务器和部署）"
            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 active:scale-95 transition-all rounded-lg items-center gap-1.5 shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>下载离线 HTML</span>
          </button>

          <button
            onClick={onGenerateNew}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>生成新地址</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2 bg-slate-50 text-xs font-medium">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-3 py-1 rounded ${activeTab === 'single' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          单条生成
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`px-3 py-1 rounded ${activeTab === 'batch' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          批量导出
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3 py-1 rounded ${activeTab === 'saved' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          收藏 ({savedCount})
        </button>
        <button
          onClick={() => setActiveTab('source')}
          className={`px-3 py-1 rounded ${activeTab === 'source' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          离线单文件
        </button>
      </div>
    </header>
  );
};
