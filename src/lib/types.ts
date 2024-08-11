export interface CountryProps {
    id: number;
    name: string;
    iso3: string;
    iso2: string;
    numeric_code: string;
    phone_code: string;
    capital: string;
    currency: string;
    currency_name: string;
    currency_symbol: string;
    tld: string;
    native: string;
    region: string;
    region_id: string;
    subregion: string;
    subregion_id: string;
    nationality: string;
    timezones: Timezone[];
    translations: Record<string, string>;
    latitude: string;
    longitude: string;
    emoji: string;
    emojiU: string;
}

interface Timezone {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}

export interface StateProps {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    country_name: string;
    state_code: string;
    type: string | null;
    latitude: string;
    longitude: string;
}

export interface MessagePart {
    text: string;
}

export interface Message {
    role: "model" | "user";
    parts: MessagePart[];
}

export interface Payload {
    message: string;
    history: Message[];
}

export interface Country {
    value: string;
    label: string;
}

export interface UserSelection {
    value: string;
    label: string;
}

export interface CountryData {
    userCountryCode: string;
    countries: Country[];
    userSelectValue: UserSelection;
}