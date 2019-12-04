import { PortfolioTemplate } from './portfolio';

export class WealthicaPosition {
  id: string;
  _id: string;
  category: string;
  class: string;
  security: WealthicaSecurity;
  investments: WealthicaInvestment[];
  value: number;
  book_value: number;
  market_value: number;
  quantity: number;
  gain_percent: number;
  gain_currency_amount: number;
  currency: string;
  gain_amount: number;

  static isCadPosition(position: any) {
    try {
      if (position.currency.toLowerCase() === 'cad') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  static isUsdPosition(position: any) {
    try {
      if (position.currency.toLowerCase() === 'usd') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }
}

export class WealthicaSecurity {
  _id: number;
  id: number;
  currency: string;
  symbol: string;
  type: string;
  name: string;
  last_price: number;
  high_date: string;
  high_price: number;
  low_date: string;
  low_price: number;
  last_date: string;
  aliases: object[];

  static isCadSecurity(position: any) {
    try {
      if (position.security.currency.toLowerCase() === 'cad') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  static isUsdSecurity(position: any) {
    try {
      if (position.security.currency.toLowerCase() === 'usd') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }
}

export class WealthicaInvestment {
  name: string;
  _id: string;
  cash: number;
  currency: string;
  registered: boolean;
  value: number;
}

export class WealthicaInstitution {
  _id: string;
  user: StringConstructor;
  name: string;
  type: string;
  sync_status: string;
  __v: number;
  sync_date: string;
  sync_transactions: boolean;
  sync_documents: boolean;
  investments: object[];
  book_value: number;
  market_value: number;
  value: number;
  cash: number;
  creation_date: string;
  accounts: object;
  overall_roi: number;
  gain_percent: number;
  overall_gain: number;
  gain_amount: number;
  id: string;
}

export class WealthicaData {
  portfolios: PortfolioTemplate[];

  constructor(portfolios: PortfolioTemplate[]) {
    this.portfolios = portfolios;
  }
}
