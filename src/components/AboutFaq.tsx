import React from 'react';
import { HelpCircle, Shield, Globe, Terminal } from 'lucide-react';

export const AboutFaq: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mt-10 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>关于 GeoMock 与使用指南 (About & Developer FAQ)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          专为软件工程师、自动化测试工程师、QA 人员和跨境电商表单验证设计的真实格式测试数据生成工具。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>各国真实地址规范支持</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            支持美国（USPS 格式/5位ZIP/州简称）、英国（Royal Mail 邮编如 SW1A 1AA）、中国（国家标准6位邮编与行政区划）、日本（7位邮政番号与丁目番地）、德国（5位PLZ）、法国、加拿大、澳大利亚等 12 个主流国家的本土地址命名规则。
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="text-sm">🎁</span>
            <span>美国五大免税州特别支持</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            支持一键筛选与生成美国 5 大 0% 消费税免税州（NOMAD 州）：特拉华州 (DE)、俄勒冈州 (OR)、蒙大拿州 (MT)、新罕布什尔州 (NH)、阿拉斯加州 (AK)，深度适配海淘转运仓、计税系统研发与跨境账单测试。
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>算法校验位与 QA 测试身份</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            提供符合 ISO 7064:1983.MOD 11-2 校验位算法的居民身份证测试号、Luhn 模 10 算法校验通过的模拟 Visa/MasterCard 测试信用卡号，确保各类支付网关和表单正则校验通过。所有数据均为程序随机生成的合规测试假数据。
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>单文件离线化与批量导出</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            提供 100% 独立的单文件 HTML 源码，可直接下载并在无网络环境下双击浏览器运行。支持批量生成 1~100 条记录并一键导出为 CSV、JSON、或纯文本格式，方便数据填充与自动化脚本导入。
          </p>
        </div>
      </div>
    </div>
  );
};
