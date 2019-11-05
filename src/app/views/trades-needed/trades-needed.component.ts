import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { PortfolioTemplate, PortfolioComponent, PassivPosition, PassivTarget, PassivCurrency, PassivBalance, PassivTradeRequest, PassivTradeResponse, PassivTrade } from '../../models';
import { WidgetView } from '../widget-view';
import { PassivService } from 'src/app/services/passiv.service';

@Component({
  selector: 'app-trades-needed',
  templateUrl: './trades-needed.component.html',
  styleUrls: ['./trades-needed.component.scss']
})
export class TradesNeededComponent implements OnInit {

  portfolio: PortfolioTemplate;
  currentView: WidgetView;
  cashCAD = 0;
  cashUSD = 0;
  cashOther = 0;
  buyOnly = false;
  specificCashCAD = 0;
  specificCashUSD = 0;
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
      console.log(this.portfolio);
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
      const positions: PassivPosition[] = [];
      const balances: PassivBalance[] = [];
      const targets: PassivTarget[] = [];
      this.portfolio.components.forEach(component => {
        positions.push(new PassivPosition(component.symbol, component.sharesOwned));
        targets.push(new PassivTarget(component.symbol, component.percentOfPortfolio * 100));
      });
      if (this.specificCashCAD + this.specificCashUSD === 0) {
        balances.push(new PassivBalance('cad', this.cashCAD));
        balances.push(new PassivBalance('usd', this.cashUSD));
      } else {
        balances.push(new PassivBalance('cad', this.specificCashCAD));
        balances.push(new PassivBalance('usd', this.specificCashUSD));

      }
      this.passivService.getTrades(new PassivTradeRequest(positions, balances, targets, this.buyOnly))
      .subscribe(tradeResponse => {
        (tradeResponse as PassivTrade[]).forEach(trade => {
          this.portfolio.components.forEach(component => {
            if (trade.symbol === component.symbol) {
              component.price = trade.price.toString();
              component.adjustmentUnits = trade.units;
              component.adjustmentAction = trade.action;
            }
          });
        });
        this.setActionBooleans();
        this.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  resetActionBooleans() {
    this.areSellActions = false;
    this.areBuyActions = false;
  }

  setActionBooleans() {
    this.areSellActions = this.checkAreSellActions();
    this.areBuyActions = this.checkAreBuyActions();
  }

  portfolioDetails() {
    this.switchView.emit(WidgetView.PortfolioDetails);
  }

}
