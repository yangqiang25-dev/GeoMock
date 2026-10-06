import React from 'react';
import { CountryCode, Gender } from '../types/address';
import { COUNTRIES } from '../data/countries';
import { Shuffle, Sparkles, Filter } from 'lucide-react';

interface FilterBarProps {
  country: CountryCode;
  onCountryChange: (c: CountryCode) => void;
  state: string;
  onStateChange: (s: string) => void;
  gender: Gender;
  onGenderChange: (g: Gender) => void;
  taxFreeOnly?: boolean;
  onTaxFreeOnlyChange?: (val: boolean) => void;
  onGenerate: () => void;
  onSelectTaxFreeShortcut?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  country,
  onCountryChange,
  state,
  onStateChange,
  gender,
  onGenderChange,
  taxFreeOnly = false,
  onTaxFreeOnlyChange,
  onGenerate,
  onSelectTaxFreeShortcut
}) => {
  const currentCountryData = COUNTRIES[country];
  const states = currentCountryData?.states || [];

  const isUsTaxFreeActive =
    country === 'US' &&
    (taxFreeOnly ||
      state === '__TAX_FREE__' ||
      ['Delaware', 'Oregon', 'Montana', 'New Hampshire', 'Alaska'].includes(state));

  const handleToggleTaxFree = (checked: boolean) => {
    if (onTaxFreeOnlyChange) {
      onTaxFreeOnlyChange(checked);
    }
    if (checked) {
      if (country !== 'US') {
        onCountryChange('US');
      }
      onStateChange('__TAX_FREE__');
    } else {
      if (state === '__TAX_FREE__') {
        onStateChange('');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      
      {/* Quick country switcher tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>快捷筛选:</span>
        </span>

        {/* Dedicated US Tax-Free Shortcut Pill */}
        <button
          onClick={() => {
            if (onSelectTaxFreeShortcut) {
              onSelectTaxFreeShortcut();
            } else {
              handleToggleTaxFree(!isUsTaxFreeActive);
            }
          }}
          className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 border cursor-pointer ${
            isUsTaxFreeActive
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
          }`}
          title="点击一键筛选/生成美国五大免税州地址 (特拉华、俄勒冈、蒙大拿、新罕布什尔、阿拉斯加)"
        >
          <span>🎁</span>
          <span>美国免税州 (0% 消费税)</span>
          {isUsTaxFreeActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        </button>

        {(['US', 'GB', 'CN', 'JP', 'DE', 'FR', 'CA', 'AU', 'SG', 'KR'] as CountryCode[]).map((c) => {
          const isActive = country === c && !isUsTaxFreeActive;
          return (
            <button
              key={c}
              onClick={() => {
                onCountryChange(c);
                if (taxFreeOnly && onTaxFreeOnlyChange) onTaxFreeOnlyChange(false);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{COUNTRIES[c].info.flag}</span>
              <span>{COUNTRIES[c].info.name}</span>
            </button>
          );
        })}
      </div>

      {/* Prominent US Tax-Free States Option Banner / Toggle Card */}
      <div
        className={`p-3 rounded-lg border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isUsTaxFreeActive
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
            : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <span className="text-xl shrink-0">🎁</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900">
                美国免税州选项 (0% State Sales Tax)
              </span>
              <span
                className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                  isUsTaxFreeActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isUsTaxFreeActive ? '已开启免税州过滤' : '未开启'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              五大零消费税州：特拉华 (DE) · 俄勒冈 (OR) · 蒙大拿 (MT) · 新罕布什尔 (NH) · 阿拉斯加 (AK) · 适合海淘转运仓及跨境计税验证
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isUsTaxFreeActive}
              onChange={(e) => handleToggleTaxFree(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
            <span className="font-semibold text-xs text-slate-800">
              仅限美国免税州
            </span>
          </label>
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center pt-1 border-t border-slate-100">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            全部国家 / 地区
          </label>
          <select
            value={isUsTaxFreeActive ? 'US_TAX_FREE' : country}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'US_TAX_FREE') {
                onCountryChange('US');
                handleToggleTaxFree(true);
              } else {
                onCountryChange(val as CountryCode);
                if (taxFreeOnly && onTaxFreeOnlyChange) onTaxFreeOnlyChange(false);
              }
            }}
            aria-label="选择国家"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
          >
            <optgroup label="🇺🇸 美国专区 (含免税州专属)">
              <option value="US">🇺🇸 United States · 美国 (全境随机)</option>
              <option value="US_TAX_FREE">
                🎁 🇺🇸 United States · 美国五大免税州 (0% 消费税专选)
              </option>
            </optgroup>
            <optgroup label="全球其他支持国家">
              {(Object.keys(COUNTRIES) as CountryCode[])
                .filter((c) => c !== 'US')
                .map((c) => (
                  <option key={c} value={c}>
                    {COUNTRIES[c].info.flag} {COUNTRIES[c].info.name} ({COUNTRIES[c].info.nativeName})
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-slate-500">
              州 / 省份 / 区域
            </label>
            {country === 'US' && (
              <span className="text-[11px] font-semibold text-emerald-700">
                {isUsTaxFreeActive ? '0% 免税模式' : '全部州'}
              </span>
            )}
          </div>
          <select
            value={state}
            onChange={(e) => {
              const val = e.target.value;
              onStateChange(val);
              if (val === '__TAX_FREE__' || ['Delaware', 'Oregon', 'Montana', 'New Hampshire', 'Alaska'].includes(val)) {
                if (onTaxFreeOnlyChange) onTaxFreeOnlyChange(true);
              }
            }}
            aria-label="选择州省"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer ${
              isUsTaxFreeActive
                ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 font-semibold'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            {isUsTaxFreeActive ? (
              <>
                <option value="__TAX_FREE__">⭐ 五大免税州随机 (DE / OR / MT / NH / AK)</option>
                <optgroup label="🎁 美国五大零消费税州">
                  {states
                    .filter((s) => s.isTaxFree)
                    .map((s) => (
                      <option key={s.name} value={s.name}>
                        🎁 {s.name} ({s.code}) · 0% 消费税免税州
                      </option>
                    ))}
                </optgroup>
              </>
            ) : (
              <>
                <option value="">-- 全境随机 --</option>
                {country === 'US' && (
                  <optgroup label="🎁 美国五大免税州推荐 (0% Sales Tax)">
                    <option value="__TAX_FREE__">
                      ⭐ 五大免税州随机 (DE / OR / MT / NH / AK)
                    </option>
                    {states
                      .filter((s) => s.isTaxFree)
                      .map((s) => (
                        <option key={s.name} value={s.name}>
                          🎁 {s.name} ({s.code}) · 0% 免税州
                        </option>
                      ))}
                  </optgroup>
                )}
                <optgroup label={country === 'US' ? '美国其他各州' : '全部地区'}>
                  {states
                    .filter((s) => country !== 'US' || !s.isTaxFree)
                    .map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                </optgroup>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            性别偏好
          </label>
          <select
            value={gender}
            onChange={(e) => onGenderChange(e.target.value as Gender)}
            aria-label="选择性别"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
          >
            <option value="all">男女随机</option>
            <option value="male">男性 (Male)</option>
            <option value="female">女性 (Female)</option>
          </select>
        </div>

        <div className="flex items-end gap-2 pt-1 sm:pt-0">
          <button
            onClick={onGenerate}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition rounded-lg flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>生成真实地址</span>
          </button>
        </div>

      </div>

    </div>
  );
};
