const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

// 1. Read and minify qrcode-generator
const qrRaw = fs.readFileSync(path.resolve(__dirname, '../node_modules/qrcode-generator/dist/qrcode.js'), 'utf8');
const qrMinified = esbuild.transformSync(qrRaw, { minify: true }).code;

// 2. Build the complete offline HTML
const offlineHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GeoMock - 全球真实地址与测试身份生成器 (100% 纯离线单文件版)</title>
  <meta name="description" content="100% 离线独立运行的真实全球地址生成器，无任何外部 CDN 依赖，支持美英中日德法等12国地址、美国五大免税州、离线SVG二维码、批量生成导出与一键复制。">
  <style>
    /* 100% 纯原生离线 CSS 样式库 (零 CDN / 零外部网络请求) */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { min-height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; background-color: #f8fafc; color: #0f172a; line-height: 1.5; font-size: 14px; -webkit-font-smoothing: antialiased; }
    
    /* 基础布局 */
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
    .container { max-width: 1280px; width: 100%; margin: 0 auto; padding: 20px 16px; }
    .flex { display: flex; }
    .inline-flex { display: inline-flex; }
    .flex-col { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .flex-1 { flex: 1 1 0%; }
    .shrink-0 { flex-shrink: 0; }
    .hidden { display: none !important; }
    
    .gap-1 { gap: 4px; }
    .gap-1-5 { gap: 6px; }
    .gap-2 { gap: 8px; }
    .gap-2-5 { gap: 10px; }
    .gap-3 { gap: 12px; }
    .gap-4 { gap: 16px; }
    .gap-6 { gap: 24px; }

    .space-y-4 > * + * { margin-top: 16px; }
    .space-y-6 > * + * { margin-top: 24px; }

    /* 顶部导航条 */
    .top-header { background-color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    .header-inner { max-width: 1280px; margin: 0 auto; padding: 0 16px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
    .brand-logo { font-size: 17px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .brand-icon { width: 32px; height: 32px; border-radius: 8px; background: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; }
    
    .nav-tabs { display: flex; align-items: center; gap: 4px; }
    .nav-tab-btn { padding: 6px 12px; font-size: 13px; font-weight: 500; border-radius: 8px; border: none; background: transparent; color: #475569; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 6px; }
    .nav-tab-btn:hover { background-color: #f1f5f9; color: #0f172a; }
    .nav-tab-btn.active { background-color: #eff6ff; color: #2563eb; font-weight: 700; }
    
    .offline-badge { font-size: 11px; padding: 2px 7px; border-radius: 20px; font-weight: 700; background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; display: inline-flex; align-items: center; gap: 4px; }
    .offline-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

    /* 卡片容器 */
    .card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    
    /* 快捷选项条 */
    .quick-bar { display: flex; align-items: center; gap: 6px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .quick-bar::-webkit-scrollbar { display: none; }
    .pill-btn { padding: 5px 10px; font-size: 12px; font-weight: 500; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #334155; cursor: pointer; white-space: nowrap; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 4px; }
    .pill-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
    .pill-btn.active { background: #2563eb; border-color: #2563eb; color: #ffffff; font-weight: 600; }
    .pill-tax-free { background: #ecfdf5; border-color: #6ee7b7; color: #065f46; font-weight: 600; }
    .pill-tax-free:hover { background: #d1fae5; border-color: #34d399; }
    .pill-tax-free.active { background: #059669; border-color: #059669; color: #ffffff; }

    /* 免税州专属提醒横幅 */
    .tax-free-banner { padding: 12px 16px; border-radius: 10px; border: 1px solid #a7f3d0; background: #ecfdf5; color: #064e3b; font-size: 12px; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .tax-free-banner.inactive { background: #f8fafc; border-color: #e2e8f0; color: #475569; }
    
    /* 表单控件网格 */
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    @media (min-width: 640px) { .form-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 840px) { .form-grid { grid-template-columns: repeat(4, 1fr); } }
    
    .field-label { display: block; font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 5px; }
    .field-select { width: 100%; height: 38px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 0 10px; font-size: 13px; font-weight: 500; color: #0f172a; outline: none; transition: all 0.15s ease; cursor: pointer; }
    .field-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
    .field-select.tax-free-active { background-color: #f0fdf4; border-color: #34d399; color: #064e3b; font-weight: 600; }

    /* 按钮系统 */
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; font-size: 12px; font-weight: 600; border-radius: 8px; border: 1px solid transparent; cursor: pointer; transition: all 0.15s ease; user-select: none; text-decoration: none; line-height: 1; height: 38px; }
    .btn:active { transform: scale(0.98); }
    .btn-primary { background: #2563eb; color: #ffffff; border-color: #2563eb; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-secondary { background: #ffffff; color: #334155; border-color: #cbd5e1; }
    .btn-secondary:hover { background: #f8fafc; border-color: #94a3b8; }
    .btn-emerald { background: #059669; color: #ffffff; border-color: #059669; }
    .btn-emerald:hover { background: #047857; }
    .btn-sm { height: 30px; padding: 4px 10px; font-size: 11px; }

    /* 地址信息卡片内部结构 */
    .card-header-bar { display: flex; flex-direction: column; gap: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 16px; }
    @media (min-width: 768px) { .card-header-bar { flex-direction: row; align-items: center; justify-content: space-between; } }
    
    .avatar-flag { font-size: 38px; line-height: 1; }
    .person-name { font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 600; background: #f1f5f9; color: #475569; }
    .tag-blue { background: #eff6ff; color: #1d4ed8; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; }
    .tag-tax-free { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; font-weight: 700; }

    .sub-meta-line { font-size: 12px; color: #64748b; margin-top: 4px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .meta-dot { color: #cbd5e1; }

    /* 三栏字段展示网格 */
    .detail-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 768px) { .detail-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .detail-grid { grid-template-columns: repeat(3, 1fr); } }

    .column-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .field-list { display: flex; flex-direction: column; gap: 8px; }
    
    .field-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 11px; display: flex; flex-direction: column; gap: 2px; transition: background 0.15s ease; }
    .field-item:hover { background: #f1f5f9; }
    .field-top { display: flex; align-items: center; justify-content: space-between; }
    .field-key { font-size: 11px; font-weight: 500; color: #64748b; }
    .copy-chip { font-size: 10px; font-weight: 600; color: #2563eb; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px 6px; cursor: pointer; transition: all 0.15s; }
    .copy-chip:hover { background: #eff6ff; border-color: #93c5fd; }
    .field-val { font-size: 13px; font-weight: 600; color: #0f172a; word-break: break-all; }
    .field-val.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace; }
    .field-val.blue-highlight { color: #2563eb; font-weight: 700; font-size: 14px; }
    .field-val.emerald-highlight { color: #059669; }

    /* 离线二维码面板 */
    .qr-panel { margin-top: 16px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; flex-direction: column; gap: 16px; }
    @media (min-width: 768px) { .qr-panel { flex-direction: row; align-items: flex-start; } }
    .qr-box { background: #ffffff; padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column; align-items: center; gap: 8px; shrink-0; }
    .qr-box svg { width: 140px; height: 140px; display: block; }
    .qr-info-wrap { flex: 1; display: flex; flex-direction: column; gap: 10px; }
    .qr-preview-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 11px; font-family: monospace; color: #334155; word-break: break-all; max-height: 80px; overflow-y: auto; }

    /* 批量生成表格 */
    .table-container { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; }
    .batch-table { width: 100%; border-collapse: collapse; font-size: 12px; text-align: left; }
    .batch-table th { background: #f8fafc; color: #475569; font-weight: 600; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    .batch-table td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    .batch-table tr:hover { background-color: #f8fafc; }
    .batch-table tr:last-child td { border-bottom: none; }

    /* 收藏夹与历史列表 */
    .saved-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @media (min-width: 640px) { .saved-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .saved-grid { grid-template-columns: repeat(3, 1fr); } }
    .saved-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 6px; transition: all 0.15s; }
    .saved-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.04); }

    /* 吐司通知 (Toast) */
    .toast-box { position: fixed; bottom: 24px; right: 24px; z-index: 100; transform: translateY(30px); opacity: 0; pointer-events: none; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); background: #0f172a; color: #ffffff; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; }
    .toast-box.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
    .toast-icon { color: #10b981; }

    /* 页脚 */
    .footer { border-top: 1px solid #e2e8f0; padding: 24px 16px; text-align: center; font-size: 12px; color: #64748b; margin-top: auto; background: #ffffff; }
  </style>
</head>
<body>
  <div class="app-wrapper">
    
    <!-- 顶部导航条 -->
    <header class="top-header">
      <div class="header-inner">
        <a href="#" class="brand-logo" onclick="switchMainTab('single'); return false;">
          <div class="brand-icon">GM</div>
          <span>GeoMock 离线版</span>
        </a>

        <nav class="nav-tabs">
          <button id="navBtnSingle" class="nav-tab-btn active" onclick="switchMainTab('single')">
            <span>📍 地址生成</span>
          </button>
          <button id="navBtnBatch" class="nav-tab-btn" onclick="switchMainTab('batch')">
            <span>📑 批量导出</span>
          </button>
          <button id="navBtnSaved" class="nav-tab-btn" onclick="switchMainTab('saved')">
            <span>⭐ 本地收藏 (<span id="savedCountNum">0</span>)</span>
          </button>
        </nav>

        <div class="offline-badge" title="本文件已内嵌全部代码与样式，无任何外网依赖，脱机运行">
          <span class="offline-dot"></span>
          <span>100% 离线脱机</span>
        </div>
      </div>
    </header>

    <!-- 主体容器 -->
    <main class="container">
      
      <!-- ================= 选项卡 1: 单条地址生成 ================= -->
      <section id="viewSingle" class="space-y-6">
        
        <!-- 过滤器控制卡片 -->
        <div class="card space-y-4">
          <!-- 快捷药丸筛选 -->
          <div class="flex items-center gap-2">
            <span style="font-size: 12px; font-weight: 600; color: #64748b; white-space: nowrap;">快捷入口:</span>
            <div class="quick-bar">
              <button id="pillTaxFree" class="pill-btn pill-tax-free" onclick="selectTaxFreeShortcut()">
                <span>🎁 美国五大免税州 (0% 消费税)</span>
              </button>
              <button id="pill-US" class="pill-btn" onclick="quickSelectCountry('US')">🇺🇸 美国</button>
              <button id="pill-GB" class="pill-btn" onclick="quickSelectCountry('GB')">🇬🇧 英国</button>
              <button id="pill-CN" class="pill-btn" onclick="quickSelectCountry('CN')">🇨🇳 中国</button>
              <button id="pill-JP" class="pill-btn" onclick="quickSelectCountry('JP')">🇯🇵 日本</button>
              <button id="pill-DE" class="pill-btn" onclick="quickSelectCountry('DE')">🇩🇪 德国</button>
              <button id="pill-FR" class="pill-btn" onclick="quickSelectCountry('FR')">🇫🇷 法国</button>
              <button id="pill-CA" class="pill-btn" onclick="quickSelectCountry('CA')">🇨🇦 加拿大</button>
              <button id="pill-AU" class="pill-btn" onclick="quickSelectCountry('AU')">🇦🇺 澳大利亚</button>
              <button id="pill-SG" class="pill-btn" onclick="quickSelectCountry('SG')">🇸🇬 新加坡</button>
              <button id="pill-KR" class="pill-btn" onclick="quickSelectCountry('KR')">🇰🇷 韩国</button>
            </div>
          </div>

          <!-- 美国免税州选项激活卡 -->
          <div id="taxFreeOptionCard" class="tax-free-banner inactive">
            <div class="flex items-start gap-2">
              <span style="font-size: 18px; line-height: 1;">🎁</span>
              <div>
                <div style="font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                  <span>美国免税州选项 (0% State Sales Tax)</span>
                  <span id="taxFreeStatusTag" class="tag">未开启</span>
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                  特拉华 (DE) · 俄勒冈 (OR) · 蒙大拿 (MT) · 新罕布什尔 (NH) · 阿拉斯加 (AK) · 适合海淘转运仓及跨境计税验证
                </div>
              </div>
            </div>
            <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-weight: 600; font-size: 12px; white-space: nowrap;">
              <input type="checkbox" id="taxFreeToggleCheck" onchange="onTaxFreeToggle(this.checked)" style="width: 16px; height: 16px; accent-color: #059669; cursor: pointer;">
              <span>仅限美国免税州</span>
            </label>
          </div>

          <!-- 下拉框选择网格 -->
          <div class="form-grid" style="padding-top: 4px;">
            <div>
              <label class="field-label" for="selCountry">国家 / 地区</label>
              <select id="selCountry" class="field-select" onchange="onCountryDropdownChange()">
                <optgroup label="🇺🇸 美国专区 (含免税专选)">
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
              <div class="flex items-center justify-between" style="margin-bottom: 5px;">
                <label class="field-label" for="selState" style="margin-bottom: 0;">州 / 省份</label>
                <span id="stateModeTip" style="font-size: 11px; font-weight: 600; color: #059669; display: none;">0% 免税模式</span>
              </div>
              <select id="selState" class="field-select" onchange="onStateDropdownChange()">
                <option value="">-- 全境随机 --</option>
              </select>
            </div>

            <div>
              <label class="field-label" for="selGender">性别偏好</label>
              <select id="selGender" class="field-select">
                <option value="all">男女随机</option>
                <option value="male">男性 (Male)</option>
                <option value="female">女性 (Female)</option>
              </select>
            </div>

            <div class="flex items-center gap-2" style="align-self: flex-end;">
              <button class="btn btn-primary flex-1" onclick="generateSingleAddress()">
                <span>⚡ 生成真实地址</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 详细地址展示卡片 -->
        <div class="card">
          <!-- 头部横幅 -->
          <div class="card-header-bar">
            <div class="flex items-center gap-3">
              <span id="cardFlag" class="avatar-flag">🇺🇸</span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 id="cardFullName" class="person-name">John Smith</h1>
                  <span id="cardGenderTag" class="tag">Male</span>
                  <span id="cardAgeTag" class="tag tag-blue">32 岁</span>
                  <span id="cardTaxFreeBadge" class="badge-tax-free hidden">
                    <span>🎁</span>
                    <span>0% 消费税免税州</span>
                  </span>
                </div>
                <div class="sub-meta-line">
                  <span id="cardCountry">United States</span>
                  <span class="meta-dot">·</span>
                  <span id="cardStateCity">California, Los Angeles</span>
                  <span class="meta-dot">·</span>
                  <span id="cardPostal" style="font-family: monospace; font-weight: 700; color: #2563eb;">90012</span>
                  <span class="meta-dot">·</span>
                  <span id="cardPhone">+1 (213) 555-0192</span>
                </div>
              </div>
            </div>

            <!-- 快捷操作栏 -->
            <div class="flex items-center gap-2 flex-wrap">
              <button class="btn btn-secondary btn-sm" onclick="toggleQrPanel()">
                <span>📱 手机扫码</span>
              </button>
              <button id="btnFavCurrent" class="btn btn-secondary btn-sm" onclick="toggleFavoriteCurrent()">
                <span>⭐ 收藏</span>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="copyFullSingleLine()">
                <span>📋 复制单行格式</span>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="copyMailingLabel()">
                <span>✉️ 复制信封标签</span>
              </button>
              <button class="btn btn-primary btn-sm" onclick="copyFullJson()">
                <span>⚙️ 复制 JSON</span>
              </button>
            </div>
          </div>

          <!-- 免税州说明横幅 (当处于免税州时显现) -->
          <div id="cardTaxFreeNotice" class="tax-free-banner hidden" style="margin-bottom: 16px;">
            <span style="font-size: 16px;">🎁</span>
            <div>
              <strong>美国免税州真实地址 (0% State Sales Tax)：</strong>
              当前地址位于 <span id="noticeStateName" style="font-weight: 700;">特拉华州 (DE)</span>，属于美国五大免消费税州之一。常用于海淘转运仓、独立站与电商结算免税测试、Stripe/PayPal 计税逻辑校验等场景。
            </div>
          </div>

          <!-- 离线二维码面板 (点击展开) -->
          <div id="qrPanel" class="qr-panel hidden">
            <div class="qr-box">
              <div id="qrContainer"></div>
              <button class="btn btn-secondary btn-sm" onclick="downloadQrSvgFile()" style="width: 100%; margin-top: 4px;">
                <span>💾 下载 SVG 二维码</span>
              </button>
            </div>
            <div class="qr-info-wrap">
              <div style="font-size: 12px; font-weight: 700; color: #0f172a;">离线二维码扫描 (纯本地生成，无需联网)</div>
              <div class="flex items-center gap-2">
                <span style="font-size: 11px; color: #64748b;">编码格式:</span>
                <button id="qrModeText" class="pill-btn active" onclick="setQrMode('text')">📍 单行文本地址</button>
                <button id="qrModeGeo" class="pill-btn" onclick="setQrMode('geo')">🗺️ 地图 Geo URI</button>
                <button id="qrModeJson" class="pill-btn" onclick="setQrMode('json')">⚙️ 结构化 JSON</button>
              </div>
              <div class="qr-preview-box" id="qrPreviewText"></div>
            </div>
          </div>

          <!-- 三栏结构化数据详情 -->
          <div class="detail-grid">
            
            <!-- 栏 1: 地理与住址 -->
            <div class="field-list">
              <div class="column-title">📍 地理与住址 (Address & Location)</div>
              
              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">街道门牌 (Street Number)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valStreetNum')">复制</button>
                </div>
                <div id="valStreetNum" class="field-val mono">742</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">街道名称 (Street Name)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valStreetName')">复制</button>
                </div>
                <div id="valStreetName" class="field-val">Evergreen Terrace</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">完整街道地址 (Full Street Address)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valFullStreet')">复制</button>
                </div>
                <div id="valFullStreet" class="field-val">742 Evergreen Terrace</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">次级地址 (Apt / Suite / Room)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valSecondary')">复制</button>
                </div>
                <div id="valSecondary" class="field-val">Apt 102</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">城市 (City / District)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCity')">复制</button>
                </div>
                <div id="valCity" class="field-val">Springfield</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">州 / 省份 (State / Province)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valState')">复制</button>
                </div>
                <div id="valState" class="field-val">California (CA)</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">邮政编码 (Postal / ZIP Code)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valPostal')">复制</button>
                </div>
                <div id="valPostal" class="field-val blue-highlight mono">90012</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">GPS 经纬度 (Lat, Lng)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCoords')">复制</button>
                </div>
                <div id="valCoords" class="field-val mono">34.052200, -118.243700</div>
              </div>
            </div>

            <!-- 栏 2: 个人与联络信息 -->
            <div class="field-list">
              <div class="column-title">👤 个人与联络信息 (Personal Details)</div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">真实姓名 (Full Name)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valFullName')">复制</button>
                </div>
                <div id="valFullName" class="field-val">John Smith</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">名字 / 姓氏 (First / Last)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valFirstLastName')">复制</button>
                </div>
                <div id="valFirstLastName" class="field-val">John / Smith</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">性别 (Gender)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valGender')">复制</button>
                </div>
                <div id="valGender" class="field-val">男性 (Male)</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">出生日期 / 年龄 (Birth & Age)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valBirthAge')">复制</button>
                </div>
                <div id="valBirthAge" class="field-val mono">1992-05-18 (32 岁)</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">电话号码 (Phone)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valPhone')">复制</button>
                </div>
                <div id="valPhone" class="field-val mono">+1 (213) 555-0192</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">电子邮箱 (Email)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valEmail')">复制</button>
                </div>
                <div id="valEmail" class="field-val">john.smith82@gmail-mock.com</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">虚拟用户名 (Username)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valUsername')">复制</button>
                </div>
                <div id="valUsername" class="field-val mono">john_smith82</div>
              </div>
            </div>

            <!-- 栏 3: 证件、测试卡与机构 -->
            <div class="field-list">
              <div class="column-title">💳 证件与测试卡 (Testing Identity)</div>

              <div class="field-item">
                <div class="field-top">
                  <span id="lblIdName" class="field-key">国家法定证件 (SSN)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valIdNumber')">复制</button>
                </div>
                <div id="valIdNumber" class="field-val mono">982-45-6712</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">测试信用卡号 (Luhn 校验通过)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCardNumber')">复制</button>
                </div>
                <div id="valCardNumber" class="field-val mono">4532 8912 3456 7810</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">卡片品牌 (Card Type)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCardBrand')">复制</button>
                </div>
                <div id="valCardBrand" class="field-val">Visa</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">有效期 / CVV 安全码</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCardExpCvv')">复制</button>
                </div>
                <div id="valCardExpCvv" class="field-val mono">08/29 · CVV: 482</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">所属公司 (Company)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valCompany')">复制</button>
                </div>
                <div id="valCompany" class="field-val">Horizon Cloud Systems</div>
              </div>

              <div class="field-item">
                <div class="field-top">
                  <span class="field-key">职位头衔 (Job Title)</span>
                  <button class="copy-chip" onclick="copyFieldValue('valJobTitle')">复制</button>
                </div>
                <div id="valJobTitle" class="field-val">Software Engineer</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ================= 选项卡 2: 批量生成与导出 ================= -->
      <section id="viewBatch" class="space-y-6 hidden">
        <div class="card space-y-4">
          <div style="font-weight: 700; font-size: 15px; color: #0f172a;">批量生成测试数据</div>
          
          <div class="form-grid">
            <div>
              <label class="field-label" for="batchCountry">指定国家</label>
              <select id="batchCountry" class="field-select">
                <option value="">🌍 各国随机混合</option>
                <optgroup label="🇺🇸 美国专区">
                  <option value="US">🇺🇸 美国 · 全部州</option>
                  <option value="US_TAX_FREE">🎁 🇺🇸 美国五大免税州 (0% 消费税专选)</option>
                </optgroup>
                <optgroup label="其他国家">
                  <option value="GB">🇬🇧 英国 (United Kingdom)</option>
                  <option value="CN">🇨🇳 中国 (China)</option>
                  <option value="JP">🇯🇵 日本 (Japan)</option>
                  <option value="DE">🇩🇪 德国 (Germany)</option>
                  <option value="FR">🇫🇷 法国 (France)</option>
                  <option value="CA">🇨🇦 加拿大 (Canada)</option>
                  <option value="AU">🇦🇺 澳大利亚 (Australia)</option>
                  <option value="SG">🇸🇬 新加坡 (Singapore)</option>
                  <option value="KR">🇰🇷 韩国 (South Korea)</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label class="field-label" for="batchCount">生成记录数量</label>
              <select id="batchCount" class="field-select">
                <option value="5">5 条测试记录</option>
                <option value="10" selected>10 条测试记录</option>
                <option value="20">20 条测试记录</option>
                <option value="50">50 条测试记录</option>
                <option value="100">100 条测试记录 (上限)</option>
              </select>
            </div>

            <div>
              <label class="field-label" for="batchGender">性别过滤</label>
              <select id="batchGender" class="field-select">
                <option value="all">男女随机</option>
                <option value="male">男性 (Male)</option>
                <option value="female">女性 (Female)</option>
              </select>
            </div>

            <div class="flex items-center gap-2" style="align-self: flex-end;">
              <button class="btn btn-primary flex-1" onclick="executeBatchGeneration()">
                <span>🚀 开始批量生成</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 批量表格卡片 -->
        <div class="card space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span style="font-weight: 700; color: #0f172a;">批量生成列表</span>
              <span id="batchCountLabel" style="font-size: 12px; color: #64748b; margin-left: 6px;">(共 10 条记录)</span>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap">
              <button class="btn btn-secondary btn-sm" onclick="exportBatchData('json')">
                <span>💾 导出 JSON 文件</span>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="exportBatchData('csv')">
                <span>📊 导出 CSV 表格</span>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="exportBatchData('txt')">
                <span>📝 导出 TXT 纯文本</span>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="copyBatchJsonAll()">
                <span>📋 复制全部 JSON</span>
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="batch-table">
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th>国家</th>
                  <th>姓名 (性别)</th>
                  <th>街道住址</th>
                  <th>城市 / 州省 (免税状态)</th>
                  <th>邮政编码</th>
                  <th>电话</th>
                  <th style="text-align: right;">操作</th>
                </tr>
              </thead>
              <tbody id="batchTableBody">
                <!-- 动态填充 -->
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ================= 选项卡 3: 本地收藏与历史 ================= -->
      <section id="viewSaved" class="space-y-6 hidden">
        <div class="card space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span style="font-weight: 700; font-size: 15px; color: #0f172a;">本地已收藏地址</span>
              <span style="font-size: 12px; color: #64748b; margin-left: 6px;">(保存在浏览器本地 localStorage 中，断网离线永久保留)</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="clearAllFavorites()">
              <span>🗑️ 清空收藏</span>
            </button>
          </div>

          <div id="savedEmptyState" style="padding: 40px 16px; text-align: center; color: #94a3b8; font-size: 13px;">
            暂无已收藏的地址。在“地址生成”页面点击“⭐ 收藏”即可保存常用测试数据。
          </div>

          <div id="savedGrid" class="saved-grid">
            <!-- 动态填充 -->
          </div>
        </div>
      </section>

    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div><strong>GeoMock 离线单文件版</strong> · 全球真实格式测试数据与模拟身份生成器</div>
      <div style="margin-top: 4px; font-size: 11px;">100% 客户端离线执行 · 零外部网络依赖 · 零服务器上传 · 适合离线内网、自动化测试与海淘免税验证</div>
    </footer>

    <!-- 浮动吐司通知 -->
    <div id="toast" class="toast-box">
      <span class="toast-icon">✓</span>
      <span id="toastText">已成功复制到剪贴板</span>
    </div>

  </div>

  <!-- ================= 核心独立离线脚本库 ================= -->
  <script>
    /* 嵌入式纯 JS 离线二维码生成引擎 */
    ${qrMinified}

    /* 真实各国数据集 (包含美国五大零消费税州) */
    const DATASETS = {
      US: {
        info: { name: 'United States', flag: '🇺🇸', phonePrefix: '+1', currency: 'USD ($)', tz: 'America/New_York' },
        states: [
          // 5 US Tax-Free States (0% State Sales Tax)
          { name: 'Delaware', code: 'DE', isTaxFree: true, cities: ['Wilmington', 'New Castle', 'Newark', 'Dover'], zip: '198' },
          { name: 'Oregon', code: 'OR', isTaxFree: true, cities: ['Portland', 'Eugene', 'Salem', 'Beaverton'], zip: '972' },
          { name: 'Montana', code: 'MT', isTaxFree: true, cities: ['Billings', 'Missoula', 'Bozeman', 'Helena'], zip: '591' },
          { name: 'New Hampshire', code: 'NH', isTaxFree: true, cities: ['Manchester', 'Nashua', 'Concord'], zip: '031' },
          { name: 'Alaska', code: 'AK', isTaxFree: true, cities: ['Anchorage', 'Fairbanks', 'Juneau'], zip: '995' },
          // Regular US States
          { name: 'California', code: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento'], zip: '900' },
          { name: 'New York', code: 'NY', cities: ['New York', 'Brooklyn', 'Buffalo', 'Albany', 'Rochester'], zip: '100' },
          { name: 'Texas', code: 'TX', cities: ['Houston', 'Austin', 'Dallas', 'San Antonio', 'Fort Worth'], zip: '750' },
          { name: 'Washington', code: 'WA', cities: ['Seattle', 'Bellevue', 'Spokane', 'Tacoma'], zip: '981' },
          { name: 'Florida', code: 'FL', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'], zip: '331' },
          { name: 'Illinois', code: 'IL', cities: ['Chicago', 'Naperville', 'Springfield'], zip: '606' }
        ],
        maleNames: ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Alexander', 'Ethan'],
        femaleNames: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Emily', 'Sophia', 'Olivia', 'Emma'],
        lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee'],
        streets: ['Main St', 'Oak Ave', 'Maple Rd', 'Pine Blvd', 'Cedar Ln', 'Broadway', 'Sunset Dr', 'Highland Ave', 'Park Blvd', 'Washington St', 'Market St'],
        companies: ['Horizon Cloud Systems', 'Vanguard Logic Inc', 'Pacific Apex Logistics', 'BluePeak Tech', 'Starlight Media Corp', 'Meridian Global Labs'],
        jobs: ['Software Engineer', 'Product Manager', 'Data Analyst', 'DevOps Architect', 'Account Executive', 'Operations Specialist', 'Marketing Lead'],
        idLabel: 'SSN (Social Security Number)',
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
          { name: 'Greater London', code: 'GL', cities: ['London', 'Westminster', 'Camden', 'Kensington'], zip: 'SW1A' },
          { name: 'Greater Manchester', code: 'GM', cities: ['Manchester', 'Salford', 'Bolton'], zip: 'M1' },
          { name: 'West Midlands', code: 'WM', cities: ['Birmingham', 'Coventry', 'Wolverhampton'], zip: 'B1' },
          { name: 'Scotland', code: 'SCT', cities: ['Edinburgh', 'Glasgow', 'Aberdeen'], zip: 'EH1' }
        ],
        maleNames: ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Thomas', 'Oscar', 'William', 'James'],
        femaleNames: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Sophia', 'Grace', 'Mia', 'Poppy', 'Ella'],
        lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Davies', 'Evans', 'Thomas', 'Roberts'],
        streets: ['High Street', 'Church Road', 'Station Road', 'Victoria Avenue', 'Queens Way', 'King Street', 'London Road'],
        companies: ['Apex Britannic Logistics', 'Sterling Thames Advisory', 'Albion Core Solutions', 'Windsor Interactive'],
        jobs: ['Lead Consultant', 'Senior Developer', 'Finance Director', 'Business Analyst', 'Systems Architect'],
        idLabel: 'National Insurance Number (NINO)',
        genId: () => \`QQ \${rand(10, 89)} \${rand(10, 89)} \${rand(10, 89)} A\`,
        genPhone: () => \`+44 7\${rand(100, 899)} \${rand(100000, 899999)}\`,
        format: (d) => ({
          single: \`\${d.sec ? d.sec + ', ' : ''}\${d.street}, \${d.city}, \${d.zip} 2AB, United Kingdom\`,
          label: \`\${d.sec ? d.sec + '\\n' : ''}\${d.street}\\n\${d.city}\\n\${d.zip} 2AB\\nUnited Kingdom\`
        })
      },
      CN: {
        info: { name: 'China', flag: '🇨🇳', phonePrefix: '+86', currency: 'CNY (¥)', tz: 'Asia/Shanghai' },
        states: [
          { name: '北京市', code: 'BJ', cities: ['海淀区', '朝阳区', '东城区', '西城区'], zip: '100080' },
          { name: '上海市', code: 'SH', cities: ['浦东新区', '徐汇区', '黄浦区', '静安区'], zip: '200120' },
          { name: '广东省', code: 'GD', cities: ['广州市天河区', '深圳市南山区', '深圳市福田区'], zip: '518057' },
          { name: '浙江省', code: 'ZJ', cities: ['杭州市西湖区', '杭州市余杭区', '宁波市海曙区'], zip: '310012' }
        ],
        maleNames: ['伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '明', '超', '浩', '宇', '鹏', '峰'],
        femaleNames: ['芳', '娜', '敏', '静', '丽', '娟', '艳', '茜', '婷', '慧', '莹', '雪', '琳', '欣'],
        lastNames: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高'],
        streets: ['中关村南大街', '张江高科技园区科苑路', '科技南十二路', '文三西路', '陆家嘴环路', '天河路', '深南大道'],
        companies: ['华云数智未来软件技术有限公司', '乾坤盛景网络科技有限公司', '星云极速信息工程实验室'],
        jobs: ['高级全栈开发工程师', '资深架构师', '产品总监', '测试开发技术专家', '前端业务骨干'],
        idLabel: '居民身份证号 (GB11643 标准校验)',
        genId: (birth, gender) => generateChinaID(birth, gender),
        genPhone: () => \`+86 1\${choice(['38', '39', '58', '77', '86', '99'])}\${rand(1000, 9999)}\${rand(1000, 9999)}\`,
        format: (d) => ({
          single: \`中国 \${d.state}\${d.city}\${d.street} \${d.sec || ''} (邮编: \${d.zip})\`,
          label: \`中国 \${d.state}\${d.city}\\n\${d.street} \${d.sec || ''}\\n邮编: \${d.zip}\`
        })
      },
      JP: {
        info: { name: 'Japan', flag: '🇯🇵', phonePrefix: '+81', currency: 'JPY (¥)', tz: 'Asia/Tokyo' },
        states: [
          { name: '東京都', code: '13', cities: ['新宿区', '渋谷区', '港区', '千代田区'], zip: '160' },
          { name: '大阪府', code: '27', cities: ['大阪市北区', '大阪市中央区'], zip: '530' },
          { name: '京都府', code: '26', cities: ['京都市中京区', '京都市下京区'], zip: '604' }
        ],
        maleNames: ['蓮', '大翔', '悠真', '陽翔', '湊', '一真', '健太', '拓也', '翔太'],
        femaleNames: ['陽葵', '凛', '結菜', '芽依', '美咲', '花音', '結衣', '七海'],
        lastNames: ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林'],
        streets: ['銀座', '緑町', '本町', '道玄坂', '南青山', '桜丘町', '神田神保町'],
        companies: ['ソラリス・テクノロジーズ株式会社', '大和デジタルソリューションズ', 'サクラ・イノベーションズ'],
        jobs: ['シニアエンジニア', 'プロジェクトマネージャー', 'UI/UXデザイナー', 'QAリード'],
        idLabel: 'マイナンバー (My Number)',
        genId: () => \`\${rand(1000, 8999)} \${rand(1000, 8999)} \${rand(1000, 8999)}\`,
        genPhone: () => \`+81 090-\${rand(1000, 8999)}-\${rand(1000, 8999)}\`,
        format: (d) => ({
          single: \`〒\${d.zip}-\${rand(1000, 9999)} \${d.state}\${d.city}\${d.street} \${d.sec || ''} 日本\`,
          label: \`〒\${d.zip}-\${rand(1000, 9999)}\\n\${d.state}\${d.city}\\n\${d.street} \${d.sec || ''}\\n日本\`
        })
      },
      DE: {
        info: { name: 'Germany', flag: '🇩🇪', phonePrefix: '+49', currency: 'EUR (€)', tz: 'Europe/Berlin' },
        states: [
          { name: 'Bayern', code: 'BY', cities: ['München', 'Nürnberg', 'Augsburg'], zip: '80' },
          { name: 'Berlin', code: 'BE', cities: ['Berlin-Mitte', 'Charlottenburg'], zip: '101' },
          { name: 'Nordrhein-Westfalen', code: 'NW', cities: ['Köln', 'Düsseldorf'], zip: '50' }
        ],
        maleNames: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Lukas', 'Felix', 'Jonas'],
        femaleNames: ['Emma', 'Mia', 'Hannah', 'Sophia', 'Emilia', 'Lina', 'Marie'],
        lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner'],
        streets: ['Hauptstraße', 'Bahnhofstraße', 'Schillerstraße', 'Goethestraße', 'Gartenstraße'],
        companies: ['Bavaria Cloud Dynamics GmbH', 'Kaiser & Braun Industrietechnik AG'],
        jobs: ['Entwicklungsleiter', 'Systemarchitekt', 'Senior Softwareentwickler'],
        idLabel: 'Steueridentifikationsnummer (IdNr)',
        genId: () => \`\${rand(10, 89)} \${rand(100, 899)} \${rand(100, 899)} \${rand(100, 899)}\`,
        genPhone: () => \`+49 30 \${rand(1000000, 8999999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.zip}\${rand(10, 99)} \${d.city}, Deutschland\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip}\${rand(10, 99)} \${d.city}\\nDeutschland\`
        })
      },
      FR: {
        info: { name: 'France', flag: '🇫🇷', phonePrefix: '+33', currency: 'EUR (€)', tz: 'Europe/Paris' },
        states: [
          { name: 'Île-de-France', code: 'IDF', cities: ['Paris', 'Boulogne-Billancourt'], zip: '750' },
          { name: 'Auvergne-Rhône-Alpes', code: 'ARA', cities: ['Lyon', 'Grenoble'], zip: '690' }
        ],
        maleNames: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam'],
        femaleNames: ['Jade', 'Louise', 'Emma', 'Alice', 'Ambre', 'Lina', 'Chloé'],
        lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit'],
        streets: ['Rue de la Paix', 'Boulevard Haussmann', 'Avenue Victor Hugo', 'Rue de Rivoli'],
        companies: ['Lumière Systèmes SAS', 'Hexagone Technologies Numériques'],
        jobs: ['Ingénieur Logiciel', 'Chef de Projet Technique', 'Architecte Solutions'],
        idLabel: 'Numéro de Sécurité Sociale (NIR)',
        genId: (b, g) => \`\${g === 'male' ? '1' : '2'} \${b.slice(2,4)} \${b.slice(5,7)} \${rand(10,99)} \${rand(100,999)} \${rand(100,999)} \${rand(10,99)}\`,
        genPhone: () => \`+33 6 \${rand(10, 99)} \${rand(10, 99)} \${rand(10, 99)} \${rand(10, 99)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.zip}\${rand(10, 99)} \${d.city}, France\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip}\${rand(10, 99)} \${d.city}\\nFrance\`
        })
      },
      CA: {
        info: { name: 'Canada', flag: '🇨🇦', phonePrefix: '+1', currency: 'CAD (C$)', tz: 'America/Toronto' },
        states: [
          { name: 'Ontario', code: 'ON', cities: ['Toronto', 'Ottawa', 'Mississauga'], zip: 'M5' },
          { name: 'British Columbia', code: 'BC', cities: ['Vancouver', 'Victoria', 'Burnaby'], zip: 'V6' }
        ],
        maleNames: ['Liam', 'Noah', 'William', 'Benjamin', 'Lucas', 'Oliver'],
        femaleNames: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Chloe'],
        lastNames: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'Gagnon'],
        streets: ['Yonge St', 'Bay St', 'Queen St W', 'Robson St', 'Granville St'],
        companies: ['Maple Logic Labs', 'Laurentian Cloud Networks'],
        jobs: ['Senior Software Engineer', 'Product Lead'],
        idLabel: 'Social Insurance Number (SIN)',
        genId: () => \`\${rand(100, 899)} \${rand(100, 899)} \${rand(100, 899)}\`,
        genPhone: () => \`+1 (416) \${rand(200, 899)}-\${rand(1000, 8999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.city}, \${d.stateCode} \${d.zip}A 1B2, Canada\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.city}, \${d.stateCode} \${d.zip}A 1B2\\nCanada\`
        })
      },
      AU: {
        info: { name: 'Australia', flag: '🇦🇺', phonePrefix: '+61', currency: 'AUD (A$)', tz: 'Australia/Sydney' },
        states: [
          { name: 'New South Wales', code: 'NSW', cities: ['Sydney', 'Newcastle'], zip: '2000' },
          { name: 'Victoria', code: 'VIC', cities: ['Melbourne', 'Geelong'], zip: '3000' }
        ],
        maleNames: ['Oliver', 'Noah', 'Jack', 'William', 'Henry', 'Leo'],
        femaleNames: ['Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava'],
        lastNames: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor'],
        streets: ['George St', 'Pitt St', 'Collins St', 'Bourke St', 'Flinders St'],
        companies: ['Southern Cross Logic', 'Pacific Reef Networks'],
        jobs: ['DevOps Specialist', 'Solutions Architect'],
        idLabel: 'Tax File Number (TFN)',
        genId: () => \`\${rand(100, 899)} \${rand(100, 899)} \${rand(100, 899)}\`,
        genPhone: () => \`+61 4\${rand(10, 89)} \${rand(100, 899)} \${rand(100, 899)}\`,
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
        lastNames: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong'],
        streets: ['Orchard Road', 'Robinson Road', 'Shenton Way'],
        companies: ['Merlion Digital Capital', 'Lion City FinTech Labs'],
        jobs: ['VP of Engineering', 'FinTech Product Lead'],
        idLabel: 'NRIC / FIN Number',
        genId: () => \`S\${rand(1000000, 8999999)}J\`,
        genPhone: () => \`+65 8\${rand(100,899)} \${rand(1000,8999)}\`,
        format: (d) => ({
          single: \`Blk \${rand(100,999)} \${d.street} \${d.sec || '#08-12'}, Singapore \${d.zip}\${rand(1000, 9999)}\`,
          label: \`Blk \${rand(100,999)} \${d.street}\\n\${d.sec || '#08-12'}\\nSingapore \${d.zip}\${rand(1000, 9999)}\`
        })
      },
      KR: {
        info: { name: 'South Korea', flag: '🇰🇷', phonePrefix: '+82', currency: 'KRW (₩)', tz: 'Asia/Seoul' },
        states: [
          { name: '서울특별시', code: '11', cities: ['강남구', '서초구', '마포구', '송파구'], zip: '06' }
        ],
        maleNames: ['민준', '서준', '도윤', '예준', '시우', '하준', '지호'],
        femaleNames: ['서연', '서윤', '지우', '서현', '하은', '하윤', '지아'],
        lastNames: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'],
        streets: ['테헤란로', '강남대로', '세종대로', '을지로', '올림픽로'],
        companies: ['한울 테크놀로지스', '넥스트웨이브 솔루션즈', '다산 소프트'],
        jobs: ['수석 개발자', '프로덕트 매니저', '데이터 엔지니어'],
        idLabel: '주민등록번호 (RRN)',
        genId: (b, g) => \`\${b.slice(2,4)}\${b.slice(5,7)}\${b.slice(8,10)}-\${g === 'male' ? '1' : '2'}\${rand(100000,899999)}\`,
        genPhone: () => \`+82 10-\${rand(1000,8999)}-\${rand(1000,8999)}\`,
        format: (d) => ({
          single: \`\${d.state} \${d.city} \${d.street} \${d.sec || ''} (우편번호: \${d.zip}\${rand(100, 999)})\`,
          label: \`\${d.state} \${d.city}\\n\${d.street} \${d.sec || ''}\\n우편번호: \${d.zip}\${rand(100, 999)}\\n대한민국\`
        })
      },
      IN: {
        info: { name: 'India', flag: '🇮🇳', phonePrefix: '+91', currency: 'INR (₹)', tz: 'Asia/Kolkata' },
        states: [
          { name: 'Maharashtra', code: 'MH', cities: ['Mumbai', 'Pune'], zip: '400' },
          { name: 'Karnataka', code: 'KA', cities: ['Bengaluru'], zip: '560' }
        ],
        maleNames: ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Arjun', 'Kabir'],
        femaleNames: ['Aanya', 'Diya', 'Ananya', 'Isha', 'Myra', 'Saanvi'],
        lastNames: ['Sharma', 'Verma', 'Patel', 'Reddy', 'Singh', 'Kumar', 'Deshmukh'],
        streets: ['Mahatma Gandhi Road', 'Brigade Road', 'Ring Road', 'Outer Ring Rd'],
        companies: ['Bharat Cloud Innovations', 'Indus Wave Infotech'],
        jobs: ['Technical Lead', 'Principal Architect', 'Engineering Manager'],
        idLabel: 'Aadhaar (Mock Format)',
        genId: () => \`\${rand(1000,8999)} \${rand(1000,8999)} \${rand(1000,8999)}\`,
        genPhone: () => \`+91 98\${rand(10,89)} \${rand(100000,899999)}\`,
        format: (d) => ({
          single: \`\${d.sec ? d.sec + ', ' : ''}\${d.street}, \${d.city}, \${d.state} - \${d.zip}\${rand(100, 999)}, India\`,
          label: \`\${d.sec ? d.sec + '\\n' : ''}\${d.street}\\n\${d.city}, \${d.state} - \${d.zip}\${rand(100, 999)}\\nIndia\`
        })
      },
      IT: {
        info: { name: 'Italy', flag: '🇮🇹', phonePrefix: '+39', currency: 'EUR (€)', tz: 'Europe/Rome' },
        states: [
          { name: 'Lombardia', code: 'LOM', cities: ['Milano', 'Bergamo'], zip: '201' },
          { name: 'Lazio', code: 'LAZ', cities: ['Roma'], zip: '001' }
        ],
        maleNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia'],
        femaleNames: ['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra'],
        lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano'],
        streets: ['Via Roma', 'Corso Garibaldi', 'Via Dante Alighieri', 'Corso Vittorio Emanuele'],
        companies: ['Milano Sistemi Digitali S.r.l.', 'Innovazione Adriatica SpA'],
        jobs: ['Ingegnere del Software', 'Product Designer'],
        idLabel: 'Codice Fiscale',
        genId: () => 'RSSMRA85M01H501Z',
        genPhone: () => \`+39 02 \${rand(1000000, 8999999)}\`,
        format: (d) => ({
          single: \`\${d.street}\${d.sec ? ', ' + d.sec : ''}, \${d.zip}\${rand(10, 99)} \${d.city} (Italia)\`,
          label: \`\${d.street}\${d.sec ? '\\n' + d.sec : ''}\\n\${d.zip}\${rand(10, 99)} \${d.city}\\nItalia\`
        })
      }
    };

    /* 随机函数与算法工具 */
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function genLuhnCard(prefix, len) {
      let num = prefix;
      while (num.length < len - 1) num += Math.floor(Math.random() * 10).toString();
      let sum = 0, d = true;
      for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num[i], 10);
        if (d) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        d = !d;
      }
      return num + ((10 - (sum % 10)) % 10).toString();
    }

    function generateChinaID(birthStr, gender) {
      const b = (birthStr || '1992-05-18').replace(/-/g, '');
      const areaCodes = ['110101', '310104', '440106', '440304', '330106', '510104', '420102', '320102'];
      const area = choice(areaCodes);
      let s = rand(0, 4) * 2 + (gender === 'male' ? 1 : 0);
      const prefix = \`\${area}\${b}\${rand(0, 9)}\${rand(0, 9)}\${s}\`;
      const w = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const map = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let sum = 0;
      for (let i = 0; i < 17; i++) sum += parseInt(prefix[i], 10) * w[i];
      return prefix + map[sum % 11];
    }

    /* 全局状态 */
    let currentAddress = null;
    let batchList = [];
    let savedList = [];
    let qrMode = 'text'; // 'text' | 'geo' | 'json'

    const STORAGE_KEY_FAVORITES = 'geomock_offline_favs_v1';

    function loadLocalFavorites() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_FAVORITES);
        savedList = raw ? JSON.parse(raw) : [];
      } catch (e) {
        savedList = [];
      }
      updateSavedBadgeCount();
    }

    function persistLocalFavorites() {
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(savedList));
      } catch (e) {}
      updateSavedBadgeCount();
    }

    function updateSavedBadgeCount() {
      const el = document.getElementById('savedCountNum');
      if (el) el.textContent = savedList.length;
      const emptyState = document.getElementById('savedEmptyState');
      if (emptyState) {
        emptyState.style.display = savedList.length === 0 ? 'block' : 'none';
      }
    }

    /* 选项卡切换 */
    function switchMainTab(tab) {
      const viewSingle = document.getElementById('viewSingle');
      const viewBatch = document.getElementById('viewBatch');
      const viewSaved = document.getElementById('viewSaved');
      const btnSingle = document.getElementById('navBtnSingle');
      const btnBatch = document.getElementById('navBtnBatch');
      const btnSaved = document.getElementById('navBtnSaved');

      viewSingle.classList.add('hidden');
      viewBatch.classList.add('hidden');
      viewSaved.classList.add('hidden');
      btnSingle.classList.remove('active');
      btnBatch.classList.remove('active');
      btnSaved.classList.remove('active');

      if (tab === 'single') {
        viewSingle.classList.remove('hidden');
        btnSingle.classList.add('active');
      } else if (tab === 'batch') {
        viewBatch.classList.remove('hidden');
        btnBatch.classList.add('active');
        if (batchList.length === 0) executeBatchGeneration();
      } else if (tab === 'saved') {
        viewSaved.classList.remove('hidden');
        btnSaved.classList.add('active');
        renderSavedList();
      }
    }

    /* 免税州开关与选择逻辑 */
    function populateStateDropdown(countryCode) {
      const stateSel = document.getElementById('selState');
      stateSel.innerHTML = '';
      const actualCode = countryCode === 'US_TAX_FREE' ? 'US' : countryCode;
      const isTaxFreeOnly = countryCode === 'US_TAX_FREE' || document.getElementById('taxFreeToggleCheck').checked;
      const ds = DATASETS[actualCode] || DATASETS.US;

      if (actualCode === 'US') {
        if (isTaxFreeOnly) {
          const optAll = document.createElement('option');
          optAll.value = '__TAX_FREE__';
          optAll.textContent = '⭐ [推荐] 五大免税州随机 (DE / OR / MT / NH / AK)';
          stateSel.appendChild(optAll);

          const group = document.createElement('optgroup');
          group.label = '🎁 美国五大法定零消费税州 (0% Sales Tax)';
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
          groupOther.label = '美国其他普通州';
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
      document.getElementById('selCountry').value = 'US';
      document.getElementById('taxFreeToggleCheck').checked = true;
      updateTaxFreeBannerStyle(true);
      populateStateDropdown('US');
      document.getElementById('selState').value = '__TAX_FREE__';
      generateSingleAddress();
      showToast('已切换至美国五大免税州模式 (0% 消费税)');
    }

    function onTaxFreeToggle(checked) {
      const cSel = document.getElementById('selCountry');
      if (checked) {
        if (cSel.value !== 'US' && cSel.value !== 'US_TAX_FREE') {
          cSel.value = 'US';
        }
      }
      updateTaxFreeBannerStyle(checked);
      populateStateDropdown(cSel.value);
      if (checked) {
        document.getElementById('selState').value = '__TAX_FREE__';
      }
      generateSingleAddress();
    }

    function updateTaxFreeBannerStyle(isActive) {
      const banner = document.getElementById('taxFreeOptionCard');
      const tag = document.getElementById('taxFreeStatusTag');
      const tip = document.getElementById('stateModeTip');
      const pill = document.getElementById('pillTaxFree');
      const stateSel = document.getElementById('selState');

      if (isActive) {
        banner.className = 'tax-free-banner';
        tag.textContent = '已开启免税过滤';
        tag.className = 'tag tag-tax-free';
        tip.style.display = 'inline';
        pill.classList.add('active');
        stateSel.classList.add('tax-free-active');
      } else {
        banner.className = 'tax-free-banner inactive';
        tag.textContent = '未开启';
        tag.className = 'tag';
        tip.style.display = 'none';
        pill.classList.remove('active');
        stateSel.classList.remove('tax-free-active');
      }
    }

    function quickSelectCountry(code) {
      document.getElementById('selCountry').value = code;
      const isUS = code === 'US';
      if (!isUS) {
        document.getElementById('taxFreeToggleCheck').checked = false;
        updateTaxFreeBannerStyle(false);
      }
      // 更新快捷药丸高亮
      document.querySelectorAll('.quick-bar .pill-btn').forEach(btn => btn.classList.remove('active'));
      const activePill = document.getElementById('pill-' + code);
      if (activePill) activePill.classList.add('active');

      populateStateDropdown(code);
      generateSingleAddress();
    }

    function onCountryDropdownChange() {
      const val = document.getElementById('selCountry').value;
      if (val === 'US_TAX_FREE') {
        document.getElementById('taxFreeToggleCheck').checked = true;
        updateTaxFreeBannerStyle(true);
      } else if (val !== 'US') {
        document.getElementById('taxFreeToggleCheck').checked = false;
        updateTaxFreeBannerStyle(false);
      }
      populateStateDropdown(val);
      generateSingleAddress();
    }

    function onStateDropdownChange() {
      const sVal = document.getElementById('selState').value;
      if (sVal === '__TAX_FREE__' || ['Delaware', 'Oregon', 'Montana', 'New Hampshire', 'Alaska'].includes(sVal)) {
        document.getElementById('taxFreeToggleCheck').checked = true;
        updateTaxFreeBannerStyle(true);
      }
      generateSingleAddress();
    }

    /* 单条地址构建函数 */
    function buildAddressObject(cCode, preferredState, preferredGender) {
      const isTaxFreeOpt =
        cCode === 'US_TAX_FREE' ||
        document.getElementById('taxFreeToggleCheck').checked ||
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

      const streetNum = String(rand(12, 1999));
      const streetNameBase = choice(ds.streets);
      let street = '';
      let sec = '';

      if (actualCode === 'CN') {
        street = streetNameBase + rand(1, 400) + '号';
        sec = rand(1, 12) + '号楼' + rand(101, 1202) + '室';
      } else if (actualCode === 'JP') {
        street = streetNameBase + rand(1, 5) + '丁目' + rand(1, 20) + '番地';
        sec = 'グランドヒルズ ' + rand(101, 608) + '号室';
      } else {
        street = streetNum + ' ' + streetNameBase;
        if (Math.random() > 0.4) sec = 'Apt ' + rand(1, 350);
      }
      
      const age = rand(21, 62);
      const birth = (new Date().getFullYear() - age) + '-' + String(rand(1, 12)).padStart(2, '0') + '-' + String(rand(1, 28)).padStart(2, '0');
      
      const cardType = choice(['Visa', 'MasterCard']);
      const cardPrefix = cardType === 'Visa' ? '4532' : '5425';
      const cardNumber = genLuhnCard(cardPrefix, 16);

      const formatted = ds.format({
        street, sec, city, state: stateObj.name, stateCode: stateObj.code, zip, country: ds.info.name
      });

      const cleanFirst = first.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLast = last.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userNum = rand(10, 999);
      const email = \`\${cleanFirst || 'user'}.\${cleanLast || 'dev'}\${userNum}@example-mock.com\`;
      const username = \`\${cleanFirst || 'user'}_\${cleanLast || 'dev'}\${userNum}\`;

      return {
        id: 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        timestamp: Date.now(),
        country: actualCode,
        countryName: ds.info.name,
        flag: ds.info.flag,
        currency: ds.info.currency,
        timezone: ds.info.tz,
        gender: gender === 'male' ? '男性 (Male)' : '女性 (Female)',
        rawGender: gender,
        firstName: first,
        lastName: last,
        fullName,
        age,
        birthDate: birth,
        streetNum,
        streetName: streetNameBase,
        street,
        secondary: sec,
        fullStreet: sec ? \`\${street}, \${sec}\` : street,
        city,
        state: stateObj.name,
        stateCode: stateObj.code,
        isTaxFree: Boolean(stateObj.isTaxFree),
        postalCode: zip,
        phone: ds.genPhone(),
        email,
        username,
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

    /* 渲染单条地址到 UI */
    function generateSingleAddress() {
      const c = document.getElementById('selCountry').value;
      const s = document.getElementById('selState').value;
      const g = document.getElementById('selGender').value;
      currentAddress = buildAddressObject(c, s, g);

      // 顶部标识
      document.getElementById('cardFlag').textContent = currentAddress.flag;
      document.getElementById('cardFullName').textContent = currentAddress.fullName;
      document.getElementById('cardGenderTag').textContent = currentAddress.gender;
      document.getElementById('cardAgeTag').textContent = currentAddress.age + ' 岁';
      document.getElementById('cardCountry').textContent = currentAddress.countryName;
      document.getElementById('cardStateCity').textContent = currentAddress.city + ', ' + currentAddress.state;
      document.getElementById('cardPostal').textContent = currentAddress.postalCode;
      document.getElementById('cardPhone').textContent = currentAddress.phone;

      // 免税勋章与专属提示
      const badge = document.getElementById('cardTaxFreeBadge');
      const notice = document.getElementById('cardTaxFreeNotice');
      const noticeStateName = document.getElementById('noticeStateName');

      if (currentAddress.isTaxFree) {
        badge.classList.remove('hidden');
        notice.classList.remove('hidden');
        noticeStateName.textContent = currentAddress.state + ' (' + currentAddress.stateCode + ')';
      } else {
        badge.classList.add('hidden');
        notice.classList.add('hidden');
      }

      // 详细字段映射
      document.getElementById('valStreetNum').textContent = currentAddress.streetNum;
      document.getElementById('valStreetName').textContent = currentAddress.streetName;
      document.getElementById('valFullStreet').textContent = currentAddress.fullStreet;
      document.getElementById('valSecondary').textContent = currentAddress.secondary || '无次级地址 (N/A)';
      document.getElementById('valCity').textContent = currentAddress.city;
      document.getElementById('valState').textContent = currentAddress.isTaxFree
        ? \`\${currentAddress.state} (\${currentAddress.stateCode}) · [0% 免税州]\`
        : \`\${currentAddress.state} (\${currentAddress.stateCode})\`;
      document.getElementById('valPostal').textContent = currentAddress.postalCode;
      document.getElementById('valCoords').textContent = currentAddress.coords;

      document.getElementById('valFullName').textContent = currentAddress.fullName;
      document.getElementById('valFirstLastName').textContent = currentAddress.firstName + ' / ' + currentAddress.lastName;
      document.getElementById('valGender').textContent = currentAddress.gender;
      document.getElementById('valBirthAge').textContent = currentAddress.birthDate + ' (' + currentAddress.age + ' 岁)';
      document.getElementById('valPhone').textContent = currentAddress.phone;
      document.getElementById('valEmail').textContent = currentAddress.email;
      document.getElementById('valUsername').textContent = currentAddress.username;

      document.getElementById('lblIdName').textContent = currentAddress.nationalIdName;
      document.getElementById('valIdNumber').textContent = currentAddress.nationalId;
      document.getElementById('valCardNumber').textContent = currentAddress.cardNumber;
      document.getElementById('valCardBrand').textContent = currentAddress.cardType;
      document.getElementById('valCardExpCvv').textContent = currentAddress.cardExp + ' · CVV: ' + currentAddress.cardCvv;
      document.getElementById('valCompany').textContent = currentAddress.company;
      document.getElementById('valJobTitle').textContent = currentAddress.job;

      // 更新收藏按钮状态
      updateFavoriteButtonState();

      // 更新二维码渲染
      renderCurrentQrCode();
    }

    /* 离线二维码渲染函数 */
    function getQrPayloadString() {
      if (!currentAddress) return '';
      if (qrMode === 'text') {
        return currentAddress.fullAddressSingleLine;
      } else if (qrMode === 'geo') {
        return \`geo:\${currentAddress.coords.replace(/\\s+/g, '')}?q=\${encodeURIComponent(currentAddress.fullStreet)}\`;
      } else {
        return JSON.stringify({
          name: currentAddress.fullName,
          street: currentAddress.fullStreet,
          city: currentAddress.city,
          state: currentAddress.state,
          postalCode: currentAddress.postalCode,
          country: currentAddress.countryName,
          phone: currentAddress.phone,
          email: currentAddress.email
        }, null, 2);
      }
    }

    function renderCurrentQrCode() {
      const container = document.getElementById('qrContainer');
      const preview = document.getElementById('qrPreviewText');
      if (!container || !currentAddress) return;

      const payload = getQrPayloadString();
      if (preview) preview.textContent = payload;

      try {
        const qr = qrcode(0, 'M');
        qr.addData(payload);
        qr.make();
        const svgTag = qr.createSvgTag({ scalable: true });
        container.innerHTML = svgTag;
      } catch (err) {
        container.innerHTML = '<div style="padding: 20px; font-size: 11px; color: #ef4444;">二维码生成受限</div>';
      }
    }

    function toggleQrPanel() {
      const panel = document.getElementById('qrPanel');
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        renderCurrentQrCode();
      }
    }

    function setQrMode(mode) {
      qrMode = mode;
      document.getElementById('qrModeText').className = mode === 'text' ? 'pill-btn active' : 'pill-btn';
      document.getElementById('qrModeGeo').className = mode === 'geo' ? 'pill-btn active' : 'pill-btn';
      document.getElementById('qrModeJson').className = mode === 'json' ? 'pill-btn active' : 'pill-btn';
      renderCurrentQrCode();
    }

    function downloadQrSvgFile() {
      const svgEl = document.querySelector('#qrContainer svg');
      if (!svgEl) return;
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const filename = \`qrcode_\${currentAddress.country}_\${currentAddress.fullName.replace(/\\s+/g, '_')}.svg\`;
      downloadLocalBlob(svgData, filename, 'image/svg+xml;charset=utf-8;');
      showToast('已下载二维码 SVG 矢量图形！');
    }

    /* 复制功能 (支持 navigator.clipboard 及 file:// 脱机 fallback) */
    function copyTextDirect(text, successMsg = '已成功复制到剪贴板！') {
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(successMsg);
        }).catch(() => {
          fallbackTextCopy(text, successMsg);
        });
      } else {
        fallbackTextCopy(text, successMsg);
      }
    }

    function fallbackTextCopy(text, successMsg) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        const ok = document.execCommand('copy');
        if (ok) showToast(successMsg);
        else showToast('请手动选中文本复制');
      } catch (e) {
        showToast('请手动选中文本复制');
      }
      document.body.removeChild(ta);
    }

    function copyFieldValue(elId) {
      const el = document.getElementById(elId);
      if (el) copyTextDirect(el.textContent.trim(), '已复制: ' + el.textContent.trim());
    }

    function copyFullSingleLine() {
      if (currentAddress) copyTextDirect(currentAddress.fullAddressSingleLine, '单行格式地址已复制！');
    }

    function copyMailingLabel() {
      if (currentAddress) copyTextDirect(currentAddress.fullMailingLabel, '邮寄信封格式已复制！');
    }

    function copyFullJson() {
      if (currentAddress) copyTextDirect(JSON.stringify(currentAddress, null, 2), '完整 JSON 数据已复制！');
    }

    /* 收藏功能 */
    function updateFavoriteButtonState() {
      const btn = document.getElementById('btnFavCurrent');
      if (!btn || !currentAddress) return;
      const isFav = savedList.some(item => item.id === currentAddress.id || (item.fullName === currentAddress.fullName && item.street === currentAddress.street));
      if (isFav) {
        btn.innerHTML = '<span>★ 已收藏</span>';
        btn.className = 'btn btn-secondary btn-sm';
        btn.style.color = '#d97706';
      } else {
        btn.innerHTML = '<span>☆ 收藏</span>';
        btn.className = 'btn btn-secondary btn-sm';
        btn.style.color = '#334155';
      }
    }

    function toggleFavoriteCurrent() {
      if (!currentAddress) return;
      const idx = savedList.findIndex(item => item.id === currentAddress.id || (item.fullName === currentAddress.fullName && item.street === currentAddress.street));
      if (idx >= 0) {
        savedList.splice(idx, 1);
        showToast('已从收藏夹移除: ' + currentAddress.fullName);
      } else {
        savedList.unshift(currentAddress);
        showToast('已成功收藏地址: ' + currentAddress.fullName);
      }
      persistLocalFavorites();
      updateFavoriteButtonState();
      renderSavedList();
    }

    function renderSavedList() {
      const grid = document.getElementById('savedGrid');
      if (!grid) return;
      grid.innerHTML = '';
      updateSavedBadgeCount();

      savedList.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'saved-card';
        div.innerHTML = \`
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1-5">
              <span>\${item.flag}</span>
              <span style="font-weight: 700; color: #0f172a;">\${item.fullName}</span>
              \${item.isTaxFree ? '<span class="tag tag-tax-free">0%免税</span>' : ''}
            </div>
            <button class="copy-chip" onclick="removeFavoriteByIndex(\${index})" style="color: #ef4444;">删除</button>
          </div>
          <div style="font-size: 11px; color: #475569; word-break: break-all;">
            \${item.fullStreetAddress || item.fullStreet}, \${item.city}, \${item.stateCode || item.state} \${item.postalCode}
          </div>
          <div class="flex items-center justify-between" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9;">
            <span style="font-size: 11px; font-family: monospace; color: #2563eb;">\${item.phone}</span>
            <div class="flex items-center gap-2">
              <button class="copy-chip" onclick="copyTextDirect('\${item.fullAddressSingleLine.replace(/'/g, "\\\\'")}', '已复制地址')">复制</button>
              <button class="copy-chip" onclick="loadSavedToMain(\${index})" style="background: #2563eb; color: #ffffff; border-color: #2563eb;">载入</button>
            </div>
          </div>
        \`;
        grid.appendChild(div);
      });
    }

    function removeFavoriteByIndex(idx) {
      savedList.splice(idx, 1);
      persistLocalFavorites();
      renderSavedList();
      updateFavoriteButtonState();
      showToast('已移除该收藏！');
    }

    function clearAllFavorites() {
      if (confirm('确定要清空全部本地收藏吗？此操作无法撤销。')) {
        savedList = [];
        persistLocalFavorites();
        renderSavedList();
        updateFavoriteButtonState();
        showToast('已清空全部收藏记录！');
      }
    }

    function loadSavedToMain(idx) {
      const item = savedList[idx];
      if (!item) return;
      currentAddress = item;
      switchMainTab('single');
      generateSingleAddress();
      showToast('已载入收藏地址: ' + item.fullName);
    }

    /* 批量生成与导出 */
    function executeBatchGeneration() {
      const c = document.getElementById('batchCountry').value;
      const count = parseInt(document.getElementById('batchCount').value, 10) || 10;
      const g = document.getElementById('batchGender').value;
      
      batchList = [];
      for (let i = 0; i < count; i++) {
        batchList.push(buildAddressObject(c, undefined, g));
      }

      document.getElementById('batchCountLabel').textContent = \`(共 \${batchList.length} 条记录)\`;
      renderBatchTableRows();
      showToast(\`成功批量生成 \${batchList.length} 条测试数据！\`);
    }

    function renderBatchTableRows() {
      const tbody = document.getElementById('batchTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      batchList.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td style="text-align: center; color: #94a3b8; font-family: monospace;">\${index + 1}</td>
          <td>
            <span style="margin-right: 4px;">\${item.flag}</span>
            <span>\${item.countryName}</span>
          </td>
          <td>
            <strong>\${item.fullName}</strong>
            <span style="font-size: 11px; color: #94a3b8; margin-left: 4px;">(\${item.rawGender === 'male' ? '男' : '女'})</span>
          </td>
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="\${item.fullStreet}">
            \${item.fullStreet}
          </td>
          <td style="white-space: nowrap;">
            <span>\${item.city}, \${item.stateCode || item.state}</span>
            \${item.isTaxFree ? '<span class="tag tag-tax-free" style="margin-left: 4px;">0%免税</span>' : ''}
          </td>
          <td style="font-family: monospace; font-weight: 700; color: #2563eb;">\${item.postalCode}</td>
          <td style="font-family: monospace;">\${item.phone}</td>
          <td style="text-align: right; white-space: nowrap;">
            <button class="copy-chip" onclick="copyTextDirect('\${item.fullAddressSingleLine.replace(/'/g, "\\\\'")}', '已复制: \${item.fullName}')">复制</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function exportBatchData(format) {
      if (batchList.length === 0) return;
      const timestamp = Date.now();
      let content = '', filename = '', mime = '';

      if (format === 'json') {
        content = JSON.stringify(batchList, null, 2);
        filename = \`geomock_batch_\${timestamp}.json\`;
        mime = 'application/json';
      } else if (format === 'csv') {
        const headers = ['Country', 'FullName', 'Gender', 'Street', 'City', 'State', 'IsTaxFree', 'PostalCode', 'Phone', 'Email', 'NationalID', 'CardNumber'];
        const rows = batchList.map(a => [
          \`"\${a.countryName}"\`, \`"\${a.fullName}"\`, \`"\${a.rawGender}"\`, \`"\${a.fullStreet}"\`, \`"\${a.city}"\`, \`"\${a.state}"\`, \`"\${a.isTaxFree ? 'Yes (0%)' : 'No'}"\`, \`"\${a.postalCode}"\`, \`"\${a.phone}"\`, \`"\${a.email}"\`, \`"\${a.nationalId}"\`, \`"\${a.cardNumber}"\`
        ].join(','));
        content = [headers.join(','), ...rows].join('\\n');
        filename = \`geomock_batch_\${timestamp}.csv\`;
        mime = 'text/csv;charset=utf-8;';
      } else {
        content = batchList.map((a, i) => \`#\${i + 1} [\${a.countryName}\${a.isTaxFree ? ' · 免税州' : ''}] \${a.fullName} (\${a.phone})\\n地址: \${a.fullAddressSingleLine}\\n证件: \${a.nationalIdName} \${a.nationalId} | 信用卡: \${a.cardNumber} (\${a.cardExp})\`).join('\\n\\n');
        filename = \`geomock_batch_\${timestamp}.txt\`;
        mime = 'text/plain;charset=utf-8;';
      }

      downloadLocalBlob(content, filename, mime);
      showToast('已开始下载 ' + format.toUpperCase() + ' 文件！');
    }

    function copyBatchJsonAll() {
      if (batchList.length === 0) return;
      copyTextDirect(JSON.stringify(batchList, null, 2), \`已复制全部 \${batchList.length} 条 JSON 数据！\`);
    }

    function downloadLocalBlob(data, filename, mime) {
      const blob = new Blob([data], { type: mime });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    /* 吐司通知提示 */
    let toastTimer = null;
    function showToast(text) {
      const toast = document.getElementById('toast');
      const toastText = document.getElementById('toastText');
      if (!toast || !toastText) return;

      toastText.textContent = text;
      toast.classList.add('show');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2200);
    }

    /* 页面加载初始化 */
    window.addEventListener('DOMContentLoaded', () => {
      loadLocalFavorites();
      populateStateDropdown('US');
      generateSingleAddress();
    });
  </script>
</body>
</html>
`;

// 3. Write public/geomock-offline.html and public/geomock-standalone.html
fs.writeFileSync(path.resolve(__dirname, '../public/geomock-offline.html'), offlineHtml, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../public/geomock-standalone.html'), offlineHtml, 'utf8');
console.log('Successfully written public/geomock-offline.html & public/geomock-standalone.html');

// 4. Update src/utils/standaloneHtml.ts
const tsSource = `export const STANDALONE_HTML_CODE = ${JSON.stringify(offlineHtml)};\n`;
fs.writeFileSync(path.resolve(__dirname, '../src/utils/standaloneHtml.ts'), tsSource, 'utf8');
console.log('Successfully updated src/utils/standaloneHtml.ts');
