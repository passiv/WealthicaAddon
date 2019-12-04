import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PortfolioTemplate, PortfolioComponent, PassivPosition, PassivTarget, PassivCurrency, PassivBalance, PassivTradeRequest, PassivTradeResponse, PassivTrade, WealthicaPosition, PassivSymbol, PassivSymbolRequest, WealthicaSecurity } from '../../models';
import { WidgetView } from '../widget-view';
import { PassivService } from 'src/app/services/passiv.service';

@Component({
  selector: 'app-trades-needed',
  templateUrl: './trades-needed.component.html',
  styleUrls: ['./trades-needed.component.scss']
})
export class TradesNeededComponent implements OnInit {
  portfolio: PortfolioTemplate;
  positions: WealthicaPosition[];
  currentView: WidgetView;
  cashCAD = 0;
  cashUSD = 0;
  cashOther = 0;
  buyOnly = false;
  loading = false;
  areSellActions = false;
  areBuyActions = false;

  @Output() switchView: EventEmitter<WidgetView> = new EventEmitter();

  constructor(private passivService: PassivService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

  }

  adjustmentNeeded(component: PortfolioComponent): string {
    if (component !== null) {
      const correctShares = (component.percentOfPortfolio * this.totalPortfolioValue()) / parseFloat(component.price);
      const adjustment = Math.round(correctShares - component.sharesOwned);
      if (adjustment < 0) {
        return adjustment.toString();
      } else {
        return '+' + adjustment;
      }
    } else {
      return '---';
    }
  }

  totalPortfolioValue() {
    let totalValue = 0;
    this.portfolio.components.forEach(component => {
      totalValue += parseFloat(component.price) * component.sharesOwned;
    });
    return totalValue;
  }

  buyOnlyToggle() {
    this.buyOnly = !this.buyOnly;
    this.refreshTradesNeeded();
  }

  checkAreSellActions() {
    if (this.portfolio === null || this.portfolio === undefined) {
      return false;
    }
    let result = false;
    this.portfolio.components.forEach(component => {
      if (component.isSellAction()) {
        result = true;
      }
    });
    return result;
  }

  checkAreBuyActions() {
    if (this.portfolio === null || this.portfolio === undefined) {
      return false;
    }
    let result = false;
    this.portfolio.components.forEach(component => {
      if (component.isBuyAction()) {
        result = true;
      }
    });
    return result;
  }

  refreshTradesNeeded() {
    this.resetActionBooleans();
    this.loading = true;
    // Needed to update loading variable when accounts are filtered
    this.cdr.detectChanges();
    this.portfolio.components.forEach(component => {
      component.adjustmentUnits = 0;
    });
    if (this.portfolio !== null) {
      const balances: PassivBalance[] = [];
      const targets: PassivTarget[] = [];
      this.setPositions().then(positions => {
        console.log('pos:');
        console.log(positions);
        this.portfolio.components.forEach(component => {
          targets.push(new PassivTarget(component.symbol, component.percentOfPortfolio * 100));
        });
        balances.push(new PassivBalance('cad', this.cashCAD));
        balances.push(new PassivBalance('usd', this.cashUSD));
        console.log(new PassivTradeRequest(positions, balances, targets, this.buyOnly));
        this.passivService.getTrades(new PassivTradeRequest(positions, balances, targets, this.buyOnly))
          .subscribe(tradeResponse => {
            console.log(tradeResponse);
            (tradeResponse as PassivTrade[]).forEach(trade => {
              this.portfolio.components.forEach(component => {
                if (trade.symbol === component.symbol) {
                  if (trade.price !== null) {
                    component.price = trade.price.toString();
                  } else {
                    component.price = '';
                  }
                  component.adjustmentUnits = trade.units;
                  component.adjustmentAction = trade.action;
                }
              });
            });
            this.setActionBooleans();
            this.loading = false;
            this.cdr.detectChanges();
          });
      });
    }
  }

  resetActionBooleans() {
    this.areSellActions = false;
    this.areBuyActions = false;
  }

  setPositions(): Promise<PassivPosition[]> {
    const positionPromise = new Promise(resolve => {
      const positions = [] as PassivPosition[];
      const promises = [];
      let count = 1;

      this.positions.forEach(position => {

        if (WealthicaPosition.isCadPosition(position)) {
          const request = new PassivSymbolRequest(position.security.symbol);
          promises.push(this.passivService.search(request).subscribe(response => {
            let symbol = position.security.symbol;
            if (WealthicaSecurity.isCadSecurity(position)) {
              const cadSymbol = PassivSymbol.getCadSymbolFromWealthica(symbol, response as PassivSymbol[]);
              if (cadSymbol !== null) {
                symbol = cadSymbol;
              }
            }
            const passivPosition = new PassivPosition(symbol, position.quantity);
            positions.push(passivPosition);
            count++;
            if (count === this.positions.length) {
              resolve(positions);
            }
          }));
        }
      });
    });
    return positionPromise as Promise<PassivPosition[]>;
  }

  isCadSecurity(position: any) {
    try {
      if (position.security.currency.toLowerCase() === 'cad') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  isUsdSecurity(position: any) {
    try {
      if (position.security.currency.toLowerCase() === 'usd') {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  setActionBooleans() {
    this.areSellActions = this.checkAreSellActions();
    this.areBuyActions = this.checkAreBuyActions();
  }

  portfolioDetails() {
    this.switchView.emit(WidgetView.PortfolioDetails);
  }

}
