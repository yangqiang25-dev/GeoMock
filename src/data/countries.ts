import { CountryCode, CountryInfo } from '../types/address';

export interface StateData {
  name: string;
  code: string;
  isTaxFree?: boolean;
  cities: {
    name: string;
    postalPrefix: string;
    lat: number;
    lng: number;
  }[];
}

export interface CountryDataset {
  info: CountryInfo;
  states: StateData[];
  maleFirstNames: string[];
  femaleFirstNames: string[];
  lastNames: string[];
  streetNames: string[];
  streetTypes: string[];
  companies: string[];
  jobTitles: string[];
  idLabel: string;
  generateId: (birthDate: string, gender: 'male' | 'female') => string;
  generatePhone: (stateCode?: string) => string;
  formatAddress: (data: {
    street: string;
    secondary: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  }) => { singleLine: string; mailingLabel: string };
}

// Luhn check digit algorithm for generating valid test credit cards
export function generateLuhnCard(prefix: string, length: number): string {
  let number = prefix;
  while (number.length < length - 1) {
    number += Math.floor(Math.random() * 10).toString();
  }
  
  // Calculate Luhn checksum digit
  let sum = 0;
  let shouldDouble = true;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return number + checkDigit.toString();
}

// GB11643 Chinese Resident ID valid 18th check digit algorithm
export function generateChineseID(birthDateStr: string, gender: 'male' | 'female'): string {
  // birthDateStr is YYYY-MM-DD -> YYYYMMDD
  const birthClean = birthDateStr.replace(/-/g, '');
  const areaCodes = ['110101', '310104', '440106', '440304', '330106', '510104', '420102', '320102'];
  const area = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const seq1 = Math.floor(Math.random() * 10);
  const seq2 = Math.floor(Math.random() * 10);
  // Gender digit: odd for male, even for female
  let seq3 = Math.floor(Math.random() * 5) * 2;
  if (gender === 'male') {
    seq3 += 1;
  }
  const prefix17 = `${area}${birthClean}${seq1}${seq2}${seq3}`;
  
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkList = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(prefix17.charAt(i), 10) * weights[i];
  }
  const checkDigit = checkList[sum % 11];
  return `${prefix17}${checkDigit}`;
}

