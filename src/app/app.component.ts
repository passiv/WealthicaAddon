import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PortfolioOverviewComponent, EditPortfolioComponent, PortfolioDetailsComponent, TradesNeededComponent, WidgetView } from './views';
import { PortfolioTemplate, PortfolioComponent, WealthicaPosition, WealthicaInvestment, WealthicaData, WealthicaInstitution, PassivSymbol, PassivSymbolRequest, PassivCurrencyRate, WealthicaSecurity } from './models';
import * as wealth from '@wealthica/wealthica.js';
import { PassivService } from './services/passiv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './header.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  currentView = WidgetView.SplashPage;
  portfolio: PortfolioTemplate;
  cadToUsd = 0;

  addon = new wealth.Addon({
    // (optional) The 'id' of the add-on / widget.
    // This is only required in the add-on release preparation process.
    // For add-on development with the Developer Add-on, this should not be set.
    // id: 'addon-id' | 'addon-id/widgets/widget-id'
  });
  addonOptions;
  positions: WealthicaPosition[] = null;

  @ViewChild(PortfolioOverviewComponent, { static: false })
  portfolioOverviewComponent: PortfolioOverviewComponent;
  @ViewChild(EditPortfolioComponent, { static: false })
  editPortfolioComponent: EditPortfolioComponent;
  @ViewChild(PortfolioDetailsComponent, { static: false })
  portfolioDetailsComponent: PortfolioDetailsComponent;
  @ViewChild(TradesNeededComponent, { static: false })
  tradesNeededComponent: TradesNeededComponent;

  constructor(private cdr: ChangeDetectorRef, private passivService: PassivService) { }

  ngOnInit() {
    this.initializeWealthicaAddon();
    this.setCadUsdExchangeRate();
  }

  ngAfterViewInit() {
    this.initializeViews();
    this.cdr.detectChanges();
  }

  initializeWealthicaAddon() {
    this.addon.on('init', (options) => {
      this.refreshWealthicaData(options, false);
    });

    this.addon.on('update', (options) => {
      console.log('update');
      this.clearData();
      if (this.currentView !== WidgetView.PortfolioOverview) {
        this.refreshWealthicaData(options);
      } else {
        this.refreshWealthicaData(options, false);
      }
    });

    this.addon.on('reload', (options) => {
      console.log('reload');
      this.clearData();
      if (this.currentView !== WidgetView.PortfolioOverview) {
        this.refreshWealthicaData(options);
      } else {
        this.refreshWealthicaData(options, false);
      }
    });
  }

  refreshWealthicaData(options: object, refreshTrades=true) {
    // {
    //   fromDate: '2018-01-01',
    //   toDate: '2018-04-30',
    //   language: 'en',
    //   privateMode: false,
    //   data: { portfolios: [, , ] },
    //   ...
    // }
    this.addonOptions = options;
    this.loadFromWealthica();
    const promises = [];
    promises.push(this.addon.api.getPositions(this.getQueryFromOptions(options)).then(response => {
      this.positions = response as WealthicaPosition[];
      this.updateSharesOwned();
    }).catch((err) => {
      console.log('Error:<br><code>' + err + '</code>');
    }));
    promises.push(this.addon.api.getInstitutions(this.getQueryFromOptions(options)).then(response => {
      const institutions = (response as WealthicaInstitution[]);
      this.setCash(institutions);
    }).catch((err) => {
      console.log('Error:<br><code>' + err + '</code>');
    }));
    Promise.all(promises).then(() => {
      this.tradesNeededComponent.positions = this.positions;
      if (refreshTrades) {
        this.tradesNeededComponent.refreshTradesNeeded();
      }
    });
  }

  clearData() {
    this.tradesNeededComponent.cashCAD = 0;
    this.tradesNeededComponent.cashUSD = 0;
    this.tradesNeededComponent.positions = [];
  }

  saveToWealthica() {
    const wealicaData = { portfolios: this.portfolioOverviewComponent.portfolios };
    this.addon.saveData(wealicaData).then(() => {
    });
  }

  loadFromWealthica() {
    if (this.addonOptions !== null && this.addonOptions.data !== undefined && this.addonOptions.data as WealthicaData !== null) {
      this.portfolioOverviewComponent.portfolios = [];
      (this.addonOptions.data as WealthicaData).portfolios.forEach(portfolio => {
        const p = new PortfolioTemplate();
        p.portfolioName = portfolio.portfolioName;
        p.id = portfolio.id;
        p.loadPortfolioData(portfolio);
        this.portfolioOverviewComponent.portfolios.push(p);
      });
      this.portfolioOverviewComponent.portfolio = this.portfolioOverviewComponent.portfolios[0];
    } else {
      this.portfolioOverviewComponent.portfolios = [];
      const portfolio = new PortfolioTemplate();
      portfolio.portfolioName = 'New Portfolio';
      this.portfolioOverviewComponent.portfolios.push(portfolio);
      this.portfolioOverviewComponent.portfolio = portfolio;
    }
    if (this.portfolio === null || this.portfolio === undefined) {
      this.syncPortfolios(this.portfolioOverviewComponent.portfolio);
    }
  }

  setCash(institutions: WealthicaInstitution[]) {
    institutions.forEach(institution => {
      if (this.institutionIsSelected(institution.id)) {
        institution.investments.forEach((investment: WealthicaInvestment) => {
          if (this.investmentIsSelected(investment._id)) {
            if (investment.currency === 'cad') {
              this.tradesNeededComponent.cashCAD += investment.cash;
            } else if (investment.currency === 'usd') {
              this.tradesNeededComponent.cashUSD += investment.cash;
            } else {
              this.tradesNeededComponent.cashOther += investment.cash;
            }
          }
        });
      }
    });
  }

  updateSharesOwned() {
    if (this.positions !== null) {
      this.portfolio.components.forEach(component => {
        component.sharesOwned = 0;
        this.positions.forEach(position => {
          if (position.security.currency.toLowerCase() === 'cad') {
            if (component.symbol === position.security.symbol + '.TO') {
              component.sharesOwned = position.quantity;
            } else if (component.symbol === position.security.symbol + '.VN') {
              component.sharesOwned = position.quantity;
            } else if (component.symbol === position.security.symbol + '.CN') {
              component.sharesOwned = position.quantity;
            }
          } else if (component.symbol === position.security.symbol) {
            component.sharesOwned = position.quantity;
          }
        });
      });
    }
  }

  investmentIsSelected(id: string): boolean {
    if (this.addonOptions.investmentsFilter === null
      || this.addonOptions.investmentsFilter === 'all'
      || (this.addonOptions.investmentsFilter as string).includes(id)) {
      return true;
    }
    return false;
  }

  institutionIsSelected(id: string): boolean {
    if (this.addonOptions.institutionsFilter === null
      || (this.addonOptions.institutionsFilter as string).includes(id)) {
      return true;
    }
    return false;
  }

  onPortfolioSave(portfolio: PortfolioTemplate) {
    this.syncPortfolios(portfolio);
    this.saveToWealthica();
  }

  onEditCancel(restoredPortfolio: PortfolioTemplate) {
    if (restoredPortfolio === null) {
      this.loadFromWealthica();
    } else {
      this.syncPortfolios(restoredPortfolio);
    }
  }

  getQueryFromOptions(options): any {
    return {
      from: options.dateRangeFilter && options.dateRangeFilter[0],
      to: options.dateRangeFilter && options.dateRangeFilter[1],
      groups: options.groupsFilter,
      institutions: options.institutionsFilter,
      investments: options.investmentsFilter === 'all' ? null : options.investmentsFilter,
    };
  }

  syncPortfolios(portfolio: PortfolioTemplate, afterDelete = false) {
    this.portfolio = portfolio;
    this.editPortfolioComponent.updatePortfolio(this.portfolio);
    this.editPortfolioComponent.saveState = JSON.parse(JSON.stringify(portfolio)) as PortfolioTemplate;
    this.portfolioDetailsComponent.portfolio = this.portfolio;
    this.portfolioDetailsComponent.updatePiechart();
    this.tradesNeededComponent.portfolio = this.portfolio;
    if (!afterDelete) {
      this.updateSharesOwned();
      this.updateOrAddPortfolio(portfolio);
    }
  }

  updateOrAddPortfolio(portfolio: PortfolioTemplate) {
    let updated = false;
    this.portfolioOverviewComponent.portfolios.forEach(p => {
      if (portfolio.id === p.id) {
        p = portfolio;
        updated = true;
      }
    });
    if (!updated) {
      this.portfolioOverviewComponent.portfolios.push(portfolio);
    }
  }

  switchView(view: WidgetView) {
    this.updateCurrentView(view);
  }

  updateCurrentView(view: WidgetView) {
    this.currentView = view;
    this.portfolioDetailsComponent.currentView = view;
    this.portfolioOverviewComponent.currentView = view;
    this.editPortfolioComponent.currentView = view;
    this.tradesNeededComponent.currentView = view;
  }

  splashView() {
    return this.currentView === WidgetView.SplashPage;
  }
  overviewView() {
    return this.currentView === WidgetView.PortfolioOverview;
  }
  editView() {
    return this.currentView === WidgetView.EditPortfolio;
  }
  detailsView() {
    return this.currentView === WidgetView.PortfolioDetails;
  }
  tradesView() {
    return this.currentView === WidgetView.TradesNeeded;
  }

  initializeViews() {
    this.editPortfolioComponent.currentView = this.currentView;
    this.portfolioDetailsComponent.currentView = this.currentView;
    this.portfolioOverviewComponent.currentView = this.currentView;
    this.tradesNeededComponent.currentView = this.currentView;
  }

  onSwitchPortfolio(portfolio: PortfolioTemplate) {
    this.syncPortfolios(portfolio);
  }

  onDeletePortfolio(portfolio: PortfolioTemplate) {
    const indexToDelete = this.portfolioOverviewComponent.portfolios.indexOf(portfolio);
    this.portfolioOverviewComponent.portfolios.splice(indexToDelete, 1);
    this.saveToWealthica();
    this.syncPortfolios(new PortfolioTemplate(), true);
    this.switchView(WidgetView.PortfolioOverview);
  }

  onSwitchView(view: WidgetView) {
    if (view === WidgetView.TradesNeeded) {
      this.tradesNeededComponent.positions = this.positions;
      this.tradesNeededComponent.refreshTradesNeeded();
    }
    this.switchView(view);
  }

  onNewPortfolio($event) {
    // Wipe save state so that new portfolio gets deleted if user cancels
    this.editPortfolioComponent.saveState = null;
  }

  setCadUsdExchangeRate() {
    this.passivService.getCurrencies().subscribe(response => {
      (response as PassivCurrencyRate[]).forEach(rate => {
        if (rate.src.code.toLowerCase() === 'cad' && rate.dst.code.toLowerCase() === 'usd') {
          this.cadToUsd = rate.exchange_rate;
        }
      });
    });
  }

  cadToUsdRate() {
    if (this.cadToUsd === 0) {
      this.setCadUsdExchangeRate();
      return 0.753; // Return in meantime
    } else {
      return this.cadToUsd;
    }
  }

  onImportPortfolio(portfolio: PortfolioTemplate) {
    let totalPortfolioValueUSD = this.tradesNeededComponent.cashCAD * this.cadToUsdRate();
    totalPortfolioValueUSD += this.tradesNeededComponent.cashUSD;
    if (this.positions.length === 0) {
      this.editPortfolioComponent.noImportData = true;
    }
    this.positions.forEach(position => {
      if (WealthicaPosition.isCadPosition(position)) {
        totalPortfolioValueUSD += position.market_value * this.cadToUsdRate();
      } else {
        totalPortfolioValueUSD += position.market_value;
      }
    });

    const promises = [];
    // Make sure passiv can find the security before adding
    this.positions.forEach(position => {
      let addImportedSecurity = false;
      let symbolToAdd = position.security.symbol;
      const request = new PassivSymbolRequest(symbolToAdd);
      promises.push(this.passivService.search(request).subscribe(response => {
        if (WealthicaSecurity.isUsdSecurity(position)) {
          if ((response as PassivSymbol[]).map(r => r.symbol).includes(symbolToAdd)) {
            addImportedSecurity = true;
          }
        } else if (WealthicaSecurity.isCadSecurity(position)) {
          symbolToAdd = PassivSymbol.getCadSymbolFromWealthica(symbolToAdd, response as PassivSymbol[]);
          if (symbolToAdd !== null && !symbolToAdd.includes('.cn')) {
            addImportedSecurity = true;
          }
        }
        if (addImportedSecurity) {
          let percentOfTotal = position.market_value / totalPortfolioValueUSD;
          if (WealthicaPosition.isCadPosition(position)) {
            percentOfTotal = percentOfTotal * this.cadToUsdRate();
          }
          const component = new PortfolioComponent(
            symbolToAdd,
            percentOfTotal
          );
          component.displayPercent = parseFloat((percentOfTotal * 100).toFixed(2));
          portfolio.components.push(component);
        }
      }));
    });
    // Only want these to happen after above finishes
    Promise.all(promises).then(() => {
      this.syncPortfolios(portfolio);
      this.editPortfolioComponent.saveState = null;
      this.switchView(WidgetView.EditPortfolio);
    });
  }

}
