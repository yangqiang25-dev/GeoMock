import React, { useState } from 'react';
import { AddressData } from '../types/address';
import { copyToClipboard } from '../utils/export';
import { Star, Trash2, Copy, Check, Clock, Bookmark, ArrowRight } from 'lucide-react';

interface FavoritesHistoryProps {
  favorites: AddressData[];
  history: AddressData[];
  onSelectAddress: (address: AddressData) => void;
  onRemoveFavorite: (id: string) => void;
  onClearHistory: () => void;
  onToast: (msg: string) => void;
}

export const FavoritesHistory: React.FC<FavoritesHistoryProps> = ({
  favorites,
  history,
  onSelectAddress,
  onRemoveFavorite,
  onClearHistory,
  onToast
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (addr: AddressData) => {
    const ok = await copyToClipboard(addr.fullAddressSingleLine);
    if (ok) {
      setCopiedId(addr.id);
      onToast(`已复制: ${addr.fullName}`);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const list = activeTab === 'favorites' ? favorites : history;

  return (
    <div className="space-y-6">
      
      {/* Sub tabs and actions */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>已收藏列表 ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>最近历史 ({history.length})</span>
          </button>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-rose-600 hover:text-rose-800 transition flex items-center gap-1 font-medium"
          >
            <Trash2 className="w-3 h-3" />
            <span>清空历史</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {list.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            {activeTab === 'favorites' ? <Star className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            {activeTab === 'favorites' ? '暂无收藏的地址' : '暂无生成历史'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'favorites'
              ? '在地址生成器卡片中点击“收藏”按钮，即可将优质模拟地址持久保存到此处。'
              : '生成新的地址后会自动在此记录最近的测试历史。'}
          </p>
        </div>
      )}

      {/* Grid of cards */}
      {list.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.flag}</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {item.fullName}
                      </span>
                    </div>
                    {activeTab === 'favorites' && (
                      <button
                        onClick={() => onRemoveFavorite(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="取消收藏"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 mb-1">
                    {item.fullStreetAddress}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span>{item.city}, {item.state}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-semibold text-blue-600">{item.postalCode}</span>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-600">
                    📞 {item.phone}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCopy(item)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制单行</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectAddress(item)}
                    className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1"
                  >
                    <span>详细查看</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
