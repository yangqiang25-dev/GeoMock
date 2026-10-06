import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AddressData } from '../types/address';
import { copyToClipboard } from '../utils/export';
import {
  Copy,
  Check,
  Star,
  MapPin,
  ExternalLink,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Map as MapIcon,
  QrCode,
  Smartphone,
  Download
} from 'lucide-react';

interface AddressCardProps {
  address: AddressData;
  isFavorite: boolean;
  onToggleFavorite: (address: AddressData) => void;
  onToast: (msg: string) => void;
}

type QrFormat = 'vcard' | 'address' | 'geo' | 'json';

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isFavorite,
  onToggleFavorite,
  onToast
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrFormat, setQrFormat] = useState<QrFormat>('vcard');

  const handleCopy = async (fieldKey: string, text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(fieldKey);
      onToast(`已复制 ${label}: ${text}`);
      setTimeout(() => {
        setCopiedField(null);
      }, 1800);
    }
  };

  // Generate QR payload according to selected format
  const getQrPayload = (format: QrFormat): string => {
    switch (format) {
      case 'vcard':
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${address.fullName}`,
          `N:${address.lastName};${address.firstName};;;`,
          `TEL;TYPE=CELL:${address.phone}`,
          `EMAIL:${address.email}`,
          `ADR;TYPE=HOME:;;${address.streetAddress};${address.city};${address.stateCode || address.state};${address.postalCode};${address.countryName}`,
          `ORG:${address.company}`,
          `TITLE:${address.jobTitle}`,
          'END:VCARD'
        ].join('\n');
      case 'address':
        return address.fullAddressSingleLine;
      case 'geo':
        return `geo:${address.latitude},${address.longitude}?q=${address.latitude},${address.longitude}(${encodeURIComponent(
          address.fullStreetAddress
        )})`;
      case 'json':
        return JSON.stringify(
          {
            name: address.fullName,
            street: address.fullStreetAddress,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.countryName,
            phone: address.phone,
            email: address.email,
            coordinates: { lat: address.latitude, lng: address.longitude }
          },
          null,
          2
        );
    }
  };

  const currentQrValue = getQrPayload(qrFormat);

  // Download QR Code as SVG file
  const handleDownloadQrSvg = () => {
    const svgEl = document.getElementById('address-qr-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${address.country}_${address.fullName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast('已下载二维码 SVG 矢量图形');
  };

  const renderField = (
    key: string,
    label: string,
    value: string,
    icon?: React.ReactNode,
    isMono?: boolean,
    customClass?: string
  ) => {
    const isCopied = copiedField === key;
    return (
      <div className="flex flex-col gap-1 p-2.5 rounded-lg border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            {icon}
            <span>{label}</span>
          </span>
          <button
            onClick={() => handleCopy(key, value, label)}
            className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition px-1.5 py-0.5 rounded hover:bg-blue-50 cursor-pointer font-medium"
            title={`复制 ${label}`}
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
        <div
          className={`text-sm text-slate-900 font-semibold truncate ${
            isMono ? 'font-mono' : ''
          } ${customClass || ''}`}
        >
          {value || '—'}
        </div>
      </div>
    );
  };

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${address.longitude - 0.02}%2C${address.latitude - 0.015}%2C${address.longitude + 0.02}%2C${address.latitude + 0.015}&layer=mapnik&marker=${address.latitude}%2C${address.longitude}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      
      {/* Header Profile Zone */}
      <div className="p-6 border-b border-slate-200 bg-linear-to-b from-slate-50/80 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl shadow-sm shrink-0">
              {address.flag}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {address.fullName}
                </h1>
                {address.nativeFullName && address.nativeFullName !== address.fullName && (
                  <span className="text-sm text-slate-500 font-normal">
                    ({address.nativeFullName})
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {address.gender === 'male' ? '男性 (Male)' : '女性 (Female)'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium font-mono">
                  {address.age} 岁
                </span>
                {address.isTaxFreeState && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold flex items-center gap-1 shadow-2xs">
                    <span>🎁</span>
                    <span>0% 消费税免税州</span>
                  </span>
                )}
              </div>

              {/* Clean metadata separated by dot (anti-slop rule) */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <span>{address.countryName}</span>
                <span aria-hidden="true">·</span>
                <span className={address.isTaxFreeState ? 'text-emerald-700 font-semibold' : ''}>
                  {address.state}
                  {address.isTaxFreeState ? ' (0% 免税)' : ''}
                </span>
                <span aria-hidden="true">·</span>
                <span>{address.city}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-blue-600 font-semibold">{address.postalCode}</span>
                <span aria-hidden="true">·</span>
                <span>{address.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* SVG QR Code Toggle Button */}
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 shadow-2xs ${
                showQrCode
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
              }`}
              title="生成并扫描二维码到手机测试"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQrCode ? '收起二维码' : '手机扫码测试'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(address)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
                isFavorite
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFavorite ? '已收藏' : '收藏'}</span>
            </button>

            <button
              onClick={() => handleCopy('all-single', address.fullAddressSingleLine, '单行格式地址')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制单行格式</span>
            </button>

            <button
              onClick={() => handleCopy('all-json', JSON.stringify(address, null, 2), 'JSON 结构')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>复制 JSON</span>
            </button>
          </div>
        </div>

        {/* US Tax-Free State Notice Callout */}
        {address.isTaxFreeState && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs bg-emerald-50/80 -mx-6 -mb-6 px-6 py-2.5 text-emerald-950 border-b border-emerald-200/80">
            <div className="flex items-center gap-2.5">
              <span className="text-base shrink-0">🎁</span>
              <div>
                <span className="font-bold">美国免税州 (0% State Sales Tax)：</span>
                <span>
                  当前地址位于 <strong>{address.state} ({address.stateCode})</strong>，属于美国五大零消费税州之一。常用于海淘转运仓、免税购物下单模拟、Stripe/PayPal 跨境税费计算与独立站结账测试。
                </span>
              </div>
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-mono font-bold hidden sm:inline">
              0% ZERO TAX
            </span>
          </div>
        )}
      </div>

      {/* SVG QR Code Panel (For mobile testing devices) */}
      {showQrCode && (
        <div className="border-b border-slate-200 bg-slate-50/80 p-6 animate-fadeIn transition-all">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
            
            {/* SVG QR Code Display */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <QRCodeSVG
                  id="address-qr-svg"
                  value={currentQrValue}
                  size={164}
                  level="M"
                  includeMargin={true}
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadQrSvg}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition flex items-center gap-1"
                  title="下载高保真 SVG 矢量格式二维码"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>下载 SVG 矢量图</span>
                </button>
                <button
                  onClick={() => handleCopy('qr-raw', currentQrValue, '二维码内容')}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>复制原始内容</span>
                </button>
              </div>
            </div>

            {/* QR Code Format & Mobile Testing Options */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    移动测试设备即时扫码 (Scan to Mobile Device)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  SVG 矢量高清渲染 · 零失真缩放
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                使用手机原生相机或扫码器扫描二维码，即可将当前生成的地址和虚拟身份数据实时同步至移动端测试机，无需手动打字或通过剪贴板互传。
              </p>

              {/* Format Selector Tabs */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                  扫码传输格式：
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setQrFormat('vcard')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border ${
                      qrFormat === 'vcard'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📇 vCard 电子名片 (推荐：手机相机直接识别为联系人/地址)
                  </button>

                  <button
                    onClick={() => setQrFormat('address')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border ${
                      qrFormat === 'address'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    📍 单行纯文本地址
                  </button>

                  <button
                    onClick={() => setQrFormat('geo')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border ${
                      qrFormat === 'geo'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🗺️ Geo 定位 URI (直接调起手机地图 App)
                  </button>

                  <button
                    onClick={() => setQrFormat('json')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition border ${
                      qrFormat === 'json'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ⚙️ 结构化 JSON
                  </button>
                </div>
              </div>

              {/* Payload Preview */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
                  <span>当前二维码编码内容预览:</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {currentQrValue.length} 字符
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-24 overflow-y-auto select-all leading-tight">
                  {currentQrValue}
                </pre>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Grid of structured details */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Address & Location */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>地址与地理位置 (Address & Geo)</span>
            </h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <MapIcon className="w-3 h-3" />
              <span>{showMap ? '隐藏地图' : '查看实景地图'}</span>
            </button>
          </div>

          {renderField('streetNumber', '街道门牌号', address.streetNumber, null, true)}
          {renderField('streetName', '街道名称 (Street Name)', address.streetName)}
          {renderField('streetAddress', '完整路名与号 (Street Address)', address.streetAddress)}
          {renderField('secondaryAddress', '次级单元/公寓 (Apt / Suite / Room)', address.secondaryAddress || '无次级地址')}
          {renderField('city', '城市 / 区域 (City / District)', address.city)}
          {renderField(
            'state',
            '州 / 省份 (State / Province)',
            address.isTaxFreeState
              ? `${address.state} (${address.stateCode}) · [0% 消费税免税州]`
              : `${address.state} (${address.stateCode})`,
            null,
            false,
            address.isTaxFreeState ? 'text-emerald-700 font-bold' : ''
          )}
          {renderField(
            'postalCode',
            '邮政编码 (Postal / ZIP Code)',
            address.postalCode,
            null,
            true,
            'text-blue-600 font-bold text-base'
          )}
          {renderField(
            'coords',
            'GPS 经纬度 (Latitude, Longitude)',
            `${address.latitude}, ${address.longitude}`,
            null,
            true,
            'text-xs'
          )}
        </div>

        {/* Column 2: Personal & Contact */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>个人与联络信息 (Personal & Contact)</span>
          </h2>

          {renderField('firstName', '名 (First Name)', address.firstName)}
          {renderField('lastName', '姓氏 (Last Name)', address.lastName)}
          {renderField('gender', '性别 (Gender)', address.gender === 'male' ? '男性 (Male)' : '女性 (Female)')}
          {renderField(
            'birthday',
            '出生日期 / 年龄',
            `${address.birthDate} (${address.age} 岁)`,
            null,
            true
          )}
          {renderField(
            'phone',
            '电话号码 (Phone Number)',
            address.phone,
            <Phone className="w-3 h-3 text-slate-400" />,
            true,
            'text-slate-900 font-bold'
          )}
          {renderField(
            'email',
            '测试邮箱 (Email Address)',
            address.email,
            <Mail className="w-3 h-3 text-slate-400" />,
            true,
            'text-xs'
          )}
          {renderField('username', '账号用户名 (Username)', address.username, null, true, 'text-xs')}
          {renderField(
            'company',
            '就职公司 (Company)',
            address.company,
            <Building className="w-3 h-3 text-slate-400" />
          )}
          {renderField('jobTitle', '职务职位 (Job Title)', address.jobTitle)}
        </div>

        {/* Column 3: QA Test Identifiers & Financial */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>开发测试标识 (QA Test Data)</span>
          </h2>

          {/* National ID Box */}
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
            <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
              <span className="font-semibold">{address.nationalIdName}</span>
              <button
                onClick={() => handleCopy('nationalId', address.nationalId, address.nationalIdName)}
                className="text-[11px] text-amber-800 hover:text-amber-950 font-medium px-1.5 py-0.5 rounded hover:bg-amber-100 flex items-center gap-1"
              >
                {copiedField === 'nationalId' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>复制</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-amber-950 tracking-wider">
              {address.nationalId}
            </div>
            <div className="text-[10px] text-amber-700 mt-1">
              * 符合校验规则的模拟测试数据，仅供软件测试开发填写
            </div>
          </div>

          {/* Test Credit Card Box */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-900 text-white shadow-xs">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>{address.creditCardType} (Luhn 校验通过)</span>
              </div>
              <button
                onClick={() =>
                  handleCopy('cc-num', address.creditCardNumber.replace(/(\d{4})/g, '$1 ').trim(), '测试卡号')
                }
                className="text-[11px] text-blue-300 hover:text-white font-medium flex items-center gap-1"
              >
                {copiedField === 'cc-num' ? (
                  <span className="text-emerald-400">已复制</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>复制卡号</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="font-mono text-base font-bold tracking-widest text-white py-1">
              {address.creditCardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 mt-1 border-t border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block">VALID THRU</span>
                <span className="font-mono font-semibold text-white">{address.creditCardExp}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CVV / CVC</span>
                <span className="font-mono font-semibold text-white">{address.creditCardCvv}</span>
              </div>
            </div>
          </div>

          {/* Formatted Mailing Label Box */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold">标准邮政寄送格式 (Mailing Label)</span>
              <button
                onClick={() => handleCopy('mailing-label', address.fullMailingLabel, '邮寄标签')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {copiedField === 'mailing-label' ? (
                  <span className="text-emerald-600">已复制</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>复制标签</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {address.fullMailingLabel}
            </pre>
          </div>

        </div>

      </div>

      {/* Expandable OpenStreetMap View */}
      {showMap && (
        <div className="border-t border-slate-200 bg-slate-50 p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>当前模拟坐标: {address.latitude}, {address.longitude} ({address.city}, {address.countryName})</span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
            >
              <span>在 Google Maps 打开</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="w-full h-72 rounded-lg overflow-hidden border border-slate-300 shadow-inner bg-slate-200">
            <iframe
              title="OpenStreetMap Location"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapEmbedUrl}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

    </div>
  );
};
