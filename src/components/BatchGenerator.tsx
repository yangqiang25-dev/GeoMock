import React, { useState } from 'react';
import { AddressData, CountryCode, Gender } from '../types/address';
import { COUNTRIES } from '../data/countries';
import { generateBatchAddresses } from '../utils/generator';
import { exportToCSV, exportToJSON, exportToTXT, downloadFile, copyToClipboard } from '../utils/export';
import { Download, Copy, Play, Check, Star } from 'lucide-react';

interface BatchGeneratorProps {
  onSelectAddress: (address: AddressData) => void;
  onToggleFavorite: (address: AddressData) => void;
  favoriteIds: Set<string>;
  onToast: (msg: string) => void;
}

export const BatchGenerator: React.FC<BatchGeneratorProps> = ({
  onSelectAddress,
  onToggleFavorite,
  favoriteIds,
  onToast
}) => {
  const [batchCount, setBatchCount] = useState<number>(10);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'US_TAX_FREE' | ''>('US');
  const [selectedGender, setSelectedGender] = useState<Gender>('all');
  const [taxFreeOnly, setTaxFreeOnly] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<AddressData[]>(() =>
    generateBatchAddresses(10, { country: 'US', gender: 'all' })
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isUsTaxFreeActive =
    taxFreeOnly ||
    selectedCountry === 'US_TAX_FREE' ||
    (selectedCountry === 'US' && taxFreeOnly);

  const handleGenerate = () => {
    const isUSTaxFree = isUsTaxFreeActive;
    const targetCountry = selectedCountry === 'US_TAX_FREE' ? 'US' : (selectedCountry || (isUSTaxFree ? 'US' : undefined));
    const list = generateBatchAddresses(batchCount, {
      country: targetCountry as CountryCode,
      gender: selectedGender,
      taxFreeOnly: isUSTaxFree
    });
    setAddresses(list);
    onToast(
      isUSTaxFree
        ? `成功批量生成 ${list.length} 条美国免税州 (DE/OR/MT/NH/AK) 测试地址`
        : `成功批量生成 ${list.length} 条测试地址数据`
    );
  };

  const handleCopyRow = async (addr: AddressData, index: number) => {
    const ok = await copyToClipboard(addr.fullAddressSingleLine);
    if (ok) {
      setCopiedIndex(index);
      onToast(`已复制单行地址: ${addr.fullName}`);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleDownload = (format: 'csv' | 'json' | 'txt') => {
    if (addresses.length === 0) return;
    const timestamp = Date.now();
    if (format === 'csv') {
      const csv = exportToCSV(addresses);
      downloadFile(csv, `geomock_batch_${timestamp}.csv`, 'text/csv;charset=utf-8;');
      onToast('已开始下载 CSV 文件');
    } else if (format === 'json') {
      const json = exportToJSON(addresses);
      downloadFile(json, `geomock_batch_${timestamp}.json`, 'application/json');
      onToast('已开始下载 JSON 文件');
    } else {
      const txt = exportToTXT(addresses);
      downloadFile(txt, `geomock_batch_${timestamp}.txt`, 'text/plain;charset=utf-8;');
      onToast('已开始下载 TXT 文件');
    }
  };

  const handleCopyAllJSON = async () => {
    const ok = await copyToClipboard(exportToJSON(addresses));
    if (ok) onToast(`已复制 ${addresses.length} 条完整 JSON 数据至剪贴板`);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-500">
                指定国家
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer text-[11px] text-emerald-700 font-semibold hover:text-emerald-900">
                <input
                  type="checkbox"
                  checked={isUsTaxFreeActive}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setTaxFreeOnly(checked);
                    if (checked) {
                      setSelectedCountry('US_TAX_FREE');
                    } else if (selectedCountry === 'US_TAX_FREE') {
                      setSelectedCountry('US');
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer accent-emerald-600"
                />
                <span>仅免税州 (0%)</span>
              </label>
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => {
                const val = e.target.value as CountryCode | 'US_TAX_FREE' | '';
                setSelectedCountry(val);
                if (val === 'US_TAX_FREE') {
                  setTaxFreeOnly(true);
                } else if (val !== 'US') {
                  setTaxFreeOnly(false);
                }
              }}
              aria-label="批量生成国家"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer ${
                isUsTaxFreeActive
                  ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 font-semibold'
                  : 'bg-slate-50 border-slate-300'
              }`}
            >
              <option value="">🌍 各国随机混合</option>
              <optgroup label="🇺🇸 美国专区">
                <option value="US">🇺🇸 United States · 美国 (全部州)</option>
                <option value="US_TAX_FREE">
                  🎁 🇺🇸 美国五大免税州 (0% 消费税专选: DE/OR/MT/NH/AK)
                </option>
              </optgroup>
              <optgroup label="其他国家">
                {(Object.keys(COUNTRIES) as CountryCode[])
                  .filter((c) => c !== 'US')
                  .map((c) => (
                    <option key={c} value={c}>
                      {COUNTRIES[c].info.flag} {COUNTRIES[c].info.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              性别过滤
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as Gender)}
              aria-label="性别筛选"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value="all">男女随机</option>
              <option value="male">男性 (Male)</option>
              <option value="female">女性 (Female)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              生成条数
            </label>
            <select
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value, 10))}
              aria-label="生成数量"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer"
            >
              <option value={5}>5 条数据</option>
              <option value={10}>10 条数据</option>
              <option value={20}>20 条数据</option>
              <option value={50}>50 条数据</option>
              <option value={100}>100 条数据 (Max)</option>
            </select>
          </div>

          <div className="flex items-end gap-2 pt-1 sm:pt-0">
            <button
              onClick={handleGenerate}
              className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>开始批量生成</span>
            </button>
          </div>

        </div>
      </div>

      {/* Results Table & Export Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        
        {/* Table Header Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              数据列表 ({addresses.length} 条记录)
            </span>
            <span className="text-xs text-slate-500">点击任意行可在主卡片中详细查看</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyAllJSON}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制 JSON</span>
            </button>

            <button
              onClick={() => handleDownload('csv')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>下载 CSV</span>
            </button>

            <button
              onClick={() => handleDownload('json')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>下载 JSON</span>
            </button>

            <button
              onClick={() => handleDownload('txt')}
              className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>下载 TXT</span>
            </button>
          </div>
        </div>

        {/* High-density Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-3">国家</th>
                <th className="py-3 px-3">姓名</th>
                <th className="py-3 px-3">街道地址</th>
                <th className="py-3 px-3">城市 / 州省</th>
                <th className="py-3 px-3">邮政编码</th>
                <th className="py-3 px-3">电话</th>
                <th className="py-3 px-3">身份/税号</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {addresses.map((item, idx) => {
                const isFav = favoriteIds.has(item.id);
                const isCopied = copiedIndex === idx;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectAddress(item)}
                  >
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                      <span className="mr-1.5 text-base">{item.flag}</span>
                      <span>{item.countryName}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {item.fullName}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        ({item.gender === 'male' ? '男' : '女'})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate" title={item.fullStreetAddress}>
                      {item.fullStreetAddress}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      <span>{item.city}, {item.stateCode || item.state}</span>
                      {item.isTaxFreeState && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold font-mono">
                          0%免税
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {item.postalCode}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {item.phone}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                      {item.nationalId}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onToggleFavorite(item)}
                          className={`p-1 rounded hover:bg-slate-200 transition ${
                            isFav ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={isFav ? '取消收藏' : '收藏'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleCopyRow(item, idx)}
                          className="px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800 font-medium rounded hover:bg-blue-100/60 transition flex items-center gap-1"
                          title="复制单行地址"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>复制</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
