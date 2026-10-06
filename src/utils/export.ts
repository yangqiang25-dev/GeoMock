import { AddressData } from '../types/address';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch {
    return false;
  }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportToCSV(addresses: AddressData[]): string {
  const headers = [
    'Country',
    'Full Name',
    'Gender',
    'Street Address',
    'Secondary Address',
    'City',
    'State / Province',
    'Postal Code',
    'Phone',
    'Email',
    'National ID Name',
    'National ID',
    'Company',
    'Job Title',
    'Latitude',
    'Longitude'
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = addresses.map((a) => [
    escapeCSV(a.countryName),
    escapeCSV(a.fullName),
    escapeCSV(a.gender),
    escapeCSV(a.streetAddress),
    escapeCSV(a.secondaryAddress),
    escapeCSV(a.city),
    escapeCSV(a.state),
    escapeCSV(a.postalCode),
    escapeCSV(a.phone),
    escapeCSV(a.email),
    escapeCSV(a.nationalIdName),
    escapeCSV(a.nationalId),
    escapeCSV(a.company),
    escapeCSV(a.jobTitle),
    escapeCSV(a.latitude),
    escapeCSV(a.longitude)
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportToJSON(addresses: AddressData[]): string {
  return JSON.stringify(addresses, null, 2);
}

export function exportToTXT(addresses: AddressData[]): string {
  return addresses
    .map(
      (a, i) =>
        `# Record ${i + 1} (${a.countryName} - ${a.flag})\n` +
        `Name: ${a.fullName}${a.nativeFullName ? ` (${a.nativeFullName})` : ''}\n` +
        `Address: ${a.fullStreetAddress}\n` +
        `City/State/Zip: ${a.city}, ${a.state} ${a.postalCode}\n` +
        `Country: ${a.countryName}\n` +
        `Phone: ${a.phone}\n` +
        `Email: ${a.email}\n` +
        `ID (${a.nationalIdName}): ${a.nationalId}\n` +
        `Coordinates: ${a.latitude}, ${a.longitude}\n` +
        `Single-line: ${a.fullAddressSingleLine}\n`
    )
    .join('\n----------------------------------------\n\n');
}
