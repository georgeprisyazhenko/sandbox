// Типы для работы с опционами MOEX

export interface Option {
  secid: string;
  underlyingAsset: string;
  strike: number;
  expirationDate: string;
  optionType: "Call" | "Put";
}

export interface OptionData {
  option: Option;
  bid: number | null;
  impliedVolatility: number | null;
  theoreticalPrice: number | null;
  lastUpdate: Date | null;
}

export interface WatchedOption extends OptionData {
  id: string;
}

export interface MOEXOptionResponse {
  secid: string;
  shortname: string;
  assetcode: string;
  strike: number;
  lastdeldate: string;
  optiontype: string;
}

export interface MOEXMarketData {
  BID: number | null;
  IMPLIEDVOLATILITY: number | null;
  THEORPRICE: number | null;
}
