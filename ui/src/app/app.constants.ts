import { FormControl } from '@angular/forms'

export enum EventType {
  LOG_IN_SUCCESS,
  AFFILIATION_CREATED,
  AFFILIATION_UPDATED,
  USER_LIST_MODIFIED,
  AFFILIATION_LIST_MODIFICATION,
  IMPORT_AFFILIATIONS,
  SEND_NOTIFICATIONS,
  MEMBER_LIST_MODIFICATION,
}

export enum AlertType {
  SEND_ACTIVATION_SUCCESS = 'Invite sent.',
  SEND_ACTIVATION_FAILURE = 'Invite email couldn`t be sent.',
  USER_CREATED = 'User created. Invite sent.',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',
  MEMBER_CREATED = 'Member created',
  MEMBER_UPDATED = 'Member updated successfully',
  NOTIFICATION_IN_PROGRESS = 'Notification in progress',
  AFFILIATION_CREATED = 'Affiliation created',
  AFFILIATION_UPDATED = 'Affiliation updated',
  AFFILIATION_DELETED = 'Affiliation deleted',
  AFFILIATION_DELETE_FAILURE = 'There was a problem deleting the affiliation',
}

export const EMAIL_NOT_FOUND_TYPE = 'https://www.jhipster.tech/problem/email-not-found'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'

export const ITEMS_PER_PAGE = 20

export function emailValidator(control: FormControl): { [key: string]: any } | null {
  const emailRegexp =
    // eslint-disable-next-line
    /^([^@\s/."'\(\)\[\]\{\}\\/,:;]+\.)*([^@\s\."\(\)\[\]\{\}\\/,:;]|(".+"))+@[^@\s\."'\(\)\[\]\{\}\\/,:;]+(\.[^@\s\."'\(\)\[\]\{\}\\/,:;]{2,})+$/
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true }
  }
  return null
}
const environment = window.location.hostname.replace('member-portal.', '').replace('.orcid.org', '')
export const ORCID_BASE_URL = environment + '.orcid.org'

// eslint-disable-next-line
export const EMAIL_REGEXP = /^([^@\s]|(".+"))+@([^@\s\."'\(\)\[\]\{\}\\/,:;]+\.)+([^@\s\."'\(\)\[\]\{\}\\/,:;]{2,})+$/
export const URL_REGEXP =
  // eslint-disable-next-line
  /^(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

export const AFFILIATION_TYPES = [
  'EDUCATION',
  'EMPLOYMENT',
  'QUALIFICATION',
  'INVITED_POSITION',
  'DISTINCTION',
  'MEMBERSHIP',
  'SERVICE',
]

export const ORG_ID_TYPES = ['RINGGOLD', 'GRID', 'ROR']

export const DEFAULT_EARLIEST_YEAR = 1913

export const DEFAULT_LATEST_YEAR_INCREMENT = 10

export const COUNTRIES = {
  Afghanistan: 'AF',
  'Åland Islands': 'AX',
  Albania: 'AL',
  Algeria: 'DZ',
  'American Samoa': 'AS',
  Andorra: 'AD',
  Angola: 'AO',
  Anguilla: 'AI',
  Antarctica: 'AQ',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Aruba: 'AW',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bermuda: 'BM',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  'Bouvet Island': 'BV',
  Brazil: 'BR',
  'British Antarctic Territory': 'BQ',
  'British Indian Ocean Territory': 'IO',
  'British Virgin Islands': 'VG',
  Brunei: 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Cape Verde': 'CV',
  'Cayman Islands': 'KY',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  'Christmas Island': 'CX',
  'Cocos {Keeling} Islands': 'CC',
  Colombia: 'CO',
  Comoros: 'KM',
  'Congo - Brazzaville': 'CG',
  'Congo - Kinshasa': 'CD',
  'Cook Islands': 'CK',
  'Costa Rica': 'CR',
  'Côte d’Ivoire': 'CI',
  Croatia: 'HR',
  Cuba: 'CU',
  Curaçao: 'CW',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Ethiopia: 'ET',
  'Falkland Islands': 'FK',
  'Faroe Islands': 'FO',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  'French Guiana': 'GF',
  'French Polynesia': 'PF',
  'French Southern Territories': 'TF',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Gibraltar: 'GI',
  Greece: 'GR',
  Greenland: 'GL',
  Grenada: 'GD',
  Guadeloupe: 'GP',
  Guam: 'GU',
  Guatemala: 'GT',
  Guernsey: 'GG',
  'Guinea-Bissau': 'GW',
  Guinea: 'GN',
  Guyana: 'GY',
  Haiti: 'HT',
  'Heard Island and McDonald Islands': 'HM',
  Honduras: 'HN',
  'Hong Kong SAR China': 'HK',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  'Isle of Man': 'IM',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jersey: 'JE',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  'Macau SAR China': 'MO',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Martinique: 'MQ',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mayotte: 'YT',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Montserrat: 'MS',
  Morocco: 'MA',
  Mozambique: 'MZ',
  'Myanmar {Burma}': 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Caledonia': 'NC',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  Niue: 'NU',
  'Norfolk Island': 'NF',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  'Northern Mariana Islands': 'MP',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  'Palestinian Territories': 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  'Pitcairn Islands': 'PN',
  Poland: 'PL',
  Portugal: 'PT',
  'Puerto Rico': 'PR',
  Qatar: 'QA',
  Réunion: 'RE',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  'Saint Barthélemy': 'BL',
  'Saint Helena': 'SH',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Martin': 'MF',
  'Saint Pierre and Miquelon': 'PM',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'São Tomé and Príncipe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  'Sint Maarten (Dutch Part)': 'SX',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Georgia and the South Sandwich Islands': 'GS',
  'South Korea': 'KR',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  'Svalbard and Jan Mayen': 'SJ',
  Swaziland: 'SZ',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tokelau: 'TK',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  'Turks and Caicos Islands': 'TC',
  Tuvalu: 'TV',
  'U.S. Minor Outlying Islands': 'UM',
  'U.S. Virgin Islands': 'VI',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  'Vatican City': 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  'Wallis and Futuna': 'WF',
  'Western Sahara': 'EH',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
}
