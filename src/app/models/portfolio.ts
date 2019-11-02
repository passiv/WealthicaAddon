import { PassivSymbol } from './passiv-api';

export enum PortfolioType {
    CanadianEquity,
    // AmericanEquity,
    CanadianGrowth,
    // AmericanGrowth,
    CanadianBalanced,
    // AmericanBalanced,
    CanadianConservative,
    // AmericanConservative
}

export class PortfolioComponent {
    symbol: string;
    percentOfPortfolio: number;
    displayPercent: number;
    price: string;
    priceUpToDate = false;
    sharesOwned: number;
    isCanadianTicker: boolean;
    adjustmentUnits: number;
    adjustmentAction: string;
    suggestedSymbols: PassivSymbol[] = [];

    constructor(symbol: string, percentOfPortfolio: number, isCanadianTicker = true) {
        this.symbol = symbol;
        this.percentOfPortfolio = percentOfPortfolio;
        this.displayPercent = percentOfPortfolio * 100;
        this.isCanadianTicker = isCanadianTicker;
        this.sharesOwned = 0;
    }

    getPrice(): string {
        return parseFloat(this.price).toFixed(2);
    }

    isSellAction(): boolean {
        if (this.adjustmentAction !== undefined && this.adjustmentAction !== null && this.adjustmentUnits !== 0) {
            return this.adjustmentAction.toLowerCase() === 'sell';
        }
        return false;

    }

    isBuyAction(): boolean {
        if (this.adjustmentAction !== undefined && this.adjustmentAction !== null && this.adjustmentUnits !== 0) {
            return this.adjustmentAction.toLowerCase() === 'buy';
        }
        return false;
    }
}

export class PortfolioTemplate {
    components: PortfolioComponent[];
    portfolioType: PortfolioType;
    portfolioName: string;
    id: string;

    constructor(portfolioType = null, addSharesOwned = false) {
        if (portfolioType != null) {
            this.setPortfolioTemplate(portfolioType, addSharesOwned);
        } else {
            this.components = [];
        }
        this.id = this.newGuid();
    }

    loadPortfolioData(portfolio: PortfolioTemplate) {
        this.components = [];
        portfolio.components.forEach(component => {
            const c = new PortfolioComponent(component.symbol, component.percentOfPortfolio);
            c.percentOfPortfolio = component.percentOfPortfolio;
            this.components.push(c);
        });
    }

    setPortfolioTemplate(portfolioType: PortfolioType, addSharesOwned = false) {
        this.portfolioType = portfolioType;
        this.components = [];

        switch (portfolioType) {
            case PortfolioType.CanadianEquity: {
                this.portfolioName = 'Canadian Equity';
                const vcn = new PortfolioComponent('VCN', 0.33);
                const xuu = new PortfolioComponent('XUU', 0.38);
                const xef = new PortfolioComponent('XEF', 0.21);
                const xec = new PortfolioComponent('XEC', 0.08);
                if (addSharesOwned) {
                    vcn.sharesOwned = 131;
                    xuu.sharesOwned = 159;
                    xef.sharesOwned = 101;
                    xec.sharesOwned = 48;
                }
                this.components.push(vcn, xuu, xef, xec);
                break;
            }
            case PortfolioType.CanadianGrowth: {
                this.portfolioName = 'Canadian Growth';
                const vcn = new PortfolioComponent('VCN', 0.27);
                const xuu = new PortfolioComponent('XUU', 0.3);
                const xef = new PortfolioComponent('XEF', 0.167);
                const xec = new PortfolioComponent('XEC', 0.063);
                const zag = new PortfolioComponent('ZAG', 0.2);
                if (addSharesOwned) {
                    vcn.sharesOwned = 125;
                    xuu.sharesOwned = 164;
                    xef.sharesOwned = 99;
                    xec.sharesOwned = 44;
                    zag.sharesOwned = 203;
                }
                this.components.push(vcn, xuu, xef, xec, zag);
                break;
            }
            case PortfolioType.CanadianBalanced: {
                this.portfolioName = 'Canadian Balanced';
                const vcn = new PortfolioComponent('VCN', 0.2);
                const xuu = new PortfolioComponent('XUU', 0.226);
                const xef = new PortfolioComponent('XEF', 0.126);
                const xec = new PortfolioComponent('XEC', 0.048);
                const zag = new PortfolioComponent('ZAG', 0.4);
                if (addSharesOwned) {
                    vcn.sharesOwned = 142;
                    xuu.sharesOwned = 188;
                    xef.sharesOwned = 111;
                    xec.sharesOwned = 50;
                    zag.sharesOwned = 580;
                }
                this.components.push(vcn, xuu, xef, xec, zag);
                break;
            }
            case PortfolioType.CanadianConservative: {
                this.portfolioName = 'Canadian Conservative';
                const vcn = new PortfolioComponent('VCN', 0.13);
                const xuu = new PortfolioComponent('XUU', 0.153);
                const xef = new PortfolioComponent('XEF', 0.085);
                const xec = new PortfolioComponent('XEC', 0.032);
                const zag = new PortfolioComponent('ZAG', 0.6);
                if (addSharesOwned) {
                    vcn.sharesOwned = 134;
                    xuu.sharesOwned = 153;
                    xef.sharesOwned = 97;
                    xec.sharesOwned = 38;
                    zag.sharesOwned = 1130;
                }
                this.components.push(vcn, xuu, xef, xec, zag);
                break;
            }
            /*
            case PortfolioType.AmericanEquity: {
                this.portfolioName = 'American Equity';
                const vti = new PortfolioComponent('VTI', 0.75, false);
                const vgtsx = new PortfolioComponent('VGTSX', 0.25, false);
                this.components.push(vti, vgtsx);
                break;
            }
            case PortfolioType.AmericanGrowth: {
                this.portfolioName = 'American Growth';
                const vti = new PortfolioComponent('VTI', 0.64, false);
                const vgtsx = new PortfolioComponent('VGTSX', 0.16, false);
                const bnd = new PortfolioComponent('BND', 0.2, false);
                this.components.push(vti, vgtsx, bnd);
                break;
            }
            case PortfolioType.AmericanBalanced: {
                this.portfolioName = 'American Balanced';
                const vti = new PortfolioComponent('VTI', 0.45, false);
                const vgtsx = new PortfolioComponent('VGTSX', 0.15, false);
                const bnd = new PortfolioComponent('BND', 0.4, false);
                this.components.push(vti, vgtsx, bnd);
                break;
            }
            case PortfolioType.AmericanConservative: {
                this.portfolioName = 'American Conservative';
                const vti = new PortfolioComponent('VTI', 0.3, false);
                const vgtsx = new PortfolioComponent('VGTSX', 0.1, false);
                const bnd = new PortfolioComponent('BND', 0.6, false);
                this.components.push(vti, vgtsx, bnd);
                break;
            }*/
        }
    }

    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}
