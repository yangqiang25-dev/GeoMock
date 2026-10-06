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
      onToast('已复制完整单文件 HTML/Tailwind/JS 源码至剪贴板！');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(STANDALONE_HTML_CODE, 'geomock-standalone.html', 'text/html;charset=utf-8;');
    onToast('已开始下载 geomock-standalone.html 单文件源码！');
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <FileCode className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                单文件独立完整源码 (Standalone HTML)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              按照您的需求封装的 100% 单文件完整可运行源码。集成了 Tailwind CSS CDN、完整的 12 国地址生成逻辑、真实 GB11643 身份证校验算法、Luhn 信用卡号校验、单条与批量生成、以及全部一键复制功能。
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-1.5 shadow-xs"
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

            <button
              onClick={handleDownload}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>下载 index.html</span>
            </button>

            <a
              href="/geomock-standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              <span>在新标签页打开</span>
            </a>
          </div>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">零依赖，直接双击运行</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                不需要任何 Node.js、Vite 或打包工具，本地双击即可在任何浏览器中打开使用。
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">内嵌完整数据字典</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                包括美、英、中、日、德、法、加、澳、新、韩等国真实邮编格式、城市、街道和电话。
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-800">批量生成与格式导出</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                内置批量数据表格渲染、一键复制单行、信封多行、JSON、CSV、TXT 导出。
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
            <span className="ml-2 font-mono text-slate-300 font-medium">geomock-standalone.html</span>
          </div>
          <div className="font-mono text-[11px]">
            {STANDALONE_HTML_CODE.split('\n').length} 行代码 · UTF-8
          </div>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[540px] leading-relaxed selection:bg-blue-600 selection:text-white">
          {STANDALONE_HTML_CODE}
        </pre>
      </div>

    </div>
  );
};
