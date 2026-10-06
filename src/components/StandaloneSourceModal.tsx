import React, { useState } from 'react';
import { STANDALONE_HTML_CODE } from '../utils/standaloneHtml';
import { copyToClipboard, downloadFile } from '../utils/export';
import { Copy, Download, Check, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';

interface StandaloneSourceModalProps {
  onToast: (msg: string) => void;
}

export const StandaloneSourceModal: React.FC<StandaloneSourceModalProps> = ({ onToast }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = async () => {
    const success = await copyToClipboard(STANDALONE_HTML_CODE);
    if (success) {
      setCopied(true);
      onToast('已复制 100% 纯离线单文件完整源码至剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(STANDALONE_HTML_CODE, 'geomock-offline.html', 'text/html;charset=utf-8;');
    onToast('已开始下载 geomock-offline.html 纯离线单文件！');
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                <FileCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                100% 纯离线单文件 (Offline Standalone HTML)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              专为<strong>脱机免部署离线使用</strong>打造：零 CDN 外部网络请求、零服务器环境依赖。下载后本地双击即可在任何电脑浏览器中直接运行全部功能，包括 12 国地址生成、<strong>美国五大免税州 (0% 消费税) 专属生成</strong>、离线 SVG 二维码生成、一键复制及批量 CSV/JSON/TXT 导出。
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>下载离线 HTML 文件</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>已复制代码！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>一键复制代码</span>
                </>
              )}
            </button>

            <a
              href="/geomock-offline.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>在独立窗口打开预览</span>
            </a>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">100% 脱机纯离线运行</div>
              <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                所有 CSS 样式、SVG 图标与二维码算法全部内嵌于单文件中，不发送任何外部网络请求，拔网线或断网环境下完美运行。
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">美国五大免税州完整支持</div>
              <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                特拉华 (DE)、俄勒冈 (OR)、蒙大拿 (MT)、新罕布什尔 (NH)、阿拉斯加 (AK)，支持一键直达与仅免税州筛选。
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">双击即用，零需部署</div>
              <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                无需任何 Node.js、Vite 或 Web 服务器，直接下载保存到本地磁盘（如桌面、U盘），双击即可在任意现代浏览器运行。
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-slate-300 font-medium">geomock-offline.html (纯离线单文件)</span>
          </div>
          <div className="font-mono text-[11px] text-emerald-400 font-medium">
            100% 离线脱机 · {STANDALONE_HTML_CODE.split('\n').length} 行代码 · UTF-8
          </div>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] leading-relaxed selection:bg-blue-600 selection:text-white">
          {STANDALONE_HTML_CODE}
        </pre>
      </div>

    </div>
  );
};
