import { COUNTRIES, generateLuhnCard } from '../data/countries';
import { AddressData, CountryCode, GeneratorOptions } from '../types/address';

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateAddress(options: GeneratorOptions = {}): AddressData {
  const countryCodes = Object.keys(COUNTRIES) as CountryCode[];
  const countryCode = options.country && COUNTRIES[options.country]
    ? options.country
    : getRandomElement(countryCodes);

  const country = COUNTRIES[countryCode];

  // Gender
  let gender: 'male' | 'female';
  if (options.gender === 'male' || options.gender === 'female') {
    gender = options.gender;
  } else {
    gender = Math.random() > 0.5 ? 'male' : 'female';
  }

  // Name
  const firstName = gender === 'male'
    ? getRandomElement(country.maleFirstNames)
    : getRandomElement(country.femaleFirstNames);
  const lastName = getRandomElement(country.lastNames);

  let fullName = `${firstName} ${lastName}`;
  let nativeFullName: string | undefined = undefined;

  // In East Asian countries (CN, JP, KR), surname comes first
  if (countryCode === 'CN' || countryCode === 'JP' || countryCode === 'KR') {
    nativeFullName = `${lastName}${firstName}`;
    fullName = `${lastName} ${firstName}`;
  }

  // State & City
  let candidateStates = country.states;
  if (countryCode === 'US' && options.taxFreeOnly) {
    const taxFreeStates = country.states.filter((s) => s.isTaxFree);
    if (taxFreeStates.length > 0) {
      candidateStates = taxFreeStates;
    }
  }

  let state = candidateStates[0];
  if (options.state) {
    if (options.state === 'TAX_FREE_RANDOM' || options.state === '__TAX_FREE__') {
      const taxFreeStates = country.states.filter((s) => s.isTaxFree);
      state = taxFreeStates.length > 0 ? getRandomElement(taxFreeStates) : getRandomElement(candidateStates);
    } else {
      const foundState = candidateStates.find(
        (s) => s.name === options.state || s.code === options.state
      );
      if (foundState) {
        state = foundState;
      } else {
        // Fallback to searching all states
        const anyState = country.states.find(
          (s) => s.name === options.state || s.code === options.state
        );
        if (anyState) state = anyState;
      }
    }
  } else {
    state = getRandomElement(candidateStates);
  }

  const cityObj = getRandomElement(state.cities);

  // Postal Code formatting
  let postalCode = '';
  switch (countryCode) {
    case 'US':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(10, 99).toString().padStart(2, '0')}`;
      break;
    case 'GB':
      postalCode = `${cityObj.postalPrefix} ${getRandomNumber(1, 9)}${getRandomElement(['A', 'B', 'D', 'E', 'G', 'H', 'J', 'N', 'P', 'R', 'T', 'W', 'X', 'Y', 'Z'])}${getRandomElement(['A', 'B', 'D', 'E', 'G', 'H', 'J', 'N', 'P', 'R', 'T', 'W', 'X', 'Y', 'Z'])}`;
      break;
    case 'CN':
      postalCode = cityObj.postalPrefix;
      break;
    case 'JP':
      postalCode = `${cityObj.postalPrefix}-${getRandomNumber(1000, 9999)}`;
      break;
    case 'DE':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(10, 99).toString().padStart(2, '0')}`;
      break;
    case 'FR':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(10, 99).toString().padStart(2, '0')}`;
      break;
    case 'CA': {
      const letters = 'ABCEGHJKLMNPRSTVXY';
      const c1 = getRandomElement(letters.split(''));
      const n1 = getRandomNumber(0, 9);
      const c2 = getRandomElement(letters.split(''));
      postalCode = `${cityObj.postalPrefix}${c1} ${n1}${c2}${getRandomNumber(0, 9)}`;
      break;
    }
    case 'AU':
      postalCode = `${cityObj.postalPrefix}`;
      break;
    case 'SG':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(1000, 9999)}`;
      break;
    case 'KR':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(100, 999)}`;
      break;
    case 'IN':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(100, 999)}`;
      break;
    case 'IT':
      postalCode = `${cityObj.postalPrefix}${getRandomNumber(10, 99).toString().padStart(2, '0')}`;
      break;
    default:
      postalCode = getRandomNumber(10000, 99999).toString();
  }

  // Street address
  const streetNumber = getRandomNumber(12, 1899).toString();
  const streetNameBase = getRandomElement(country.streetNames);
  const streetType = getRandomElement(country.streetTypes);

  let streetAddress = '';
  let secondaryAddress = '';

  if (countryCode === 'US' || countryCode === 'CA' || countryCode === 'AU' || countryCode === 'GB') {
    streetAddress = `${streetNumber} ${streetNameBase} ${streetType}`;
    if (Math.random() > 0.4) {
      const secondaryType = getRandomElement(['Apt', 'Suite', 'Unit', 'Fl']);
      secondaryAddress = `${secondaryType} ${getRandomNumber(1, 400)}`;
    }
  } else if (countryCode === 'DE') {
    streetAddress = `${streetNameBase}${streetType} ${streetNumber}`;
    if (Math.random() > 0.5) {
      secondaryAddress = `Wohnung ${getRandomNumber(1, 24)}`;
    }
  } else if (countryCode === 'FR') {
    streetAddress = `${streetNumber} ${streetType} ${streetNameBase}`;
    if (Math.random() > 0.5) {
      secondaryAddress = `Bâtiment ${getRandomElement(['A', 'B', 'C'])}, Apt ${getRandomNumber(1, 40)}`;
    }
  } else if (countryCode === 'CN') {
    streetAddress = `${streetNameBase}${streetType}${streetNumber}号`;
    secondaryAddress = `${getRandomNumber(1, 18)}号楼${getRandomNumber(101, 1604)}室`;
  } else if (countryCode === 'JP') {
    const chome = getRandomNumber(1, 5);
    const banchi = getRandomNumber(1, 28);
    const go = getRandomNumber(1, 18);
    streetAddress = `${streetNameBase}${chome}丁目${banchi}-${go}`;
    secondaryAddress = `グランドヒルズ ${getRandomNumber(101, 808)}号室`;
  } else if (countryCode === 'KR') {
    streetAddress = `${streetNameBase} ${streetNumber}${streetType}`;
    secondaryAddress = `${getRandomNumber(101, 1204)}호`;
  } else {
    streetAddress = `${streetNumber} ${streetNameBase} ${streetType}`;
    if (Math.random() > 0.5) {
      secondaryAddress = `Unit ${getRandomNumber(1, 100)}`;
    }
  }

  const fullStreetAddress = secondaryAddress
    ? `${streetAddress}, ${secondaryAddress}`
    : streetAddress;

  // Age & Birthday (19-65)
  const age = getRandomNumber(19, 65);
  const birthYear = new Date().getFullYear() - age;
  const birthMonth = getRandomNumber(1, 12).toString().padStart(2, '0');
  const birthDay = getRandomNumber(1, 28).toString().padStart(2, '0');
  const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

  // Email and username
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const userNum = getRandomNumber(10, 999);
  const emailDomain = getRandomElement([
    'gmail-mock.com',
    'outlook-test.com',
    'icloud-mock.net',
    'example.org',
    'mail-tester.io'
  ]);
  const username = `${cleanFirst || 'user'}_${cleanLast || 'dev'}${userNum}`;
  const email = `${cleanFirst || 'test'}.${cleanLast || 'user'}${userNum}@${emailDomain}`;

  // Geo coords (with slight local variance)
  const latJitter = (Math.random() - 0.5) * 0.02;
  const lngJitter = (Math.random() - 0.5) * 0.02;
  const latitude = parseFloat((cityObj.lat + latJitter).toFixed(6));
  const longitude = parseFloat((cityObj.lng + lngJitter).toFixed(6));

  // Phone
  const phone = country.generatePhone(state.code);

  // Formatted representations
  const formatted = country.formatAddress({
    street: streetAddress,
    secondary: secondaryAddress,
    city: cityObj.name,
    state: state.name,
    stateCode: state.code,
    postalCode,
    country: country.info.name
  });

  // National ID
  const nationalId = country.generateId(birthDate, gender);

  // Luhn Test Credit Card
  const cardType = getRandomElement(['Visa', 'MasterCard', 'American Express']);
  let cardPrefix = '4532';
  let cardLen = 16;
  if (cardType === 'MasterCard') {
    cardPrefix = '5425';
  } else if (cardType === 'American Express') {
    cardPrefix = '3782';
    cardLen = 15;
  }
  const creditCardNumber = generateLuhnCard(cardPrefix, cardLen);
  const expMonth = getRandomNumber(1, 12).toString().padStart(2, '0');
  const expYear = (new Date().getFullYear() + getRandomNumber(2, 5)).toString().slice(-2);
  const creditCardExp = `${expMonth}/${expYear}`;
  const creditCardCvv = getRandomNumber(100, 999).toString();

  // Work
  const company = getRandomElement(country.companies);
  const jobTitle = getRandomElement(country.jobTitles);

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
    country: countryCode,
    countryName: country.info.name,
    countryNameNative: country.info.nativeName,
    flag: country.info.flag,
    gender,
    firstName,
    lastName,
    fullName,
    nativeFullName,
    username,
    email,
    birthDate,
    age,
    streetNumber,
    streetName: streetNameBase,
    streetAddress,
    secondaryAddress,
    fullStreetAddress,
    city: cityObj.name,
    state: state.name,
    stateCode: state.code,
    isTaxFreeState: Boolean(state.isTaxFree),
    postalCode,
    fullAddressSingleLine: formatted.singleLine,
    fullMailingLabel: formatted.mailingLabel,
    phone,
    phonePrefix: country.info.phonePrefix,
    latitude,
    longitude,
    nationalIdName: country.idLabel,
    nationalId,
    creditCardType: cardType,
    creditCardNumber,
    creditCardExp,
    creditCardCvv,
    company,
    jobTitle
  };
}

export function generateBatchAddresses(
  count: number,
  options: GeneratorOptions = {}
): AddressData[] {
  const result: AddressData[] = [];
  const safeCount = Math.min(Math.max(1, count), 100);
  for (let i = 0; i < safeCount; i++) {
    result.push(generateAddress(options));
  }
  return result;
}
