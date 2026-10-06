import React, { useState } from 'react';
import { AddressData } from '../types/address';
import { copyToClipboard, downloadFile, exportFavoritesToTestSuiteJSON } from '../utils/export';
import {
  Star,
  Trash2,
  Copy,
  Check,
  Clock,
  Bookmark,
  ArrowRight,
  Download,
  FileCode,
  CheckCircle2,
  Code2,
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FavoritesHistoryProps {
  favorites: AddressData[];
  history: AddressData[];
  onSelectAddress: (address: AddressData) => void;
  onRemoveFavorite: (id: string) => void;
  onClearFavorites?: () => void;
  onClearHistory: () => void;
  onToast: (msg: string) => void;
}

type SnippetType = 'playwright' | 'cypress' | 'jest' | 'postman';

export const FavoritesHistory: React.FC<FavoritesHistoryProps> = ({
  favorites,
  history,
  onSelectAddress,
  onRemoveFavorite,
  onClearFavorites,
  onClearHistory,
  onToast
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedKind, setCopiedKind] = useState<'single' | 'json' | null>(null);
  const [exportFormat, setExportFormat] = useState<'raw-array' | 'suite-wrapper'>('raw-array');
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(false);
  const [activeSnippet, setActiveSnippet] = useState<SnippetType>('playwright');
  const [snippetCopied, setSnippetCopied] = useState<boolean>(false);

  // Statistics for test suite
  const uniqueCountries = Array.from(new Set(favorites.map((f) => f.country)));
  const taxFreeCount = favorites.filter((f) => f.isTaxFreeState).length;

  const handleCopySingle = async (addr: AddressData) => {
    const ok = await copyToClipboard(addr.fullAddressSingleLine);
    if (ok) {
      setCopiedId(addr.id);
      setCopiedKind('single');
      onToast(`已复制: ${addr.fullName} 单行格式`);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedKind(null);
      }, 1500);
    }
  };

  const handleCopyJson = async (addr: AddressData) => {
    const ok = await copyToClipboard(JSON.stringify(addr, null, 2));
    if (ok) {
      setCopiedId(addr.id);
      setCopiedKind('json');
      onToast(`已复制: ${addr.fullName} JSON 结构`);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedKind(null);
      }, 1500);
    }
  };

  // Download all favorites as single JSON file for automated test suites
  const handleExportTestSuiteJson = () => {
    if (favorites.length === 0) {
      onToast('收藏列表为空，请先在生成器中点击收藏！');
      return;
    }

    const jsonString = exportFavoritesToTestSuiteJSON(favorites, exportFormat);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `geomock_favorites_test_suite_${dateStr}.json`;

    downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
    onToast(`已成功导出 ${favorites.length} 条已收藏地址为测试套件 JSON 文件 (${filename})！`);
  };

  // Copy all favorites as JSON to clipboard
  const handleCopyAllFavoritesJson = async () => {
    if (favorites.length === 0) return;
    const jsonString = exportFavoritesToTestSuiteJSON(favorites, exportFormat);
    const ok = await copyToClipboard(jsonString);
    if (ok) {
      setCopiedAll(true);
      onToast(`已复制全部 ${favorites.length} 条收藏地址 JSON 到剪贴板！`);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  // Code snippets for automated test frameworks
  const codeSnippets: Record<SnippetType, { title: string; filename: string; code: string }> = {
    playwright: {
      title: 'Playwright (E2E Test Runner)',
      filename: 'tests/checkout.spec.ts',
      code: `import { test, expect } from '@playwright/test';
import testAddresses from './geomock_favorites_test_suite.json';

test.describe('Global Checkout & Shipping Address Suite', () => {
  for (const record of testAddresses) {
    test(\`Verify checkout for \${record.fullName} (\${record.countryName})\`, async ({ page }) => {
      await page.goto('/checkout');
      await page.fill('[name="fullName"]', record.fullName);
      await page.fill('[name="streetAddress"]', record.fullStreetAddress);
      await page.fill('[name="city"]', record.city);
      await page.fill('[name="state"]', record.stateCode || record.state);
      await page.fill('[name="postalCode"]', record.postalCode);
      await page.fill('[name="phone"]', record.phone);
      await page.fill('[name="email"]', record.email);

      // Verify tax calculation if US tax-free state
      if (record.isTaxFreeState) {
        await expect(page.locator('#sales-tax-amount')).toHaveText('$0.00');
      }

      await page.click('button[type="submit"]');
      await expect(page.locator('.order-success-badge')).toBeVisible();
    });
  }
});`
    },
    cypress: {
      title: 'Cypress (Fixture Automation)',
      filename: 'cypress/e2e/shipping.cy.ts',
      code: `describe('Address & Persona Form Verification', () => {
  beforeEach(() => {
    cy.fixture('geomock_favorites_test_suite.json').as('addressFixtures');
  });

  it('Automates form fill for each saved mock address', function () {
    this.addressFixtures.forEach((addr) => {
      cy.visit('/shipping-form');
      cy.get('#input-name').clear().type(addr.fullName);
      cy.get('#input-address').clear().type(addr.fullStreetAddress);
      cy.get('#input-city').clear().type(addr.city);
      cy.get('#input-postal').clear().type(addr.postalCode);
      cy.get('#input-phone').clear().type(addr.phone);
      cy.get('#submit-btn').click();
      cy.contains('Address verified').should('be.visible');
    });
  });
});`
    },
    jest: {
      title: 'Jest / Vitest (Data-Driven Unit Tests)',
      filename: 'tests/taxAndIdentity.test.ts',
      code: `import fixtures from './geomock_favorites_test_suite.json';
import { validateAddressPostal, computeStateTaxRate } from '../src/validator';

describe('GeoMock Saved Favorites Test Suite', () => {
  test.each(fixtures)(
    'Validates format for $fullName ($countryName - $postalCode)',
    (address) => {
      expect(validateAddressPostal(address.country, address.postalCode)).toBe(true);

      if (address.isTaxFreeState) {
        // Assert 0% sales tax for DE, OR, MT, NH, AK
        expect(computeStateTaxRate(address.stateCode)).toBe(0);
      }
    }
  );
});`
    },
    postman: {
      title: 'Postman Collection Runner (Data File)',
      filename: 'Postman Runner / CSV or JSON Fixture',
      code: `// 1. In Postman Collection Runner, select "Data" -> Select geomock_favorites_test_suite.json
// 2. In Request Pre-request Script:
pm.test("Prepare request body with current iteration mock address", function () {
    const street = pm.iterationData.get("fullStreetAddress");
    const city = pm.iterationData.get("city");
    const zip = pm.iterationData.get("postalCode");
    pm.collectionVariables.set("current_street", street);
    pm.collectionVariables.set("current_city", city);
    pm.collectionVariables.set("current_zip", zip);
});

// 3. In Request Tests script:
pm.test("Status code is 200 and order created", function () {
    pm.response.to.have.status(200);
});`
    }
  };

  const handleCopySnippet = async (code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setSnippetCopied(true);
      onToast('已复制自动化测试集成代码！');
      setTimeout(() => setSnippetCopied(false), 2000);
    }
  };

  const list = activeTab === 'favorites' ? favorites : history;

  return (
    <div className="space-y-6">
      
      {/* Sub tabs and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
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
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>最近历史 ({history.length})</span>
          </button>
        </div>

        {/* Tab Right Actions */}
        <div className="flex items-center gap-2">
          {activeTab === 'favorites' && favorites.length > 0 && onClearFavorites && (
            <button
              onClick={() => {
                if (window.confirm('确定要清空全部已收藏的地址吗？此操作无法撤销。')) {
                  onClearFavorites();
                }
              }}
              className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
              title="清空收藏列表"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空收藏</span>
            </button>
          )}

          {activeTab === 'history' && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 transition flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空历史</span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Export Panel for Automated Test Suites (When Favorites tab is active and has items) */}
      {activeTab === 'favorites' && favorites.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Summary & Metadata */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                  <FileCode className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  自动化测试套件批量导出 (Test Suite Batch Export)
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  共 {favorites.length} 条测试数据
                </span>
                {taxFreeCount > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    🎁 {taxFreeCount} 个0%免税州
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                将当前收藏列表中的全部真实地址和虚拟身份一键导出为单个标准化 JSON 文件，直接作为 <strong>Playwright</strong>、<strong>Cypress</strong>、<strong>Jest</strong> 或 <strong>Postman Runner</strong> 的数据驱动夹具 (Fixtures)。
              </p>
            </div>

            {/* Right: Format Switcher & Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              {/* Format Switcher */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                <button
                  onClick={() => setExportFormat('raw-array')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    exportFormat === 'raw-array'
                      ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="标准数据数组 [ {...}, {...} ]，最适合 Jest test.each、Playwright 和 Cypress cy.fixture"
                >
                  标准数组 (Fixture)
                </button>
                <button
                  onClick={() => setExportFormat('suite-wrapper')}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    exportFormat === 'suite-wrapper'
                      ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="包装对象 { testSuiteName, exportedAt, records: [...] }，包含测试环境描述和Schema元数据"
                >
                  套件包装 (Wrapper)
                </button>
              </div>

              {/* Primary Batch Export Button */}
              <button
                onClick={handleExportTestSuiteJson}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="导出并下载单个 JSON 测试夹具文件"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>导出全部为 JSON 文件</span>
              </button>

              {/* Copy All JSON Button */}
              <button
                onClick={handleCopyAllFavoritesJson}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="复制全部收藏的 JSON 数据至剪贴板"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">已复制全部 JSON</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>复制全部 JSON</span>
                  </>
                )}
              </button>

              {/* Code Snippets Toggle */}
              <button
                onClick={() => setShowSnippets(!showSnippets)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                  showSnippets
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }`}
                title="查看与主流测试框架（Playwright、Cypress、Jest、Postman）的集成代码"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                <span>测试代码范例</span>
                {showSnippets ? (
                  <ChevronUp className="w-3 h-3 text-slate-500" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Test Framework Integration Snippets */}
          {showSnippets && (
            <div className="mt-3 pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  {(['playwright', 'cypress', 'jest', 'postman'] as SnippetType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveSnippet(type)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                        activeSnippet === type
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type === 'playwright' && '🎭 Playwright'}
                      {type === 'cypress' && '🌲 Cypress'}
                      {type === 'jest' && '🃏 Jest / Vitest'}
                      {type === 'postman' && '🚀 Postman Runner'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {codeSnippets[activeSnippet].filename}
                  </span>
                  <button
                    onClick={() => handleCopySnippet(codeSnippets[activeSnippet].code)}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition flex items-center gap-1 cursor-pointer"
                  >
                    {snippetCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">已复制代码</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>复制代码</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                <pre className="p-3.5 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-64 selection:bg-blue-600 selection:text-white">
                  {codeSnippets[activeSnippet].code}
                </pre>
              </div>
            </div>
          )}

        </div>
      )}

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
              ? '在地址生成器卡片中点击“⭐ 收藏”按钮，即可将测试所需的优质真实地址持久保存，并支持一键批量导出为单个 JSON 测试套件文件。'
              : '生成新的地址后会自动在此记录最近的测试历史。'}
          </p>
        </div>
      )}

      {/* Grid of cards */}
      {list.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => {
            const isCopiedSingle = copiedId === item.id && copiedKind === 'single';
            const isCopiedJson = copiedId === item.id && copiedKind === 'json';
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl shrink-0">{item.flag}</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {item.fullName}
                      </span>
                      {item.isTaxFreeState && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          0%免税
                        </span>
                      )}
                    </div>
                    {activeTab === 'favorites' && (
                      <button
                        onClick={() => onRemoveFavorite(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded hover:bg-slate-100 cursor-pointer"
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopySingle(item)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                      title="复制单行格式"
                    >
                      {isCopiedSingle ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">已复制单行</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>复制单行</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyJson(item)}
                      className="text-xs text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
                      title="复制单条 JSON"
                    >
                      {isCopiedJson ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">已复制 JSON</span>
                        </>
                      ) : (
                        <>
                          <Code2 className="w-3 h-3 text-slate-400" />
                          <span>JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectAddress(item)}
                    className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
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