export const COUNTRIES: Record<CountryCode, CountryDataset> = {
  US: {
    info: {
      code: 'US',
      code3: 'USA',
      name: 'United States',
      nativeName: 'United States',
      flag: '🇺🇸',
      phonePrefix: '+1',
      currency: 'USD',
      currencySymbol: '$',
      timezone: 'America/New_York'
    },
    states: [
      {
        name: 'California',
        code: 'CA',
        cities: [
          { name: 'Los Angeles', postalPrefix: '900', lat: 34.0522, lng: -118.2437 },
          { name: 'San Francisco', postalPrefix: '941', lat: 37.7749, lng: -122.4194 },
          { name: 'San Diego', postalPrefix: '921', lat: 32.7157, lng: -117.1611 },
          { name: 'San Jose', postalPrefix: '951', lat: 37.3382, lng: -121.8863 },
          { name: 'Sacramento', postalPrefix: '958', lat: 38.5816, lng: -121.4944 }
        ]
      },
      {
        name: 'New York',
        code: 'NY',
        cities: [
          { name: 'New York', postalPrefix: '100', lat: 40.7128, lng: -74.006 },
          { name: 'Brooklyn', postalPrefix: '112', lat: 40.6782, lng: -73.9442 },
          { name: 'Buffalo', postalPrefix: '142', lat: 42.8864, lng: -78.8784 },
          { name: 'Albany', postalPrefix: '122', lat: 42.6526, lng: -73.7562 }
        ]
      },
      {
        name: 'Texas',
        code: 'TX',
        cities: [
          { name: 'Houston', postalPrefix: '770', lat: 29.7604, lng: -95.3698 },
          { name: 'Austin', postalPrefix: '787', lat: 30.2672, lng: -97.7431 },
          { name: 'Dallas', postalPrefix: '752', lat: 32.7767, lng: -96.797 },
          { name: 'San Antonio', postalPrefix: '782', lat: 29.4241, lng: -98.4936 }
        ]
      },
      {
        name: 'Washington',
        code: 'WA',
        cities: [
          { name: 'Seattle', postalPrefix: '981', lat: 47.6062, lng: -122.3321 },
          { name: 'Bellevue', postalPrefix: '980', lat: 47.6101, lng: -122.2015 },
          { name: 'Spokane', postalPrefix: '992', lat: 47.6588, lng: -117.426 }
        ]
      },
      {
        name: 'Florida',
        code: 'FL',
        cities: [
          { name: 'Miami', postalPrefix: '331', lat: 25.7617, lng: -80.1918 },
          { name: 'Orlando', postalPrefix: '328', lat: 28.5383, lng: -81.3792 },
          { name: 'Tampa', postalPrefix: '336', lat: 27.9506, lng: -82.4572 }
        ]
      },
      {
        name: 'Illinois',
        code: 'IL',
        cities: [
          { name: 'Chicago', postalPrefix: '606', lat: 41.8781, lng: -87.6298 },
          { name: 'Naperville', postalPrefix: '605', lat: 41.7508, lng: -88.1535 },
          { name: 'Springfield', postalPrefix: '627', lat: 39.7817, lng: -89.6501 }
        ]
      },
      // 5 US Tax-Free States (0% State Sales Tax)
      {
        name: 'Delaware',
        code: 'DE',
        isTaxFree: true,
        cities: [
          { name: 'Wilmington', postalPrefix: '198', lat: 39.7447, lng: -75.5484 },
          { name: 'New Castle', postalPrefix: '197', lat: 39.6621, lng: -75.5663 },
          { name: 'Newark', postalPrefix: '197', lat: 39.6837, lng: -75.7497 },
          { name: 'Dover', postalPrefix: '199', lat: 39.1582, lng: -75.5244 }
        ]
      },
      {
        name: 'Oregon',
        code: 'OR',
        isTaxFree: true,
        cities: [
          { name: 'Portland', postalPrefix: '972', lat: 45.5152, lng: -122.6784 },
          { name: 'Beaverton', postalPrefix: '970', lat: 45.4871, lng: -122.8037 },
          { name: 'Eugene', postalPrefix: '974', lat: 44.0521, lng: -123.0868 },
          { name: 'Salem', postalPrefix: '973', lat: 44.9429, lng: -123.0351 }
        ]
      },
      {
        name: 'Montana',
        code: 'MT',
        isTaxFree: true,
        cities: [
          { name: 'Billings', postalPrefix: '591', lat: 45.7833, lng: -108.5007 },
          { name: 'Missoula', postalPrefix: '598', lat: 46.8721, lng: -113.994 },
          { name: 'Bozeman', postalPrefix: '597', lat: 45.677, lng: -111.0429 },
          { name: 'Helena', postalPrefix: '596', lat: 46.5958, lng: -112.0363 }
        ]
      },
      {
        name: 'New Hampshire',
        code: 'NH',
        isTaxFree: true,
        cities: [
          { name: 'Manchester', postalPrefix: '031', lat: 42.9956, lng: -71.4548 },
          { name: 'Nashua', postalPrefix: '030', lat: 42.7654, lng: -71.4676 },
          { name: 'Concord', postalPrefix: '033', lat: 43.2081, lng: -71.5376 }
        ]
      },
      {
        name: 'Alaska',
        code: 'AK',
        isTaxFree: true,
        cities: [
          { name: 'Anchorage', postalPrefix: '995', lat: 61.2181, lng: -149.9003 },
          { name: 'Fairbanks', postalPrefix: '997', lat: 64.8378, lng: -147.7164 },
          { name: 'Juneau', postalPrefix: '998', lat: 58.3019, lng: -134.4197 }
        ]
      }
    ],
    maleFirstNames: ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Alexander', 'Ethan'],
    femaleFirstNames: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Emily', 'Sophia', 'Olivia', 'Emma'],
    lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'],
    streetNames: ['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake', 'Hill', 'Park', 'Highland', 'Sunset', 'Broadway', 'Market', 'Spring', 'Chestnut', 'River', 'Forest'],
    streetTypes: ['St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Ln', 'Way', 'Ct', 'Terrace'],
    companies: ['Horizon Cloud Systems', 'Vanguard Logic Inc.', 'Pacific Apex Logistics', 'Starlight Media Corp', 'BluePeak Technologies', 'Meridian Global Labs'],
    jobTitles: ['Software Engineer', 'Product Manager', 'Data Analyst', 'Account Executive', 'Operations Specialist', 'DevOps Architect', 'Marketing Lead'],
    idLabel: 'SSN (Social Security)',
    generateId: () => {
      const area = Math.floor(Math.random() * 899 + 100);
      const group = Math.floor(Math.random() * 89 + 10);
      const serial = Math.floor(Math.random() * 8999 + 1000);
      return `${area}-${group}-${serial}`;
    },
    generatePhone: () => {
      const area = Math.floor(Math.random() * 700 + 201);
      const mid = Math.floor(Math.random() * 800 + 100);
      const end = Math.floor(Math.random() * 8999 + 1000);
      return `+1 (${area}) ${mid}-${end}`;
    },
    formatAddress: ({ street, secondary, city, stateCode, postalCode }) => {
      const line1 = secondary ? `${street}, ${secondary}` : street;
      return {
        singleLine: `${line1}, ${city}, ${stateCode} ${postalCode}, USA`,
        mailingLabel: `${line1}\n${city}, ${stateCode} ${postalCode}\nUnited States`
      };
    }
  },

  GB: {
    info: {
      code: 'GB',
      code3: 'GBR',
      name: 'United Kingdom',
      nativeName: 'United Kingdom',
      flag: '🇬🇧',
      phonePrefix: '+44',
      currency: 'GBP',
      currencySymbol: '£',
      timezone: 'Europe/London'
    },
    states: [
      {
        name: 'Greater London',
        code: 'GL',
        cities: [
          { name: 'London', postalPrefix: 'SW1A', lat: 51.5074, lng: -0.1278 },
          { name: 'Westminster', postalPrefix: 'W1D', lat: 51.4975, lng: -0.1357 },
          { name: 'Camden', postalPrefix: 'NW1', lat: 51.5416, lng: -0.1426 },
          { name: 'Greenwich', postalPrefix: 'SE10', lat: 51.4826, lng: -0.0077 }
        ]
      },
      {
        name: 'Greater Manchester',
        code: 'GM',
        cities: [
          { name: 'Manchester', postalPrefix: 'M1', lat: 53.4808, lng: -2.2426 },
          { name: 'Salford', postalPrefix: 'M5', lat: 53.4875, lng: -2.2901 }
        ]
      },
      {
        name: 'West Midlands',
        code: 'WM',
        cities: [
          { name: 'Birmingham', postalPrefix: 'B1', lat: 52.4862, lng: -1.8904 },
          { name: 'Coventry', postalPrefix: 'CV1', lat: 52.4068, lng: -1.5197 }
        ]
      },
      {
        name: 'Scotland',
        code: 'SCT',
        cities: [
          { name: 'Edinburgh', postalPrefix: 'EH1', lat: 55.9533, lng: -3.1883 },
          { name: 'Glasgow', postalPrefix: 'G1', lat: 55.8642, lng: -4.2518 }
        ]
      },
      {
        name: 'West Yorkshire',
        code: 'WY',
        cities: [
          { name: 'Leeds', postalPrefix: 'LS1', lat: 53.8008, lng: -1.5491 }
        ]
      }
    ],
    maleFirstNames: ['Oliver', 'George', 'Harry', 'Jack', 'Jacob', 'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar', 'William', 'James', 'Alfie', 'Henry'],
    femaleFirstNames: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Isabella', 'Mia', 'Poppy', 'Ella', 'Lily', 'Sophia', 'Grace', 'Charlotte', 'Freya'],
    lastNames: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Edwards', 'Hughes'],
    streetNames: ['High', 'Church', 'Station', 'Victoria', 'Green', 'Manor', 'Park', 'Queens', 'Kings', 'Mill', 'North', 'St John’s', 'London', 'George'],
    streetTypes: ['Street', 'Road', 'Avenue', 'Lane', 'Close', 'Drive', 'Way', 'Gardens', 'Crescent'],
    companies: ['Apex Britannic Logistics', 'Sterling Thames Advisory', 'Albion Core Solutions', 'Caledonia Ventures Ltd', 'Beacon & Crown Tech'],
    jobTitles: ['Lead Consultant', 'Senior Developer', 'Finance Director', 'Business Analyst', 'Operations Director', 'Quantity Surveyor'],
    idLabel: 'National Insurance Number',
    generateId: () => {
      const letters = 'ABCDEFGHJKLMNPRSTWXYZ';
      const p1 = letters[Math.floor(Math.random() * letters.length)];
      const p2 = letters[Math.floor(Math.random() * letters.length)];
      const num = Math.floor(Math.random() * 899999 + 100000);
      const end = 'ABCD'[Math.floor(Math.random() * 4)];
      return `${p1}${p2} ${num.toString().slice(0, 2)} ${num.toString().slice(2, 4)} ${num.toString().slice(4, 6)} ${end}`;
    },
    generatePhone: () => {
      const middle = Math.floor(Math.random() * 8999 + 1000);
      const end = Math.floor(Math.random() * 899999 + 100000);
      return `+44 7${middle.toString().slice(0, 3)} ${end}`;
    },
    formatAddress: ({ street, secondary, city, state, postalCode }) => {
      const line1 = secondary ? `${secondary}, ${street}` : street;
      return {
        singleLine: `${line1}, ${city}, ${state}, ${postalCode}, United Kingdom`,
        mailingLabel: `${line1}\n${city}\n${postalCode}\nUnited Kingdom`
      };
    }
  },

  CN: {
    info: {
      code: 'CN',
      code3: 'CHN',
      name: 'China',
      nativeName: '中国',
      flag: '🇨🇳',
      phonePrefix: '+86',
      currency: 'CNY',
      currencySymbol: '¥',
      timezone: 'Asia/Shanghai'
    },
    states: [
      {
        name: '北京市',
        code: 'BJ',
        cities: [
          { name: '朝阳区', postalPrefix: '100020', lat: 39.9219, lng: 116.4431 },
          { name: '海淀区', postalPrefix: '100080', lat: 39.9599, lng: 116.2981 },
          { name: '西城区', postalPrefix: '100032', lat: 39.9123, lng: 116.3659 },
          { name: '东城区', postalPrefix: '100010', lat: 39.9284, lng: 116.4164 }
        ]
      },
      {
        name: '上海市',
        code: 'SH',
        cities: [
          { name: '浦东新区', postalPrefix: '200120', lat: 31.2215, lng: 121.5444 },
          { name: '黄浦区', postalPrefix: '200001', lat: 31.2317, lng: 121.4844 },
          { name: '徐汇区', postalPrefix: '200030', lat: 31.1883, lng: 121.4365 },
          { name: '静安区', postalPrefix: '200040', lat: 31.2286, lng: 121.4594 }
        ]
      },
      {
        name: '广东省',
        code: 'GD',
        cities: [
          { name: '深圳市南山区', postalPrefix: '518057', lat: 22.5333, lng: 113.9304 },
          { name: '广州市天河区', postalPrefix: '510630', lat: 23.1246, lng: 113.3619 },
          { name: '深圳市福田区', postalPrefix: '518048', lat: 22.5414, lng: 114.0596 },
          { name: '珠海市香洲区', postalPrefix: '519000', lat: 22.2707, lng: 113.5767 }
        ]
      },
      {
        name: '浙江省',
        code: 'ZJ',
        cities: [
          { name: '杭州市西湖区', postalPrefix: '310013', lat: 30.2592, lng: 120.1302 },
          { name: '杭州市余杭区', postalPrefix: '311100', lat: 30.4194, lng: 120.2995 },
          { name: '宁波市鄞州区', postalPrefix: '315100', lat: 29.8143, lng: 121.5647 }
        ]
      },
      {
        name: '四川省',
        code: 'SC',
        cities: [
          { name: '成都市高新区', postalPrefix: '610041', lat: 30.5728, lng: 104.0668 },
          { name: '成都市锦江区', postalPrefix: '610021', lat: 30.6565, lng: 104.0835 }
        ]
      }
    ],
    maleFirstNames: ['浩然', '子轩', '宇航', '伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '明', '超', '鹏', '晨', '俊杰', '天佑', '嘉树'],
    femaleFirstNames: ['静', '婷', '敏', '雪', '雨欣', '子涵', '欣怡', '美', '丽', '慧', '娜', '芳', '倩', '琳', '思彤', '语嫣', '梦瑶'],
    lastNames: ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '郑'],
    streetNames: ['人民', '建设', '解放', '中山', '复兴', '和平', '光明', '新华', '迎宾', '朝阳', '文三', '科技', '南山', '世纪', '长宁'],
    streetTypes: ['路', '大道', '街', '巷', '南路', '北路', '中路', '东大道'],
    companies: ['宏图盛世数码科技有限公司', '远瞻智联创想网络有限公司', '乾坤浩博数据技术集团', '华夏云聚智能软件有限公司', '凌霄创科供应链有限公司'],
    jobTitles: ['高级前端工程师', '架构师', '产品总监', '全栈技术专家', '运营经理', '算法研发工程师', '品牌策略专家'],
    idLabel: '居民身份证号 (GB11643)',
    generateId: (birthDate, gender) => {
      return generateChineseID(birthDate, gender);
    },
    generatePhone: () => {
      const prefixes = ['138', '139', '150', '158', '186', '188', '177', '199', '133', '130'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(Math.random() * 89999999 + 10000000);
      return `+86 ${prefix} ${suffix.toString().slice(0, 4)} ${suffix.toString().slice(4, 8)}`;
    },
    formatAddress: ({ street, secondary, city, state, postalCode }) => {
      const streetPart = secondary ? `${street}${secondary}` : street;
      return {
        singleLine: `${state}${city}${streetPart}，邮编：${postalCode}`,
        mailingLabel: `中国 ${state} ${city}\n${streetPart}\n邮政编码：${postalCode}`
      };
    }
  },

  JP: {
    info: {
      code: 'JP',
      code3: 'JPN',
      name: 'Japan',
      nativeName: '日本',
      flag: '🇯🇵',
      phonePrefix: '+81',
      currency: 'JPY',
      currencySymbol: '¥',
      timezone: 'Asia/Tokyo'
    },
    states: [
      {
        name: '東京都',
        code: '13',
        cities: [
          { name: '新宿区', postalPrefix: '160', lat: 35.6938, lng: 139.7034 },
          { name: '渋谷区', postalPrefix: '150', lat: 35.6617, lng: 139.7041 },
          { name: '港区', postalPrefix: '105', lat: 35.6586, lng: 139.7514 },
          { name: '千代田区', postalPrefix: '100', lat: 35.694, lng: 139.7536 },
          { name: '中央区', postalPrefix: '104', lat: 35.6707, lng: 139.772 }
        ]
      },
      {
        name: '大阪府',
        code: '27',
        cities: [
          { name: '大阪市北区', postalPrefix: '530', lat: 34.7055, lng: 135.5003 },
          { name: '大阪市中央区', postalPrefix: '542', lat: 34.6813, lng: 135.5098 }
        ]
      },
      {
        name: '京都府',
        code: '26',
        cities: [
          { name: '京都市中京区', postalPrefix: '604', lat: 35.0116, lng: 135.7681 },
          { name: '京都市下京区', postalPrefix: '600', lat: 34.9875, lng: 135.7592 }
        ]
      },
      {
        name: '神奈川県',
        code: '14',
        cities: [
          { name: '横浜市西区', postalPrefix: '220', lat: 35.4583, lng: 139.6209 },
          { name: '横浜市中区', postalPrefix: '231', lat: 35.4447, lng: 139.6416 }
        ]
      },
      {
        name: '福岡県',
        code: '40',
        cities: [
          { name: '福岡市博多区', postalPrefix: '812', lat: 33.5902, lng: 130.4207 }
        ]
      }
    ],
    maleFirstNames: ['蓮', '大翔', '悠真', '陽翔', '湊', '一真', '健太', '拓也', '翔太', '直樹', '大輝', '陸'],
    femaleFirstNames: ['陽葵', '凛', '結菜', '芽依', '澪', '美咲', '花音', '結衣', '七海', 'さくら', '明日香', '愛'],
    lastNames: ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上'],
    streetNames: ['本町', '中央', '銀座', '緑町', '栄町', '大手町', '桜丘', '神南', '道玄坂', '南青山', '六本木', '芝公園'],
    streetTypes: ['丁目', '番地', '町'],
    companies: ['ソラリス・テクノロジーズ株式会社', '大和デジタルソリューションズ', 'サクラ・イノベーションズ', '日昇システム開発株式会社', '富士フロンティア工房'],
    jobTitles: ['シニアエンジニア', 'プロジェクトマネージャー', 'UI/UXデザイナー', 'システム管理責任者', 'データアナリスト'],
    idLabel: 'マイナンバー (My Number)',
    generateId: () => {
      const part1 = Math.floor(Math.random() * 8999 + 1000);
      const part2 = Math.floor(Math.random() * 8999 + 1000);
      const part3 = Math.floor(Math.random() * 8999 + 1000);
      return `${part1} ${part2} ${part3}`;
    },
    generatePhone: () => {
      const isMobile = Math.random() > 0.4;
      if (isMobile) {
        const prefix = ['090', '080', '070'][Math.floor(Math.random() * 3)];
        const mid = Math.floor(Math.random() * 8999 + 1000);
        const end = Math.floor(Math.random() * 8999 + 1000);
        return `+81 ${prefix}-${mid}-${end}`;
      }
      const mid = Math.floor(Math.random() * 8999 + 1000);
      const end = Math.floor(Math.random() * 8999 + 1000);
      return `+81 03-${mid}-${end}`;
    },
    formatAddress: ({ street, secondary, city, state, postalCode }) => {
      const streetPart = secondary ? `${street} ${secondary}` : street;
      return {
        singleLine: `〒${postalCode} ${state}${city}${streetPart} 日本`,
        mailingLabel: `〒${postalCode}\n${state} ${city}\n${streetPart}\n日本`
      };
    }
  },

  DE: {
    info: {
      code: 'DE',
      code3: 'DEU',
      name: 'Germany',
      nativeName: 'Deutschland',
      flag: '🇩🇪',
      phonePrefix: '+49',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Berlin'
    },
    states: [
      {
        name: 'Bayern',
        code: 'BY',
        cities: [
          { name: 'München', postalPrefix: '80', lat: 48.1351, lng: 11.582 },
          { name: 'Nürnberg', postalPrefix: '90', lat: 49.4521, lng: 11.0767 },
          { name: 'Augsburg', postalPrefix: '86', lat: 48.3705, lng: 10.8978 }
        ]
      },
      {
        name: 'Berlin',
        code: 'BE',
        cities: [
          { name: 'Berlin-Mitte', postalPrefix: '101', lat: 52.52, lng: 13.405 },
          { name: 'Charlottenburg', postalPrefix: '106', lat: 52.516, lng: 13.3039 },
          { name: 'Kreuzberg', postalPrefix: '109', lat: 52.4967, lng: 13.4069 }
        ]
      },
      {
        name: 'Baden-Württemberg',
        code: 'BW',
        cities: [
          { name: 'Stuttgart', postalPrefix: '70', lat: 48.7758, lng: 9.1829 },
          { name: 'Karlsruhe', postalPrefix: '76', lat: 49.0069, lng: 8.4037 },
          { name: 'Heidelberg', postalPrefix: '69', lat: 49.3988, lng: 8.6724 }
        ]
      },
      {
        name: 'Nordrhein-Westfalen',
        code: 'NW',
        cities: [
          { name: 'Köln', postalPrefix: '50', lat: 50.9375, lng: 6.9603 },
          { name: 'Düsseldorf', postalPrefix: '40', lat: 51.2277, lng: 6.7735 },
          { name: 'Dortmund', postalPrefix: '44', lat: 51.5136, lng: 7.4653 }
        ]
      },
      {
        name: 'Hamburg',
        code: 'HH',
        cities: [
          { name: 'Hamburg', postalPrefix: '20', lat: 53.5511, lng: 9.9937 }
        ]
      }
    ],
    maleFirstNames: ['Maximilian', 'Alexander', 'Paul', 'Leon', 'Lukas', 'Felix', 'Jonas', 'Elias', 'Niklas', 'Julian', 'Moritz', 'Finn', 'Jan'],
    femaleFirstNames: ['Emma', 'Mia', 'Hannah', 'Sophia', 'Emilia', 'Lina', 'Marie', 'Mila', 'Lea', 'Clara', 'Johanna', 'Laura', 'Nele'],
    lastNames: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein'],
    streetNames: ['Haupt', 'Bahnhof', 'Schiller', 'Goethe', 'Garten', 'Wald', 'Birken', 'Linden', 'Kirch', 'Kastanien', 'Mühlen', 'Post'],
    streetTypes: ['straße', 'weg', 'gasse', 'allee', 'platz'],
    companies: ['Kaiser & Braun Industrietechnik GmbH', 'Bavaria Data Systems AG', 'Hanseatic Logic Solutions', 'Rheinland Automation Werk', 'Nordstern Digital GbR'],
    jobTitles: ['Entwicklungsleiter', 'Systemarchitekt', 'Senior Softwareentwickler', 'Produktmanager', 'Qualitätsingenieur'],
    idLabel: 'Steueridentifikationsnummer (IdNr)',
    generateId: () => {
      const digits = [];
      for (let i = 0; i < 11; i++) {
        digits.push(Math.floor(Math.random() * 10));
      }
      return `${digits.slice(0, 2).join('')} ${digits.slice(2, 5).join('')} ${digits.slice(5, 8).join('')} ${digits.slice(8, 11).join('')}`;
    },
    generatePhone: () => {
      const area = ['30', '89', '40', '221', '711', '69'][Math.floor(Math.random() * 6)];
      const num = Math.floor(Math.random() * 8999999 + 1000000);
      return `+49 ${area} ${num}`;
    },
    formatAddress: ({ street, secondary, city, postalCode }) => {
      const line1 = secondary ? `${street}, ${secondary}` : street;
      return {
        singleLine: `${line1}, ${postalCode} ${city}, Deutschland`,
        mailingLabel: `${line1}\n${postalCode} ${city}\nDeutschland`
      };
    }
  },

  FR: {
    info: {
      code: 'FR',
      code3: 'FRA',
      name: 'France',
      nativeName: 'France',
      flag: '🇫🇷',
      phonePrefix: '+33',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Paris'
    },
    states: [
      {
        name: 'Île-de-France',
        code: 'IDF',
        cities: [
          { name: 'Paris', postalPrefix: '750', lat: 48.8566, lng: 2.3522 },
          { name: 'Boulogne-Billancourt', postalPrefix: '921', lat: 48.8397, lng: 2.2399 },
          { name: 'Saint-Denis', postalPrefix: '932', lat: 48.9362, lng: 2.3574 },
          { name: 'Versailles', postalPrefix: '780', lat: 48.8049, lng: 2.1204 }
        ]
      },
      {
        name: 'Auvergne-Rhône-Alpes',
        code: 'ARA',
        cities: [
          { name: 'Lyon', postalPrefix: '690', lat: 45.764, lng: 4.8357 },
          { name: 'Grenoble', postalPrefix: '380', lat: 45.1885, lng: 5.7245 }
        ]
      },
      {
        name: 'Provence-Alpes-Côte d’Azur',
        code: 'PACA',
        cities: [
          { name: 'Marseille', postalPrefix: '130', lat: 43.2965, lng: 5.3698 },
          { name: 'Nice', postalPrefix: '060', lat: 43.7102, lng: 7.262 }
        ]
      },
      {
        name: 'Nouvelle-Aquitaine',
        code: 'NAQ',
        cities: [
          { name: 'Bordeaux', postalPrefix: '330', lat: 44.8378, lng: -0.5792 }
        ]
      },
      {
        name: 'Occitanie',
        code: 'OCC',
        cities: [
          { name: 'Toulouse', postalPrefix: '310', lat: 43.6047, lng: 1.4442 }
        ]
      }
    ],
    maleFirstNames: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam', 'Jules', 'Hugo', 'Maël', 'Liam', 'Paul', 'Noah'],
    femaleFirstNames: ['Emma', 'Jade', 'Louise', 'Ambre', 'Alice', 'Lina', 'Chloé', 'Rose', 'Léa', 'Mila', 'Anna', 'Manon', 'Inès'],
    lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David'],
    streetNames: ['de la Paix', 'de la République', 'Victor Hugo', 'Jean Jaurès', 'Pasteur', 'de Paris', 'Gambetta', 'de la Gare', 'des Fleurs', 'Saint-Honoré', 'Voltaire'],
    streetTypes: ['Rue', 'Avenue', 'Boulevard', 'Allée', 'Place'],
    companies: ['Lumio Solutions SAS', 'Hexagone Conseil & Systèmes', 'Atelier Numérique de France', 'Vanguard Méditerranée SA', 'Étoile Analytics SARL'],
    jobTitles: ['Ingénieur Logiciel', 'Chef de Projet Digital', 'Responsable Produit', 'Directeur Artistique', 'Consultant SI'],
    idLabel: 'Numéro de Sécurité Sociale (NIR)',
    generateId: (birthDate, gender) => {
      const g = gender === 'male' ? '1' : '2';
      const year = birthDate.slice(2, 4);
      const month = birthDate.slice(5, 7);
      const dep = Math.floor(Math.random() * 89 + 10);
      const commune = Math.floor(Math.random() * 899 + 100);
      const order = Math.floor(Math.random() * 899 + 100);
      const key = Math.floor(Math.random() * 89 + 10);
      return `${g} ${year} ${month} ${dep} ${commune} ${order} ${key}`;
    },
    generatePhone: () => {
      const prefix = ['01', '06', '07'][Math.floor(Math.random() * 3)];
      const p1 = Math.floor(Math.random() * 89 + 10);
      const p2 = Math.floor(Math.random() * 89 + 10);
      const p3 = Math.floor(Math.random() * 89 + 10);
      const p4 = Math.floor(Math.random() * 89 + 10);
      return `+33 ${prefix} ${p1} ${p2} ${p3} ${p4}`;
    },
    formatAddress: ({ street, secondary, city, postalCode }) => {
      const line1 = secondary ? `${street} (${secondary})` : street;
      return {
        singleLine: `${line1}, ${postalCode} ${city}, France`,
        mailingLabel: `${line1}\n${postalCode} ${city}\nFrance`
      };
    }
  },

  CA: {
    info: {
      code: 'CA',
      code3: 'CAN',
      name: 'Canada',
      nativeName: 'Canada',
      flag: '🇨🇦',
      phonePrefix: '+1',
      currency: 'CAD',
      currencySymbol: 'C$',
      timezone: 'America/Toronto'
    },
    states: [
      {
        name: 'Ontario',
        code: 'ON',
        cities: [
          { name: 'Toronto', postalPrefix: 'M5', lat: 43.6532, lng: -79.3832 },
          { name: 'Ottawa', postalPrefix: 'K1', lat: 45.4215, lng: -75.6972 },
          { name: 'Mississauga', postalPrefix: 'L5', lat: 43.589, lng: -79.6441 }
        ]
      },
      {
        name: 'British Columbia',
        code: 'BC',
        cities: [
          { name: 'Vancouver', postalPrefix: 'V6', lat: 49.2827, lng: -123.1207 },
          { name: 'Victoria', postalPrefix: 'V8', lat: 48.4284, lng: -123.3656 }
        ]
      },
      {
        name: 'Quebec',
        code: 'QC',
        cities: [
          { name: 'Montreal', postalPrefix: 'H3', lat: 45.5017, lng: -73.5673 },
          { name: 'Quebec City', postalPrefix: 'G1', lat: 46.8139, lng: -71.208 }
        ]
      },
      {
        name: 'Alberta',
        code: 'AB',
        cities: [
          { name: 'Calgary', postalPrefix: 'T2', lat: 51.0447, lng: -114.0719 },
          { name: 'Edmonton', postalPrefix: 'T5', lat: 53.5461, lng: -113.4938 }
        ]
      }
    ],
    maleFirstNames: ['Liam', 'Noah', 'William', 'Benjamin', 'Lucas', 'Oliver', 'Logan', 'Ethan', 'Jacob', 'James', 'Alexander'],
    femaleFirstNames: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Ava', 'Sophia', 'Chloe', 'Mia', 'Evelyn', 'Aria', 'Mila'],
    lastNames: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'MacDonald', 'Gagnon', 'Johnson', 'Taylor', 'Côté', 'Campbell', 'Leblanc'],
    streetNames: ['King', 'Queen', 'Yonge', 'Bay', 'Maple', 'Pine', 'Laurier', 'Saint-Laurent', 'Jasper', 'Robson', 'Granville'],
    streetTypes: ['St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Way', 'Crescent'],
    companies: ['Great North Digital Corp', 'Maple Leaf Logic Systems', 'Pacific Horizon Enterprises', 'Laurentian Analytics Ltd', 'Keystone Robotics Inc'],
    jobTitles: ['Full Stack Developer', 'Project Coordinator', 'Product Strategist', 'Cloud Engineer', 'Business Development Lead'],
    idLabel: 'Social Insurance Number (SIN)',
    generateId: () => {
      const p1 = Math.floor(Math.random() * 899 + 100);
      const p2 = Math.floor(Math.random() * 899 + 100);
      const p3 = Math.floor(Math.random() * 899 + 100);
      return `${p1}-${p2}-${p3}`;
    },
    generatePhone: () => {
      const area = ['416', '647', '604', '778', '514', '403'][Math.floor(Math.random() * 6)];
      const mid = Math.floor(Math.random() * 899 + 100);
      const end = Math.floor(Math.random() * 8999 + 1000);
      return `+1 (${area}) ${mid}-${end}`;
    },
    formatAddress: ({ street, secondary, city, stateCode, postalCode }) => {
      const line1 = secondary ? `${street}, ${secondary}` : street;
      return {
        singleLine: `${line1}, ${city}, ${stateCode} ${postalCode}, Canada`,
        mailingLabel: `${line1}\n${city} ${stateCode} ${postalCode}\nCanada`
      };
    }
  },

  AU: {
    info: {
      code: 'AU',
      code3: 'AUS',
      name: 'Australia',
      nativeName: 'Australia',
      flag: '🇦🇺',
      phonePrefix: '+61',
      currency: 'AUD',
      currencySymbol: 'A$',
      timezone: 'Australia/Sydney'
    },
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        cities: [
          { name: 'Sydney', postalPrefix: '2000', lat: -33.8688, lng: 151.2093 },
          { name: 'Parramatta', postalPrefix: '2150', lat: -33.815, lng: 151.0011 },
          { name: 'Newcastle', postalPrefix: '2300', lat: -32.9283, lng: 151.7817 }
        ]
      },
      {
        name: 'Victoria',
        code: 'VIC',
        cities: [
          { name: 'Melbourne', postalPrefix: '3000', lat: -37.8136, lng: 144.9631 },
          { name: 'Geelong', postalPrefix: '3220', lat: -38.1499, lng: 144.3617 }
        ]
      },
      {
        name: 'Queensland',
        code: 'QLD',
        cities: [
          { name: 'Brisbane', postalPrefix: '4000', lat: -27.4698, lng: 153.0251 },
          { name: 'Gold Coast', postalPrefix: '4217', lat: -28.0167, lng: 153.4 }
        ]
      },
      {
        name: 'Western Australia',
        code: 'WA',
        cities: [
          { name: 'Perth', postalPrefix: '6000', lat: -31.9505, lng: 115.8605 }
        ]
      }
    ],
    maleFirstNames: ['Oliver', 'Noah', 'Jack', 'William', 'Leo', 'Lucas', 'Thomas', 'Charlie', 'Henry', 'Hudson', 'Harrison'],
    femaleFirstNames: ['Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava', 'Grace', 'Willow', 'Harper', 'Chloe', 'Ella'],
    lastNames: ['Smith', 'Jones', 'Taylor', 'Williams', 'Brown', 'Wilson', 'Kelly', 'King', 'Johnson', 'Martin', 'Anderson', 'Walker', 'Harris'],
    streetNames: ['George', 'Pitt', 'Collins', 'Bourke', 'Elizabeth', 'Flinders', 'Victoria', 'Oxford', 'Crown', 'King', 'William'],
    streetTypes: ['Street', 'Road', 'Avenue', 'Parade', 'Drive', 'Place', 'Highway'],
    companies: ['Southern Cross Tech Pty Ltd', 'Opal Harbour Digital', 'Outback Logic Systems', 'Sunstate Analytics Pty', 'Pacific Crest Solutions'],
    jobTitles: ['Solutions Architect', 'Product Designer', 'Senior Software Engineer', 'Operations Lead', 'Client Director'],
    idLabel: 'Tax File Number (TFN)',
    generateId: () => {
      const p1 = Math.floor(Math.random() * 899 + 100);
      const p2 = Math.floor(Math.random() * 899 + 100);
      const p3 = Math.floor(Math.random() * 899 + 100);
      return `${p1} ${p2} ${p3}`;
    },
    generatePhone: () => {
      const mid = Math.floor(Math.random() * 899 + 100);
      const end = Math.floor(Math.random() * 899 + 100);
      return `+61 4${Math.floor(Math.random() * 9 + 1)} ${mid} ${end}`;
    },
    formatAddress: ({ street, secondary, city, stateCode, postalCode }) => {
      const line1 = secondary ? `${secondary}, ${street}` : street;
      return {
        singleLine: `${line1}, ${city} ${stateCode} ${postalCode}, Australia`,
        mailingLabel: `${line1}\n${city} ${stateCode} ${postalCode}\nAustralia`
      };
    }
  },

  SG: {
    info: {
      code: 'SG',
      code3: 'SGP',
      name: 'Singapore',
      nativeName: 'Singapore',
      flag: '🇸🇬',
      phonePrefix: '+65',
      currency: 'SGD',
      currencySymbol: 'S$',
      timezone: 'Asia/Singapore'
    },
    states: [
      {
        name: 'Central Region',
        code: 'CR',
        cities: [
          { name: 'Downtown Core', postalPrefix: '01', lat: 1.2879, lng: 103.8519 },
          { name: 'Orchard', postalPrefix: '23', lat: 1.3048, lng: 103.8318 },
          { name: 'Marina Bay', postalPrefix: '03', lat: 1.2834, lng: 103.8607 },
          { name: 'Tanjong Pagar', postalPrefix: '08', lat: 1.2764, lng: 103.844 }
        ]
      },
      {
        name: 'East Region',
        code: 'ER',
        cities: [
          { name: 'Bedok', postalPrefix: '46', lat: 1.3236, lng: 103.9273 },
          { name: 'Tampines', postalPrefix: '52', lat: 1.3524, lng: 103.9447 }
        ]
      },
      {
        name: 'West Region',
        code: 'WR',
        cities: [
          { name: 'Jurong East', postalPrefix: '60', lat: 1.3329, lng: 103.7436 },
          { name: 'Clementi', postalPrefix: '12', lat: 1.3162, lng: 103.7649 }
        ]
      }
    ],
    maleFirstNames: ['Wei Jie', 'Jun Wei', 'Lucas', 'Ryan', 'Ethan', 'Marcus', 'Zhi Wei', 'Darren', 'Nicholas', 'Bryan', 'Jia Jun'],
    femaleFirstNames: ['Jia Yi', 'Xin Yi', 'Rachel', 'Chloe', 'Hui Ling', 'Nicole', 'Cheryl', 'Jolene', 'Ashley', 'Mei Ling'],
    lastNames: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh', 'Teo', 'Ang', 'Yeo', 'Tay', 'Low'],
    streetNames: ['Orchard', 'Robinson', 'Shenton', 'North Bridge', 'Victoria', 'Anson', 'Bras Basah', 'Beach', 'Raffles', 'Serangoon'],
    streetTypes: ['Road', 'Way', 'Boulevard', 'Avenue', 'Street', 'Quay'],
    companies: ['Merlion Digital Capital', 'Lion City FinTech Labs', 'Apex Straits Logistics', 'Marina Horizon Tech Pte Ltd', 'SingaCore Advisory'],
    jobTitles: ['VP of Engineering', 'FinTech Product Lead', 'Solutions Consultant', 'Data Scientist', 'Regional Strategy Manager'],
    idLabel: 'NRIC / FIN Number',
    generateId: () => {
      const prefix = ['S', 'T'][Math.floor(Math.random() * 2)];
      const num = Math.floor(Math.random() * 8999999 + 1000000);
      const checksums = 'ABCDEFGHIZJ';
      const check = checksums[Math.floor(Math.random() * checksums.length)];
      return `${prefix}${num}${check}`;
    },
    generatePhone: () => {
      const prefix = ['8', '9'][Math.floor(Math.random() * 2)];
      const num = Math.floor(Math.random() * 8999999 + 1000000);
      return `+65 ${prefix}${num.toString().slice(0, 3)} ${num.toString().slice(3, 7)}`;
    },
    formatAddress: ({ street, secondary, postalCode }) => {
      const block = `Blk ${Math.floor(Math.random() * 899 + 100)}`;
      const unit = secondary || `#${Math.floor(Math.random() * 20 + 2).toString().padStart(2, '0')}-${Math.floor(Math.random() * 99 + 1).toString().padStart(2, '0')}`;
      return {
        singleLine: `${block} ${street} ${unit}, Singapore ${postalCode}`,
        mailingLabel: `${block} ${street}\n${unit}\nSingapore ${postalCode}`
      };
    }
  },

  KR: {
    info: {
      code: 'KR',
      code3: 'KOR',
      name: 'South Korea',
      nativeName: '대한민국',
      flag: '🇰🇷',
      phonePrefix: '+82',
      currency: 'KRW',
      currencySymbol: '₩',
      timezone: 'Asia/Seoul'
    },
    states: [
      {
        name: '서울특별시',
        code: '11',
        cities: [
          { name: '강남구', postalPrefix: '06', lat: 37.5172, lng: 127.0473 },
          { name: '서초구', postalPrefix: '06', lat: 37.4837, lng: 127.0324 },
          { name: '마포구', postalPrefix: '04', lat: 37.5663, lng: 126.9016 },
          { name: '송파구', postalPrefix: '05', lat: 37.5145, lng: 127.1066 },
          { name: '종로구', postalPrefix: '03', lat: 37.5735, lng: 126.979 }
        ]
      },
      {
        name: '부산광역시',
        code: '26',
        cities: [
          { name: '해운대구', postalPrefix: '48', lat: 35.1631, lng: 129.1636 },
          { name: '부산진구', postalPrefix: '47', lat: 35.1631, lng: 129.0532 }
        ]
      },
      {
        name: '경기도',
        code: '41',
        cities: [
          { name: '성남시 분당구', postalPrefix: '13', lat: 37.3827, lng: 127.1189 },
          { name: '수원시 영통구', postalPrefix: '16', lat: 37.2596, lng: 127.0465 }
        ]
      }
    ],
    maleFirstNames: ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '준우', '현우', '도현', '건우', '우진'],
    femaleFirstNames: ['서연', '서윤', '지우', '서현', '하은', '하윤', '민서', '지유', '윤서', '채원', '수아', '지아'],
    lastNames: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'],
    streetNames: ['테헤란로', '강남대로', '세종대로', '을지로', '테크노중앙로', '판교역로', '해운대해변로', '도산대로', '압구정로'],
    streetTypes: ['길', '로', '번길'],
    companies: ['한울 테크놀로지스', '넥스트웨이브 솔루션즈', '다온 소프트랩', '미래 인터랙티브 주식회사', '가온 시스템스'],
    jobTitles: ['수석 개발자', '프로덕트 매니저', '플랫폼 아키텍트', '서비스 기획자', '데이터 엔지니어'],
    idLabel: '주민등록번호 (RRN)',
    generateId: (birthDate, gender) => {
      const year = birthDate.slice(2, 4);
      const month = birthDate.slice(5, 7);
      const day = birthDate.slice(8, 10);
      const g = gender === 'male' ? '1' : '2';
      const seq = Math.floor(Math.random() * 899999 + 100000);
      return `${year}${month}${day}-${g}${seq.toString().slice(1)}`;
    },
    generatePhone: () => {
      const mid = Math.floor(Math.random() * 8999 + 1000);
      const end = Math.floor(Math.random() * 8999 + 1000);
      return `+82 10-${mid}-${end}`;
    },
    formatAddress: ({ street, secondary, city, state, postalCode }) => {
      const streetPart = secondary ? `${street}, ${secondary}` : street;
      return {
        singleLine: `${state} ${city} ${streetPart} (우편번호: ${postalCode})`,
        mailingLabel: `${state} ${city}\n${streetPart}\n우편번호: ${postalCode}\n대한민국`
      };
    }
  },

  IN: {
    info: {
      code: 'IN',
      code3: 'IND',
      name: 'India',
      nativeName: 'भारत',
      flag: '🇮🇳',
      phonePrefix: '+91',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata'
    },
    states: [
      {
        name: 'Maharashtra',
        code: 'MH',
        cities: [
          { name: 'Mumbai', postalPrefix: '400', lat: 19.076, lng: 72.8777 },
          { name: 'Pune', postalPrefix: '411', lat: 18.5204, lng: 73.8567 }
        ]
      },
      {
        name: 'Karnataka',
        code: 'KA',
        cities: [
          { name: 'Bengaluru', postalPrefix: '560', lat: 12.9716, lng: 77.5946 },
          { name: 'Mysuru', postalPrefix: '570', lat: 12.2958, lng: 76.6394 }
        ]
      },
      {
        name: 'Delhi NCR',
        code: 'DL',
        cities: [
          { name: 'New Delhi', postalPrefix: '110', lat: 28.6139, lng: 77.209 },
          { name: 'Gurugram', postalPrefix: '122', lat: 28.4595, lng: 77.0266 },
          { name: 'Noida', postalPrefix: '201', lat: 28.5355, lng: 77.391 }
        ]
      },
      {
        name: 'Tamil Nadu',
        code: 'TN',
        cities: [
          { name: 'Chennai', postalPrefix: '600', lat: 13.0827, lng: 80.2707 }
        ]
      }
    ],
    maleFirstNames: ['Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Arjun', 'Kabir', 'Aryan', 'Ishaan', 'Dhruv', 'Sai', 'Karan', 'Dev', 'Pranav'],
    femaleFirstNames: ['Aanya', 'Diya', 'Ananya', 'Isha', 'Myra', 'Navya', 'Pooja', 'Priya', 'Aditi', 'Riya', 'Kavya', 'Saanvi'],
    lastNames: ['Sharma', 'Verma', 'Patel', 'Reddy', 'Singh', 'Kumar', 'Deshmukh', 'Iyer', 'Menon', 'Joshi', 'Gupta', 'Chopra', 'Rao', 'Nair'],
    streetNames: ['Mahatma Gandhi', 'Brigade', 'Indiranagar Main', 'Connaught', 'Marine Drive', 'Linking', 'Anna Salai', 'Ring', 'Outer Ring'],
    streetTypes: ['Road', 'Marg', 'Street', 'Lane', 'Nagar', 'Colony'],
    companies: ['Bharat Cloud Innovations', 'Deccan Analytics Labs', 'Indus Wave Infotech', 'Vedic Logic Technologies', 'Trident Cyber Solutions'],
    jobTitles: ['Technical Lead', 'Principal Architect', 'Full Stack Engineer', 'Product Manager', 'Data Engineering Lead'],
    idLabel: 'Aadhaar (Mock Format)',
    generateId: () => {
      const p1 = Math.floor(Math.random() * 8999 + 1000);
      const p2 = Math.floor(Math.random() * 8999 + 1000);
      const p3 = Math.floor(Math.random() * 8999 + 1000);
      return `${p1} ${p2} ${p3}`;
    },
    generatePhone: () => {
      const prefix = ['98', '99', '97', '91', '88', '70'][Math.floor(Math.random() * 6)];
      const num = Math.floor(Math.random() * 89999999 + 10000000);
      return `+91 ${prefix}${num.toString().slice(0, 3)} ${num.toString().slice(3, 8)}`;
    },
    formatAddress: ({ street, secondary, city, state, postalCode }) => {
      const line1 = secondary ? `${secondary}, ${street}` : street;
      return {
        singleLine: `${line1}, ${city}, ${state} - ${postalCode}, India`,
        mailingLabel: `${line1}\n${city}, ${state} - ${postalCode}\nIndia`
      };
    }
  },

  IT: {
    info: {
      code: 'IT',
      code3: 'ITA',
      name: 'Italy',
      nativeName: 'Italia',
      flag: '🇮🇹',
      phonePrefix: '+39',
      currency: 'EUR',
      currencySymbol: '€',
      timezone: 'Europe/Rome'
    },
    states: [
      {
        name: 'Lombardia',
        code: 'LOM',
        cities: [
          { name: 'Milano', postalPrefix: '201', lat: 45.4642, lng: 9.19 },
          { name: 'Bergamo', postalPrefix: '241', lat: 45.6983, lng: 9.6773 }
        ]
      },
      {
        name: 'Lazio',
        code: 'LAZ',
        cities: [
          { name: 'Roma', postalPrefix: '001', lat: 41.9028, lng: 12.4964 }
        ]
      },
      {
        name: 'Toscana',
        code: 'TOS',
        cities: [
          { name: 'Firenze', postalPrefix: '501', lat: 43.7696, lng: 11.2558 },
          { name: 'Pisa', postalPrefix: '561', lat: 43.7228, lng: 10.4017 }
        ]
      },
      {
        name: 'Campania',
        code: 'CAM',
        cities: [
          { name: 'Napoli', postalPrefix: '801', lat: 40.8518, lng: 14.2681 }
        ]
      }
    ],
    maleFirstNames: ['Leonardo', 'Francesco', 'Alessandro', 'Lorenzo', 'Mattia', 'Andrea', 'Gabriele', 'Matteo', 'Tommaso', 'Riccardo', 'Edoardo'],
    femaleFirstNames: ['Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia', 'Greta', 'Beatrice', 'Anna', 'Vittoria', 'Chiara'],
    lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca'],
    streetNames: ['Roma', 'Garibaldi', 'Matteotti', 'Cavour', 'Dante Alighieri', 'Mazzini', 'Vittorio Emanuele', 'Verdi', 'Marconi'],
    streetTypes: ['Via', 'Corso', 'Viale', 'Piazza', 'Largo'],
    companies: ['Milano Sistemi Digitali S.r.l.', 'Innovazione Adriatica SpA', 'Toscana Tech Labs', 'Aura Logica Italia', 'Mediterraneo Soluzioni'],
    jobTitles: ['Ingegnere del Software', 'Responsabile Tecnico', 'Product Designer', 'Consulente Direzionale', 'Data Strategist'],
    idLabel: 'Codice Fiscale',
    generateId: () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const c = (len: number) => Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
      const n = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 10).toString()).join('');
      return `${c(6)}${n(2)}${c(1)}${n(2)}${c(1)}${n(3)}${c(1)}`;
    },
    generatePhone: () => {
      const prefix = ['02', '06', '055', '347', '338'][Math.floor(Math.random() * 5)];
      const num = Math.floor(Math.random() * 8999999 + 1000000);
      return `+39 ${prefix} ${num}`;
    },
    formatAddress: ({ street, secondary, city, postalCode }) => {
      const line1 = secondary ? `${street}, ${secondary}` : street;
      return {
        singleLine: `${line1}, ${postalCode} ${city} (Italia)`,
        mailingLabel: `${line1}\n${postalCode} ${city}\nItalia`
      };
    }
  }
};
