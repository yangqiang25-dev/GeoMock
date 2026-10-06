export type CountryCode =
  | 'US'
  | 'GB'
  | 'CN'
  | 'JP'
  | 'DE'
  | 'FR'
  | 'CA'
  | 'AU'
  | 'SG'
  | 'KR'
  | 'IN'
  | 'IT';

export type Gender = 'all' | 'male' | 'female';

export interface CountryInfo {
  code: CountryCode;
  code3: string;
  name: string;
  nativeName: string;
  flag: string;
  phonePrefix: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
}

export interface AddressData {
  id: string;
  timestamp: number;
  country: CountryCode;
  countryName: string;
  countryNameNative: string;
  flag: string;
  
  // Person
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  fullName: string;
  nativeFullName?: string;
  username: string;
  email: string;
  birthDate: string;
  age: number;
  
  // Address
  streetNumber: string;
  streetName: string;
  streetAddress: string;
  secondaryAddress: string; // Apt, Suite, Room
  fullStreetAddress: string;
  city: string;
  state: string;
  stateCode: string;
  isTaxFreeState?: boolean;
  postalCode: string;
  fullAddressSingleLine: string;
  fullMailingLabel: string;
  
  // Telecom
  phone: string;
  phonePrefix: string;
  
  // Geo
  latitude: number;
  longitude: number;
  
  // Identity & Mock Testing
  nationalIdName: string;
  nationalId: string;
  
  // Test Payment (Luhn verified)
  creditCardType: string;
  creditCardNumber: string;
  creditCardExp: string;
  creditCardCvv: string;
  
  // Work
  company: string;
  jobTitle: string;
}

export interface GeneratorOptions {
  country?: CountryCode;
  gender?: Gender;
  state?: string;
  taxFreeOnly?: boolean;
}
