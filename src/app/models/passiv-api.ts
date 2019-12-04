export class PassivTradeRequest {
  positions: PassivPosition[];
  balances: PassivBalance[];
  targets: PassivTarget[];
  buy_only: boolean;

  constructor(positions: PassivPosition[], balances: PassivBalance[],
    targets: PassivTarget[], buyOnly: boolean) {
    this.positions = positions;
    this.balances = balances;
    this.targets = targets;
    this.buy_only = buyOnly;
  }
}

export class PassivTradeResponse {
  trades: PassivTrade[];
}

export class PassivPosition {
  symbol: string;
  units: number;

  constructor(symbol: string, units: number) {
    this.symbol = symbol;
    this.units = units;
  }
}

export class PassivBalance {
  currency: string;
  amount: number;

  constructor(currency: string, amount: number) {
    this.currency = currency;
    this.amount = amount;
  }
}

export class PassivTarget {
  symbol: string;
  percent: number;

  constructor(symbol: string, percent: number) {
    this.symbol = symbol;
    this.percent = percent;
  }
}

export class PassivTrade {
  symbol: string;
  action: string;
  units: number;
  price: number;

  // constructor(symbol: string, action: string, units: number) {
  //     this.symbol = symbol;
  //     this.action = action;
  //     this.units = units;
  // }
}

export class PassivSymbolRequest {
  substring: string;

  constructor(symbol) {
    this.substring = symbol;
  }
}

export class PassivSymbolResponse {
  results: PassivSymbol[];
}

export class PassivSymbol {
  id: string;
  symbol: string;
  description: string;
  currency: PassivCurrency;

  static getCadSymbolFromWealthica(symbol: string, passivSymbols: PassivSymbol[]): string {
    let cadSymbol = null;
    passivSymbols.forEach(s => {
      if (s.symbol.toLowerCase() === symbol.toLowerCase() + '.to') {
        cadSymbol = s.symbol;
      } else if (s.symbol.toLowerCase() === symbol.toLowerCase() + '.vn') {
        cadSymbol = s.symbol;
      }
    });
    return cadSymbol;
  }
}

export class PassivCurrency {
  id: string;
  code: string;
  name: string;

  constructor(id: string, code: string, name: string) {
    this.id = id;
    this.code = code;
    this.name = name;
  }
}

export class PassivCurrencyRate {
  src: PassivCurrency;
  dst: PassivCurrency;
  exchange_rate: number;
}
