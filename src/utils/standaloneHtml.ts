export const STANDALONE_HTML_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeoMock - 全球真实各国地址与虚拟身份生成器 (单文件完整版)</title>
  <meta name="description" content="包含美、英、中、日、德、法、加、澳、新、韩等各国的真实格式地址、邮编、电话、税号、校验位算法及一键复制功能。">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8',
            }
          }
        }
      }
    }
  </script>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">

  <!-- 顶部导航条 (Top Bar Contract: Brand + Nav + Actions) -->
  <header class="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <a href="#" class="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">GM</span>
          <span>GeoMock</span>
        </a>
        <div class="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <button onclick="switchTab('single')" id="tabBtnSingle" class="px-3 py-1.5 rounded-md text-blue-600 bg-blue-50">单条地址生成</button>
          <button onclick="switchTab('batch')" id="tabBtnBatch" class="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100">批量生成导出</button>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-slate-500 hidden sm:inline">100% 离线独立运行</span>
        <button onclick="generateSingle()" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-98 transition flex items-center gap-1.5 shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span>随机新地址</span>
        </button>
      </div>
    </div>
  </header>

  <!-- 主体容器 -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
    
    <!-- 控制过滤栏 -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      <!-- 快捷标签行 -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span class="text-slate-400 font-medium whitespace-nowrap mr-1">快捷筛选:</span>
        <button onclick="selectTaxFreeShortcut()" class="px-3 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 shrink-0 transition" title="一键生成美国免税州真实地址">
          <span>🎁</span>
          <span>美国免税州 (0% 消费税)</span>
        </button>
        <button onclick="quickSelectCountry('US')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇺🇸 美国</button>
        <button onclick="quickSelectCountry('GB')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇬🇧 英国</button>
        <button onclick="quickSelectCountry('CN')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇨🇳 中国</button>
        <button onclick="quickSelectCountry('JP')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇯🇵 日本</button>
        <button onclick="quickSelectCountry('DE')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇩🇪 德国</button>
        <button onclick="quickSelectCountry('FR')" class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0">🇫🇷 法国</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center pt-2 border-t border-slate-100">
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">选择国家 / 地区</label>
          <select id="countrySelect" onchange="onCountryChange()" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <optgroup label="🇺🇸 美国专区">
              <option value="US">🇺🇸 美国 · 全部州 (全境随机)</option>
              <option value="US_TAX_FREE">🎁 🇺🇸 美国 · 五大免税州 (0% 消费税专选)</option>
            </optgroup>
            <optgroup label="全球其他支持国家">
              <option value="GB">🇬🇧 英国 (United Kingdom)</option>
              <option value="CN">🇨🇳 中国 (China)</option>
              <option value="JP">🇯🇵 日本 (Japan)</option>
              <option value="DE">🇩🇪 德国 (Germany)</option>
              <option value="FR">🇫🇷 法国 (France)</option>
              <option value="CA">🇨🇦 加拿大 (Canada)</option>
              <option value="AU">🇦🇺 澳大利亚 (Australia)</option>
              <option value="SG">🇸🇬 新加坡 (Singapore)</option>
              <option value="KR">🇰🇷 韩国 (South Korea)</option>
              <option value="IN">🇮🇳 印度 (India)</option>
              <option value="IT">🇮🇹 意大利 (Italy)</option>
            </optgroup>
          </select>
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-xs font-medium text-slate-500">州 / 省份 / 地区</label>
            <label id="taxFreeCheckWrap" class="inline-flex items-center gap-1 cursor-pointer text-[11px] text-emerald-700 font-semibold hover:text-emerald-900">
              <input id="taxFreeCheck" type="checkbox" onchange="onTaxFreeToggle()" class="rounded text-emerald-600 focus:ring-emerald-500 w-3 h-3 cursor-pointer">
              <span>仅免税州</span>
            </label>
          </div>
          <select id="stateSelect" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option value="">-- 全境随机 --</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500 mb-1">性别过滤</label>
          <select id="genderSelect" class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
            <option value="all">男女随机</option>
            <option value="male">男性 (Male)</option>
            <option value="female">女性 (Female)</option>
          </select>
        </div>
        <div class="flex items-end gap-2 pt-1 sm:pt-0">
          <button onclick="generateSingle()" class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-xs cursor-pointer">
            生成真实地址
          </button>
          <button onclick="copyFullAddress()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer" title="复制完整单行地址">
            一键全复
          </button>
        </div>
      </div>
    </div>

    <!-- 选项卡 1：单条详细生成 -->
    <div id="singleView" class="space-y-6">
      <!-- 核心地址横幅卡片 -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div class="flex items-center gap-3">
            <span id="cardFlag" class="text-4xl">🇺🇸</span>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h1 id="cardFullName" class="text-2xl font-bold text-slate-900">John Smith</h1>
                <span id="cardGender" class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">Male</span>
                <span id="cardTaxFreeBadge" class="hidden text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold flex items-center gap-1">
                  <span>🎁</span>
                  <span>0% 消费税免税州</span>
                </span>
              </div>
              <p id="cardCountryMeta" class="text-sm text-slate-500 mt-0.5">United States · USD ($) · America/New_York</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="copyToClipboard(currentAddress.fullAddressSingleLine, '单行地址已复制')" class="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md transition text-slate-700">
              复制单行格式
            </button>
            <button onclick="copyToClipboard(currentAddress.fullMailingLabel, '邮寄信封格式已复制')" class="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-md transition text-slate-700">
              复制信封标签
            </button>
            <button onclick="copyToClipboard(JSON.stringify(currentAddress, null, 2), '完整 JSON 数据已复制')" class="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition">
              复制 JSON
            </button>
          </div>
        </div>

        <!-- 详细字段网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          
          <!-- 区域 1：详细街道与地理位置 -->
          <div class="space-y-3">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">地理与住址 (Address)</h2>
            
            <div class="field-item">
              <span class="field-label">街道门牌 (Street Address)</span>
              <div class="field-row">
                <span id="valStreet" class="field-val">742 Evergreen Terrace</span>
                <button onclick="copyField('valStreet')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">次级地址 (Apt / Suite / Room)</span>
              <div class="field-row">
                <span id="valSecondary" class="field-val">Apt 102</span>
                <button onclick="copyField('valSecondary')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">城市 (City / District)</span>
              <div class="field-row">
                <span id="valCity" class="field-val">Springfield</span>
                <button onclick="copyField('valCity')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">州 / 省份 (State / Province)</span>
              <div class="field-row">
                <span id="valState" class="field-val">California (CA)</span>
                <button onclick="copyField('valState')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">邮政编码 (Postal / ZIP Code)</span>
              <div class="field-row">
                <span id="valZip" class="field-val font-mono font-bold text-blue-600">90024</span>
                <button onclick="copyField('valZip')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">经纬度坐标 (Coordinates)</span>
              <div class="field-row">
                <span id="valCoords" class="field-val font-mono text-xs">34.052200, -118.243700</span>
                <button onclick="copyField('valCoords')" class="copy-btn">复制</button>
              </div>
            </div>
          </div>

          <!-- 区域 2：个人与联络信息 -->
          <div class="space-y-3">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">个人与联络 (Personal & Contact)</h2>

            <div class="field-item">
              <span class="field-label">姓名全称 (Full Name)</span>
              <div class="field-row">
                <span id="valFullName" class="field-val font-semibold">John Smith</span>
                <button onclick="copyField('valFullName')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">出生日期 / 年龄 (Birth Date / Age)</span>
              <div class="field-row">
                <span id="valBirthday" class="field-val">1992-06-15 (32 岁)</span>
                <button onclick="copyField('valBirthday')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">电话号码 (Phone Number)</span>
              <div class="field-row">
                <span id="valPhone" class="field-val font-mono font-semibold text-slate-800">+1 (310) 555-0192</span>
                <button onclick="copyField('valPhone')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">电子邮箱 (Email Address)</span>
              <div class="field-row">
                <span id="valEmail" class="field-val font-mono text-xs">john.smith42@example.org</span>
                <button onclick="copyField('valEmail')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">用户名 (Username)</span>
              <div class="field-row">
                <span id="valUsername" class="field-val font-mono text-xs">john_smith42</span>
                <button onclick="copyField('valUsername')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">就职公司 (Company Name)</span>
              <div class="field-row">
                <span id="valCompany" class="field-val">Apex Digital Solutions</span>
                <button onclick="copyField('valCompany')" class="copy-btn">复制</button>
              </div>
            </div>
          </div>

          <!-- 区域 3：合规测试身份与支付卡模拟 -->
          <div class="space-y-3">
            <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">开发与测试标识 (Mock QA Identifiers)</h2>

            <div class="field-item bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/60">
              <div class="flex items-center justify-between mb-1">
                <span id="lblNationalId" class="text-xs font-semibold text-amber-900">SSN (Social Security)</span>
                <span class="text-[10px] text-amber-700 bg-amber-100 px-1 rounded">QA Test Only</span>
              </div>
              <div class="field-row">
                <span id="valNationalId" class="field-val font-mono font-bold text-amber-900">458-29-1920</span>
                <button onclick="copyField('valNationalId')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div class="flex items-center justify-between mb-1">
                <span id="valCardType" class="text-xs font-semibold text-slate-700">Visa (Luhn Verified)</span>
                <span class="text-[10px] text-slate-500">模拟合规测试卡</span>
              </div>
              <div class="field-row mb-1">
                <span id="valCardNumber" class="field-val font-mono font-bold tracking-wider text-slate-900">4532 8921 3491 2049</span>
                <button onclick="copyField('valCardNumber')" class="copy-btn">复制</button>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200 text-slate-600">
                <div>有效期: <span id="valCardExp" class="font-mono font-bold">08/29</span></div>
                <div>CVV: <span id="valCardCvv" class="font-mono font-bold">642</span></div>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">岗位职务 (Job Title)</span>
              <div class="field-row">
                <span id="valJob" class="field-val">Senior Software Engineer</span>
                <button onclick="copyField('valJob')" class="copy-btn">复制</button>
              </div>
            </div>

            <div class="field-item">
              <span class="field-label">完整多行邮寄标签</span>
              <pre id="valMailingLabel" class="text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200 font-mono text-slate-700 whitespace-pre-wrap select-all"></pre>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- 选项卡 2：批量生成导出 -->
    <div id="batchView" class="hidden space-y-6">
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700">批量生成数量:</label>
            <select id="batchCount" class="bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-sm font-medium">
              <option value="5">5 条数据</option>
              <option value="10" selected>10 条数据</option>
              <option value="25">25 条数据</option>
              <option value="50">50 条数据</option>
            </select>
            <button onclick="runBatchGenerate()" class="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              执行生成
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="exportBatch('csv')" class="px-3 py-1.5 text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 rounded-md transition text-slate-700">
              下载 CSV
            </button>
            <button onclick="exportBatch('json')" class="px-3 py-1.5 text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 rounded-md transition text-slate-700">
              下载 JSON
            </button>
            <button onclick="exportBatch('txt')" class="px-3 py-1.5 text-xs font-medium border border-slate-300 bg-white hover:bg-slate-50 rounded-md transition text-slate-700">
              下载 TXT
            </button>
          </div>
        </div>

        <!-- 批量表格 -->
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full divide-y divide-slate-200 text-xs">
            <thead class="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th class="py-2.5 px-3 text-left">国家</th>
                <th class="py-2.5 px-3 text-left">姓名</th>
                <th class="py-2.5 px-3 text-left">街道地址</th>
                <th class="py-2.5 px-3 text-left">城市/省州</th>
                <th class="py-2.5 px-3 text-left">邮编</th>
                <th class="py-2.5 px-3 text-left">电话</th>
                <th class="py-2.5 px-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody id="batchTableBody" class="divide-y divide-slate-100 text-slate-800">
              <!-- 动态插入行 -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </main>

  <!-- 吐司通知 (Toast) -->
  <div id="toast" class="fixed bottom-6 right-6 z-50 transform translate-y-10 opacity-0 pointer-events-none transition-all duration-200 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span id="toastMsg">已复制到剪贴板</span>
  </div>

  <style>
    .field-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .field-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .field-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      background-color: #f8fafc;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .field-val {
      font-size: 13px;
      color: #0f172a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy-btn {
      font-size: 11px;
      font-weight: 500;
      color: #2563eb;
      background: white;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .copy-btn:hover {
      background: #eff6ff;
      border-color: #93c5fd;
    }
  </style>

  <!-- 核心数据与生成脚本 -->
  <script>
    const DATASETS = {
      US: {
        info: { name: 'United States', flag: '🇺🇸', phonePrefix: '+1', currency: 'USD ($)', tz: 'America/New_York' },
        states: [
          { name: 'California', code: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'], zip: '900' },
          { name: 'New York', code: 'NY', cities: ['New York', 'Brooklyn', 'Buffalo', 'Albany'], zip: '100' },
          { name: 'Texas', code: 'TX', cities: ['Houston', 'Austin', 'Dallas', 'San Antonio'], zip: '750' },
          { name: 'Washington', code: 'WA', cities: ['Seattle', 'Bellevue', 'Spokane'], zip: '981' },
          { name: 'Delaware', code: 'DE', cities: ['Wilmington', 'New Castle', 'Newark', 'Dover'], zip: '198', isTaxFree: true },
          { name: 'Oregon', code: 'OR', cities: ['Portland', 'Beaverton', 'Eugene', 'Salem'], zip: '972', isTaxFree: true },
          { name: 'Montana', code: 'MT', cities: ['Billings', 'Missoula', 'Bozeman', 'Helena'], zip: '591', isTaxFree: true },
          { name: 'New Hampshire', code: 'NH', cities: ['Manchester', 'Nashua', 'Concord'], zip: '031', isTaxFree: true },
          { name: 'Alaska', code: 'AK', cities: ['Anchorage', 'Fairbanks', 'Juneau'], zip: '995', isTaxFree: true }
        ],
        maleNames: ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Thomas'],
        femaleNames: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Susan', 'Jessica', 'Emily'],
        lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Taylor'],
        streets: ['Main St', 'Oak Ave', 'Maple Rd', 'Pine Blvd', 'Cedar Ln', 'Broadway', 'Sunset Dr'],
        companies: ['Horizon Cloud Systems', 'Vanguard Logic Inc', 'Pacific Apex Logistics', 'BluePeak Tech'],
        jobs: ['Software Engineer', 'Product Manager', 'Data Analyst', 'DevOps Architect'],
        idLabel: 'SSN (Social Security)',
        genId: () => \`\${rand(100, 899)}-\${rand(10, 89)}-\${rand(1000, 8999)}\`,
        genPhone: () => \`+1 (\${rand(201, 899)}) \${rand(200, 899)}-\${rand(1000, 8999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.city}, \${d.stateCode} \${d.zip}, USA\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.city}, \${d.stateCode} \${d.zip}\\nUnited States\`
        })
      },
      GB: {
        info: { name: 'United Kingdom', flag: '🇬🇧', phonePrefix: '+44', currency: 'GBP (£)', tz: 'Europe/London' },
        states: [
          { name: 'Greater London', code: 'GL', cities: ['London', 'Westminster', 'Camden'], zip: 'SW1A' },
          { name: 'Greater Manchester', code: 'GM', cities: ['Manchester', 'Salford'], zip: 'M1' },
          { name: 'West Midlands', code: 'WM', cities: ['Birmingham', 'Coventry'], zip: 'B1' },
          { name: 'Scotland', code: 'SCT', cities: ['Edinburgh', 'Glasgow'], zip: 'EH1' }
        ],
        maleNames: ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Thomas'],
        femaleNames: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Sophia', 'Grace'],
        lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Davies'],
        streets: ['High Street', 'Church Road', 'Station Road', 'Victoria Avenue', 'Queens Way'],
        companies: ['Apex Britannic Logistics', 'Sterling Thames Advisory', 'Albion Core Solutions'],
        jobs: ['Lead Consultant', 'Senior Developer', 'Finance Director', 'Business Analyst'],
        idLabel: 'National Insurance Number',
        genId: () => \`QQ \${rand(10, 89)} \${rand(10, 89)} \${rand(10, 89)} A\`,
        genPhone: () => \`+44 7\${rand(100, 899)} \${rand(100000, 899999)}\`,
        format: (d) => ({
          single: \`\${d.sec ? d.sec + ', ' : ''}\${d.street}, \${d.city}, \${d.zip}, United Kingdom\`,
          label: \`\${d.sec ? d.sec + '\\n' : ''}\${d.street}\\n\${d.city}\\n\${d.zip}\\nUnited Kingdom\`
        })
      },
      CN: {
        info: { name: 'China', flag: '🇨🇳', phonePrefix: '+86', currency: 'CNY (¥)', tz: 'Asia/Shanghai' },
        states: [
          { name: '北京市', code: 'BJ', cities: ['朝阳区', '海淀区', '西城区'], zip: '100020' },
          { name: '上海市', code: 'SH', cities: ['浦东新区', '黄浦区', '徐汇区'], zip: '200120' },
          { name: '广东省', code: 'GD', cities: ['深圳市南山区', '广州市天河区'], zip: '518057' },
          { name: '浙江省', code: 'ZJ', cities: ['杭州市西湖区', '杭州市余杭区'], zip: '310013' }
        ],
        maleNames: ['浩然', '子轩', '宇航', '伟', '强', '磊', '洋', '俊杰'],
        femaleNames: ['静', '婷', '敏', '雪', '雨欣', '欣怡', '思彤', '语嫣'],
        lastNames: ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐'],
        streets: ['人民路', '解放大道', '中山路', '科技大道', '朝阳街', '文三路'],
        companies: ['宏图盛世数码科技有限公司', '远瞻智联创想网络有限公司', '乾坤浩博数据技术集团'],
        jobs: ['高级前端工程师', '架构师', '产品总监', '全栈技术专家'],
        idLabel: '居民身份证号 (GB11643)',
        genId: (birth, gender) => generateChinaID(birth, gender),
        genPhone: () => \`+86 \${choice(['138', '139', '150', '188', '177', '199'])} \${rand(1000, 8999)} \${rand(1000, 8999)}\`,
        format: (d) => ({
          single: \`\${d.state}\${d.city}\${d.street}\${d.sec || ''}，邮编：\${d.zip}\`,
          label: \`中国 \${d.state} \${d.city}\\n\${d.street}\${d.sec || ''}\\n邮政编码：\${d.zip}\`
        })
      },
      JP: {
        info: { name: 'Japan', flag: '🇯🇵', phonePrefix: '+81', currency: 'JPY (¥)', tz: 'Asia/Tokyo' },
        states: [
          { name: '東京都', code: '13', cities: ['新宿区', '渋谷区', '港区', '千代田区'], zip: '160' },
          { name: '大阪府', code: '27', cities: ['大阪市北区', '大阪市中央区'], zip: '530' },
          { name: '京都府', code: '26', cities: ['京都市中京区', '京都市下京区'], zip: '604' }
        ],
        maleNames: ['蓮', '大翔', '悠真', '陽翔', '湊', '一真', '健太', '拓也'],
        femaleNames: ['陽葵', '凛', '結菜', '芽依', '美咲', '花音', '結衣'],
        lastNames: ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村'],
        streets: ['銀座', '緑町', '本町', '道玄坂', '南青山', '桜丘町'],
        companies: ['ソラリス・テクノロジーズ株式会社', '大和デジタルソリューションズ', 'サクラ・イノベーションズ'],
        jobs: ['シニアエンジニア', 'プロジェクトマネージャー', 'UI/UXデザイナー'],
        idLabel: 'マイナンバー (My Number)',
        genId: () => \`\${rand(1000, 8999)} \${rand(1000, 8999)} \${rand(1000, 8999)}\`,
        genPhone: () => \`+81 090-\${rand(1000, 8999)}-\${rand(1000, 8999)}\`,
        format: (d) => ({
          single: \`〒\${d.zip} \${d.state}\${d.city}\${d.street} \${d.sec || ''} 日本\`,
          label: \`〒\${d.zip}\\n\${d.state} \${d.city}\\n\${d.street} \${d.sec || ''}\\n日本\`
        })
      },
      DE: {
        info: { name: 'Germany', flag: '🇩🇪', phonePrefix: '+49', currency: 'EUR (€)', tz: 'Europe/Berlin' },
        states: [
          { name: 'Bayern', code: 'BY', cities: ['München', 'Nürnberg'], zip: '80' },
          { name: 'Berlin', code: 'BE', cities: ['Berlin-Mitte', 'Charlottenburg'], zip: '101' },
          { name: 'Nordrhein-Westfalen', code: 'NW', cities: ['Köln', 'Düsseldorf'], zip: '50' }
        ],
        maleNames: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Lukas', 'Felix'],
        femaleNames: ['Emma', 'Mia', 'Hannah', 'Sophia', 'Emilia', 'Lina'],
        lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer'],
        streets: ['Hauptstraße', 'Bahnhofstraße', 'Schillerstraße', 'Goethestraße', 'Gartenstraße'],
        companies: ['Kaiser & Braun Industrietechnik GmbH', 'Bavaria Data Systems AG'],
        jobs: ['Entwicklungsleiter', 'Systemarchitekt', 'Senior Softwareentwickler'],
        idLabel: 'Steueridentifikationsnummer (IdNr)',
        genId: () => \`\${rand(10, 89)} \${rand(100, 899)} \${rand(100, 899)} \${rand(100, 899)}\`,
        genPhone: () => \`+49 30 \${rand(1000000, 8999999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.zip} \${d.city}, Deutschland\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip} \${d.city}\\nDeutschland\`
        })
      },
      FR: {
        info: { name: 'France', flag: '🇫🇷', phonePrefix: '+33', currency: 'EUR (€)', tz: 'Europe/Paris' },
        states: [
          { name: 'Île-de-France', code: 'IDF', cities: ['Paris', 'Boulogne-Billancourt'], zip: '750' },
          { name: 'Auvergne-Rhône-Alpes', code: 'ARA', cities: ['Lyon', 'Grenoble'], zip: '690' },
          { name: 'Provence-Alpes-Côte d’Azur', code: 'PACA', cities: ['Marseille', 'Nice'], zip: '130' }
        ],
        maleNames: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas'],
        femaleNames: ['Emma', 'Jade', 'Louise', 'Ambre', 'Alice', 'Chloé'],
        lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard'],
        streets: ['Rue de la Paix', 'Boulevard Saint-Germain', 'Avenue Victor Hugo', 'Rue de Paris'],
        companies: ['Lumio Solutions SAS', 'Hexagone Conseil & Systèmes'],
        jobs: ['Ingénieur Logiciel', 'Chef de Projet Digital', 'Directeur Artistique'],
        idLabel: 'Numéro de Sécurité Sociale (NIR)',
        genId: (b, g) => \`\${g === 'male' ? '1' : '2'} \${b.slice(2,4)} \${b.slice(5,7)} \${rand(10,89)} \${rand(100,899)} \${rand(100,899)} \${rand(10,89)}\`,
        genPhone: () => \`+33 06 \${rand(10,89)} \${rand(10,89)} \${rand(10,89)} \${rand(10,89)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ' (' + d.sec + ')' : ''}, \${d.zip} \${d.city}, France\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip} \${d.city}\\nFrance\`
        })
      },
      CA: {
        info: { name: 'Canada', flag: '🇨🇦', phonePrefix: '+1', currency: 'CAD (C$)', tz: 'America/Toronto' },
        states: [
          { name: 'Ontario', code: 'ON', cities: ['Toronto', 'Ottawa'], zip: 'M5' },
          { name: 'British Columbia', code: 'BC', cities: ['Vancouver', 'Victoria'], zip: 'V6' }
        ],
        maleNames: ['Liam', 'Noah', 'William', 'Benjamin', 'Lucas'],
        femaleNames: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava'],
        lastNames: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson'],
        streets: ['King St', 'Queen St', 'Yonge St', 'Bay St', 'Robson St'],
        companies: ['Great North Digital Corp', 'Maple Leaf Logic Systems'],
        jobs: ['Full Stack Developer', 'Cloud Engineer', 'Product Strategist'],
        idLabel: 'Social Insurance Number (SIN)',
        genId: () => \`\${rand(100,899)}-\${rand(100,899)}-\${rand(100,899)}\`,
        genPhone: () => \`+1 (416) \${rand(100,899)}-\${rand(1000,8999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.city}, \${d.stateCode} \${d.zip}, Canada\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.city} \${d.stateCode} \${d.zip}\\nCanada\`
        })
      },
      AU: {
        info: { name: 'Australia', flag: '🇦🇺', phonePrefix: '+61', currency: 'AUD (A$)', tz: 'Australia/Sydney' },
        states: [
          { name: 'New South Wales', code: 'NSW', cities: ['Sydney', 'Parramatta'], zip: '2000' },
          { name: 'Victoria', code: 'VIC', cities: ['Melbourne', 'Geelong'], zip: '3000' }
        ],
        maleNames: ['Oliver', 'Noah', 'Jack', 'William', 'Leo'],
        femaleNames: ['Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia'],
        lastNames: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown'],
        streets: ['George St', 'Pitt St', 'Collins St', 'Bourke St', 'Flinders Ln'],
        companies: ['Southern Cross Tech Pty Ltd', 'Opal Harbour Digital'],
        jobs: ['Solutions Architect', 'Product Designer', 'Operations Lead'],
        idLabel: 'Tax File Number (TFN)',
        genId: () => \`\${rand(100,899)} \${rand(100,899)} \${rand(100,899)}\`,
        genPhone: () => \`+61 4\${rand(1,9)} \${rand(100,899)} \${rand(100,899)}\`,
        format: (d) => ({
          single: \`\${d.sec ? d.sec + ', ' : ''}\${d.street}, \${d.city} \${d.stateCode} \${d.zip}, Australia\`,
          label: \`\${d.sec ? d.sec + '\\n' : ''}\${d.street}\\n\${d.city} \${d.stateCode} \${d.zip}\\nAustralia\`
        })
      },
      SG: {
        info: { name: 'Singapore', flag: '🇸🇬', phonePrefix: '+65', currency: 'SGD (S$)', tz: 'Asia/Singapore' },
        states: [
          { name: 'Central Region', code: 'CR', cities: ['Downtown Core', 'Orchard', 'Marina Bay'], zip: '01' }
        ],
        maleNames: ['Wei Jie', 'Jun Wei', 'Lucas', 'Ryan', 'Darren'],
        femaleNames: ['Jia Yi', 'Xin Yi', 'Rachel', 'Chloe', 'Nicole'],
        lastNames: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh'],
        streets: ['Orchard Road', 'Robinson Road', 'Shenton Way', 'Raffles Quay'],
        companies: ['Merlion Digital Capital', 'Lion City FinTech Labs'],
        jobs: ['VP of Engineering', 'FinTech Product Lead', 'Data Scientist'],
        idLabel: 'NRIC / FIN Number',
        genId: () => \`S\${rand(1000000, 8999999)}J\`,
        genPhone: () => \`+65 8\${rand(100,899)} \${rand(1000,8999)}\`,
        format: (d) => ({
          single: \`Blk \${rand(100,999)} \${d.street} \${d.sec || '#08-12'}, Singapore \${d.zip}\`,
          label: \`Blk \${rand(100,999)} \${d.street}\\n\${d.sec || '#08-12'}\\nSingapore \${d.zip}\`
        })
      },
      KR: {
        info: { name: 'South Korea', flag: '🇰🇷', phonePrefix: '+82', currency: 'KRW (₩)', tz: 'Asia/Seoul' },
        states: [
          { name: '서울특별시', code: '11', cities: ['강남구', '서초구', '마포구'], zip: '06' }
        ],
        maleNames: ['민준', '서준', '도윤', '예준', '시우', '하준'],
        femaleNames: ['서연', '서윤', '지우', '서현', '하은', '하윤'],
        lastNames: ['김', '이', '박', '최', '정', '강', '조'],
        streets: ['테헤란로', '강남대로', '세종대로', '을지로'],
        companies: ['한울 테크놀로지스', '넥스트웨이브 솔루션즈'],
        jobs: ['수석 개발자', '프로덕트 매니저', '플랫폼 아키텍트'],
        idLabel: '주민등록번호 (RRN)',
        genId: (b, g) => \`\${b.slice(2,4)}\${b.slice(5,7)}\${b.slice(8,10)}-\${g === 'male' ? '1' : '2'}\${rand(100000,899999)}\`,
        genPhone: () => \`+82 10-\${rand(1000,8999)}-\${rand(1000,8999)}\`,
        format: (d) => ({
          single: \`\${d.state} \${d.city} \${d.street} \${d.sec || ''} (우편번호: \${d.zip})\`,
          label: \`\${d.state} \${d.city}\\n\${d.street} \${d.sec || ''}\\n우편번호: \${d.zip}\\n대한민국\`
        })
      },
      IN: {
        info: { name: 'India', flag: '🇮🇳', phonePrefix: '+91', currency: 'INR (₹)', tz: 'Asia/Kolkata' },
        states: [
          { name: 'Maharashtra', code: 'MH', cities: ['Mumbai', 'Pune'], zip: '400' },
          { name: 'Karnataka', code: 'KA', cities: ['Bengaluru'], zip: '560' }
        ],
        maleNames: ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Arjun'],
        femaleNames: ['Aanya', 'Diya', 'Ananya', 'Isha', 'Myra'],
        lastNames: ['Sharma', 'Verma', 'Patel', 'Reddy', 'Singh', 'Kumar'],
        streets: ['Mahatma Gandhi Road', 'Brigade Road', 'Ring Road'],
        companies: ['Bharat Cloud Innovations', 'Indus Wave Infotech'],
        jobs: ['Technical Lead', 'Principal Architect', 'Data Engineer'],
        idLabel: 'Aadhaar (Mock Format)',
        genId: () => \`\${rand(1000,8999)} \${rand(1000,8999)} \${rand(1000,8999)}\`,
        genPhone: () => \`+91 98\${rand(10,89)} \${rand(100000,899999)}\`,
        format: (d) => ({
          single: \`\${d.sec ? d.sec + ', ' : ''}\${d.street}, \${d.city}, \${d.state} - \${d.zip}, India\`,
          label: \`\${d.sec ? d.sec + '\\n' : ''}\${d.street}\\n\${d.city}, \${d.state} - \${d.zip}\\nIndia\`
        })
      },
      IT: {
        info: { name: 'Italy', flag: '🇮🇹', phonePrefix: '+39', currency: 'EUR (€)', tz: 'Europe/Rome' },
        states: [
          { name: 'Lombardia', code: 'LOM', cities: ['Milano', 'Bergamo'], zip: '201' },
          { name: 'Lazio', code: 'LAZ', cities: ['Roma'], zip: '001' }
        ],
        maleNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo'],
        femaleNames: ['Sofia', 'Giulia', 'Aurora', 'Alice'],
        lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi'],
        streets: ['Via Roma', 'Corso Garibaldi', 'Via Dante Alighieri', 'Via Verdi'],
        companies: ['Milano Sistemi Digitali S.r.l.', 'Innovazione Adriatica SpA'],
        jobs: ['Ingegnere del Software', 'Product Designer'],
        idLabel: 'Codice Fiscale',
        genId: () => 'RSSMRA85M01H501Z',
        genPhone: () => \`+39 02 \${rand(1000000, 8999999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.zip} \${d.city} (Italia)\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip} \${d.city}\\nItalia\`
        })
      }
    };

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function choice(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // Luhn 算法生成有效校验位的测试信用卡号
    function genLuhnCard(prefix, len) {
      let num = prefix;
      while (num.length < len - 1) {
        num += Math.floor(Math.random() * 10).toString();
      }
      let sum = 0, d = true;
      for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num[i], 10);
        if (d) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        d = !d;
      }
      return num + ((10 - (sum % 10)) % 10).toString();
    }

    // 中国 18 位身份证 GB11643 标准算法
    function generateChinaID(birth, gender) {
      const b = birth.replace(/-/g, '');
      const area = choice(['110101', '310104', '440106', '440304', '330106', '510104']);
      let s = rand(0, 4) * 2 + (gender === 'male' ? 1 : 0);
      const prefix = \`\${area}\${b}\${rand(0, 9)}\${rand(0, 9)}\${s}\`;
      const w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const map = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let sum = 0;
      for (let i = 0; i < 17; i++) sum += parseInt(prefix[i], 10) * w[i];
      return prefix + map[sum % 11];
    }

    let currentAddress = null;
    let batchList = [];

    function populateStateSelect(countryCode) {
      const stateSel = document.getElementById('stateSelect');
      stateSel.innerHTML = '';
      const actualCode = countryCode === 'US_TAX_FREE' ? 'US' : countryCode;
      const isTaxFreeOnly = countryCode === 'US_TAX_FREE' || (document.getElementById('taxFreeCheck') && document.getElementById('taxFreeCheck').checked);
      const ds = DATASETS[actualCode] || DATASETS.US;

      if (actualCode === 'US') {
        if (isTaxFreeOnly) {
          const optAll = document.createElement('option');
          optAll.value = '__TAX_FREE__';
          optAll.textContent = '⭐ 五大免税州随机 (DE / OR / MT / NH / AK)';
          stateSel.appendChild(optAll);
          const group = document.createElement('optgroup');
          group.label = '🎁 美国五大零消费税州 (0% Sales Tax)';
          ds.states.filter(s => s.isTaxFree).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.textContent = \`🎁 \${s.name} (\${s.code}) · 0% 免税\`;
            group.appendChild(opt);
          });
          stateSel.appendChild(group);
        } else {
          const optDef = document.createElement('option');
          optDef.value = '';
          optDef.textContent = '-- 全境随机 --';
          stateSel.appendChild(optDef);

          const groupTaxFree = document.createElement('optgroup');
          groupTaxFree.label = '🎁 美国五大免税州推荐 (0% Sales Tax)';
          const optTf = document.createElement('option');
          optTf.value = '__TAX_FREE__';
          optTf.textContent = '⭐ 五大免税州随机 (DE / OR / MT / NH / AK)';
          groupTaxFree.appendChild(optTf);
          ds.states.filter(s => s.isTaxFree).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.textContent = \`🎁 \${s.name} (\${s.code}) · 0% 免税\`;
            groupTaxFree.appendChild(opt);
          });
          stateSel.appendChild(groupTaxFree);

          const groupOther = document.createElement('optgroup');
          groupOther.label = '美国其他各州';
          ds.states.filter(s => !s.isTaxFree).forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.textContent = \`\${s.name} (\${s.code})\`;
            groupOther.appendChild(opt);
          });
          stateSel.appendChild(groupOther);
        }
      } else {
        const optDef = document.createElement('option');
        optDef.value = '';
        optDef.textContent = '-- 全境随机 --';
        stateSel.appendChild(optDef);
        if (ds && ds.states) {
          ds.states.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.name;
            opt.textContent = s.name;
            stateSel.appendChild(opt);
          });
        }
      }
    }

    function selectTaxFreeShortcut() {
      document.getElementById('countrySelect').value = 'US';
      if (document.getElementById('taxFreeCheck')) document.getElementById('taxFreeCheck').checked = true;
      populateStateSelect('US');
      document.getElementById('stateSelect').value = '__TAX_FREE__';
      generateSingle();
      showToast('已切换至美国五大免税州模式 (0% 消费税)');
    }

    function onTaxFreeToggle() {
      const checked = document.getElementById('taxFreeCheck').checked;
      const cSel = document.getElementById('countrySelect');
      if (checked) {
        if (cSel.value !== 'US' && cSel.value !== 'US_TAX_FREE') {
          cSel.value = 'US';
        }
      }
      populateStateSelect(cSel.value);
      if (checked) {
        document.getElementById('stateSelect').value = '__TAX_FREE__';
      }
      generateSingle();
    }

    function quickSelectCountry(code) {
      document.getElementById('countrySelect').value = code;
      if (code !== 'US' && document.getElementById('taxFreeCheck')) {
        document.getElementById('taxFreeCheck').checked = false;
      }
      populateStateSelect(code);
      generateSingle();
    }

    function onCountryChange() {
      const code = document.getElementById('countrySelect').value;
      if (code === 'US_TAX_FREE') {
        if (document.getElementById('taxFreeCheck')) document.getElementById('taxFreeCheck').checked = true;
      } else if (code !== 'US') {
        if (document.getElementById('taxFreeCheck')) document.getElementById('taxFreeCheck').checked = false;
      }
      populateStateSelect(code);
      generateSingle();
    }

    function buildOneAddress(cCode, preferredState, preferredGender) {
      const isTaxFreeOpt =
        cCode === 'US_TAX_FREE' ||
        (document.getElementById('taxFreeCheck') && document.getElementById('taxFreeCheck').checked) ||
        preferredState === '__TAX_FREE__';
      const actualCode = cCode === 'US_TAX_FREE' ? 'US' : cCode;
      const ds = DATASETS[actualCode] || DATASETS.US;
      const gender = (preferredGender && preferredGender !== 'all') ? preferredGender : (Math.random() > 0.5 ? 'male' : 'female');
      const first = gender === 'male' ? choice(ds.maleNames) : choice(ds.femaleNames);
      const last = choice(ds.lastNames);
      const isAsian = ['CN', 'JP', 'KR'].includes(actualCode);
      const fullName = isAsian ? (last + first) : (first + ' ' + last);

      let candidateStates = ds.states;
      if (actualCode === 'US' && isTaxFreeOpt) {
        const taxFreeList = ds.states.filter(s => s.isTaxFree);
        if (taxFreeList.length > 0) candidateStates = taxFreeList;
      }

      let stateObj = candidateStates[0];
      if (preferredState && preferredState !== '__TAX_FREE__') {
        const found = ds.states.find(s => s.name === preferredState);
        if (found) stateObj = found;
      } else {
        stateObj = choice(candidateStates);
      }
      const city = choice(stateObj.cities);
      const zip = ds.info.name === 'China' ? stateObj.zip : (stateObj.zip + rand(10, 99));

      const street = (actualCode === 'CN' || actualCode === 'JP')
        ? (choice(ds.streets) + rand(1, 400) + '号')
        : (rand(10, 1999) + ' ' + choice(ds.streets));
      
      const sec = (actualCode === 'CN') ? (rand(1, 12) + '号楼' + rand(101, 1202) + '室') : ('Apt ' + rand(1, 300));
      
      const age = rand(21, 62);
      const birth = (new Date().getFullYear() - age) + '-' + String(rand(1, 12)).padStart(2, '0') + '-' + String(rand(1, 28)).padStart(2, '0');
      
      const cardType = 'Visa';
      const cardNumber = genLuhnCard('4532', 16);

      const formatted = ds.format({
        street, sec, city, state: stateObj.name, stateCode: stateObj.code, zip, country: ds.info.name
      });

      return {
        country: actualCode,
        countryName: ds.info.name,
        flag: ds.info.flag,
        currency: ds.info.currency,
        timezone: ds.info.tz,
        gender: gender === 'male' ? 'Male' : 'Female',
        firstName: first,
        lastName: last,
        fullName,
        age,
        birthDate: birth,
        street,
        secondary: sec,
        city,
        state: stateObj.name,
        stateCode: stateObj.code,
        isTaxFree: Boolean(stateObj.isTaxFree),
        postalCode: zip,
        phone: ds.genPhone(),
        email: (first.toLowerCase() + '.' + last.toLowerCase() + rand(10, 99) + '@example.org').replace(/[^a-z0-9@.]/g, ''),
        username: (first.toLowerCase() + '_' + rand(100, 999)).replace(/[^a-z0-9_]/g, ''),
        coords: (rand(20, 50) + '.' + rand(100000, 999999)) + ', ' + (rand(-120, 120) + '.' + rand(100000, 999999)),
        nationalIdName: ds.idLabel,
        nationalId: ds.genId(birth, gender),
        cardType,
        cardNumber: cardNumber.replace(/(\\d{4})(?=\\d)/g, '$1 '),
        cardExp: String(rand(1, 12)).padStart(2, '0') + '/' + (new Date().getFullYear() + rand(2, 5)).toString().slice(-2),
        cardCvv: String(rand(100, 999)),
        company: choice(ds.companies),
        job: choice(ds.jobs),
        fullAddressSingleLine: formatted.single,
        fullMailingLabel: formatted.label
      };
    }

    function generateSingle() {
      const c = document.getElementById('countrySelect').value;
      const s = document.getElementById('stateSelect').value;
      const g = document.getElementById('genderSelect').value;
      currentAddress = buildOneAddress(c, s, g);

      // 渲染至 UI
      document.getElementById('cardFlag').textContent = currentAddress.flag;
      document.getElementById('cardFullName').textContent = currentAddress.fullName;
      document.getElementById('cardGender').textContent = currentAddress.gender;
      document.getElementById('cardCountryMeta').textContent = \`\${currentAddress.countryName} · \${currentAddress.currency} · \${currentAddress.timezone}\`;

      const badge = document.getElementById('cardTaxFreeBadge');
      if (badge) {
        if (currentAddress.isTaxFree) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      document.getElementById('valStreet').textContent = currentAddress.street;
      document.getElementById('valSecondary').textContent = currentAddress.secondary;
      document.getElementById('valCity').textContent = currentAddress.city;
      document.getElementById('valState').textContent = currentAddress.isTaxFree
        ? \`\${currentAddress.state} (\${currentAddress.stateCode}) · [0% 消费税免税州]\`
        : \`\${currentAddress.state} (\${currentAddress.stateCode})\`;
      document.getElementById('valZip').textContent = currentAddress.postalCode;
      document.getElementById('valCoords').textContent = currentAddress.coords;

      document.getElementById('valFullName').textContent = currentAddress.fullName;
      document.getElementById('valBirthday').textContent = \`\${currentAddress.birthDate} (\${currentAddress.age} 岁)\`;
      document.getElementById('valPhone').textContent = currentAddress.phone;
      document.getElementById('valEmail').textContent = currentAddress.email;
      document.getElementById('valUsername').textContent = currentAddress.username;
      document.getElementById('valCompany').textContent = currentAddress.company;
      document.getElementById('valJob').textContent = currentAddress.job;

      document.getElementById('lblNationalId').textContent = currentAddress.nationalIdName;
      document.getElementById('valNationalId').textContent = currentAddress.nationalId;
      document.getElementById('valCardNumber').textContent = currentAddress.cardNumber;
      document.getElementById('valCardExp').textContent = currentAddress.cardExp;
      document.getElementById('valCardCvv').textContent = currentAddress.cardCvv;

      document.getElementById('valMailingLabel').textContent = currentAddress.fullMailingLabel;
    }

    function copyToClipboard(text, msg = '已成功复制') {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast(msg));
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(msg);
      }
    }

    function copyField(elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        copyToClipboard(el.textContent.trim(), '已复制: ' + el.textContent.trim());
      }
    }

    function copyFullAddress() {
      if (currentAddress) {
        copyToClipboard(currentAddress.fullAddressSingleLine, '完整单行地址已复制');
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toastMsg');
      toastMsg.textContent = msg;
      toast.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        toast.classList.remove('opacity-100', 'translate-y-0');
      }, 2000);
    }

    function switchTab(tab) {
      const singleView = document.getElementById('singleView');
      const batchView = document.getElementById('batchView');
      const tabBtnSingle = document.getElementById('tabBtnSingle');
      const tabBtnBatch = document.getElementById('tabBtnBatch');

      if (tab === 'single') {
        singleView.classList.remove('hidden');
        batchView.classList.add('hidden');
        tabBtnSingle.className = 'px-3 py-1.5 rounded-md text-blue-600 bg-blue-50 font-medium';
        tabBtnBatch.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100';
      } else {
        singleView.classList.add('hidden');
        batchView.classList.remove('hidden');
        tabBtnBatch.className = 'px-3 py-1.5 rounded-md text-blue-600 bg-blue-50 font-medium';
        tabBtnSingle.className = 'px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100';
        if (batchList.length === 0) runBatchGenerate();
      }
    }

    function runBatchGenerate() {
      const count = parseInt(document.getElementById('batchCount').value, 10) || 10;
      const c = document.getElementById('countrySelect').value;
      const s = document.getElementById('stateSelect').value;
      const g = document.getElementById('genderSelect').value;
      batchList = [];
      for (let i = 0; i < count; i++) {
        batchList.push(buildOneAddress(c, s, g));
      }
      renderBatchTable();
    }

    function renderBatchTable() {
      const tbody = document.getElementById('batchTableBody');
      tbody.innerHTML = '';
      batchList.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/60';
        tr.innerHTML = \`
          <td class="py-2.5 px-3 font-medium">\${item.flag} \${item.countryName}</td>
          <td class="py-2.5 px-3 font-semibold text-slate-900">\${item.fullName}</td>
          <td class="py-2.5 px-3 text-slate-600 truncate max-w-xs">\${item.street}\${item.secondary ? ', ' + item.secondary : ''}</td>
          <td class="py-2.5 px-3 text-slate-600 whitespace-nowrap">
            <span>\${item.city}, \${item.stateCode}</span>
            \${item.isTaxFree ? '<span class="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 font-semibold font-mono border border-emerald-200">0%免税</span>' : ''}
          </td>
          <td class="py-2.5 px-3 font-mono font-bold text-blue-600">\${item.postalCode}</td>
          <td class="py-2.5 px-3 font-mono">\${item.phone}</td>
          <td class="py-2.5 px-3">
            <button onclick="copyToClipboard('\${item.fullAddressSingleLine.replace(/'/g, "\\\\'")}', '地址已复制')" class="text-blue-600 hover:text-blue-800 font-medium">复制</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function exportBatch(type) {
      if (!batchList.length) return;
      let content = '', filename = '', mime = '';
      if (type === 'json') {
        content = JSON.stringify(batchList, null, 2);
        filename = \`geomock_\${Date.now()}.json\`;
        mime = 'application/json';
      } else if (type === 'csv') {
        const headers = ['Country', 'FullName', 'Street', 'City', 'State', 'Zip', 'Phone', 'Email', 'NationalID'];
        const rows = batchList.map(a => [
          \`"\${a.countryName}"\`, \`"\${a.fullName}"\`, \`"\${a.street}"\`, \`"\${a.city}"\`, \`"\${a.state}"\`, \`"\${a.postalCode}"\`, \`"\${a.phone}"\`, \`"\${a.email}"\`, \`"\${a.nationalId}"\`
        ].join(','));
        content = [headers.join(','), ...rows].join('\\n');
        filename = \`geomock_\${Date.now()}.csv\`;
        mime = 'text/csv';
      } else {
        content = batchList.map((a, i) => \`#\${i+1} [\${a.countryName}] \${a.fullName} | \${a.fullAddressSingleLine} | Phone: \${a.phone} | ID: \${a.nationalId}\`).join('\\n\\n');
        filename = \`geomock_\${Date.now()}.txt\`;
        mime = 'text/plain';
      }
      const blob = new Blob([content], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // 初始化
    window.addEventListener('DOMContentLoaded', () => {
      populateStateSelect('US');
      generateSingle();
    });
  </script>
</body>
</html>
`;
