import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PortfolioTemplate, PortfolioType, PortfolioComponent, PassivSymbolRequest, PassivSymbolResponse, PassivSymbol } from '../../models';
import { WidgetView } from '../widget-view';
import { PassivService } from 'src/app/services/passiv.service';

@Component({
  selector: 'app-edit-portfolio',
  templateUrl: './edit-portfolio.component.html',
  styleUrls: ['./edit-portfolio.component.scss']
})
export class EditPortfolioComponent implements OnInit {

  portfolio: PortfolioTemplate = new PortfolioTemplate();
  currentView: WidgetView;
  results: PassivSymbol[] = [];
  saveState: PortfolioTemplate;
  noImportData = false;

  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() switchView: EventEmitter<WidgetView> = new EventEmitter();
  @Output() deletePortfolio: EventEmitter<PortfolioTemplate> = new EventEmitter();

  constructor(private passivService: PassivService) { }

  ngOnInit() {

  }

  onCancel() {
    this.noImportData = false;
    const restoredPortfolio = this.loadFromSaveState();
    if (restoredPortfolio === null) { // User canceled import portfolio
      this.cancel.emit(null);
      this.switchView.emit(WidgetView.PortfolioOverview);
    } else {
      this.portfolio = restoredPortfolio;
      this.cancel.emit(restoredPortfolio);
      this.switchView.emit(WidgetView.PortfolioDetails);
    }
  }

  onSave() {
    // Update save state to new copy
    this.saveState = JSON.parse(JSON.stringify(this.portfolio)) as PortfolioTemplate;

    this.noImportData = false;
    this.save.emit(this.portfolio);
    this.switchView.emit(WidgetView.PortfolioDetails);
  }

  loadFromSaveState() {
    if (this.saveState === null) {
      return null;
    }
    const restoredPort = new PortfolioTemplate();
    restoredPort.portfolioName = this.saveState.portfolioName;
    restoredPort.id = this.saveState.id;
    restoredPort.components = [];
    this.saveState.components.forEach((component: PortfolioComponent) => {
      const c = new PortfolioComponent(component.symbol, component.percentOfPortfolio);
      c.displayPercent = component.displayPercent;
      c.sharesOwned = component.sharesOwned;
      restoredPort.components.push(c);
    });
    return restoredPort;
  }

  loadSuggestions(component: PortfolioComponent) {
    const request = new PassivSymbolRequest();
    request.substring = component.symbol;
    this.passivService.search(request).subscribe(response => {
      component.suggestedSymbols = (response as PassivSymbol[]);
    });
  }

  hideSuggestions() {
    this.portfolio.components.forEach(component => {
      component.suggestedSymbols = [];
    });
  }

  updatePortfolio(portfolio: PortfolioTemplate) {
    this.portfolio = portfolio;
  }

  setSymbol(component: PortfolioComponent, symbol: string) {
    component.symbol = symbol;
    component.suggestedSymbols = [];
  }

  onPercentChange(component: PortfolioComponent) {
    component.percentOfPortfolio = component.displayPercent / 100;
  }

  validAllocation(): boolean {
    let totalAllocation = 0;
    this.portfolio.components.forEach(component => {
      totalAllocation += component.percentOfPortfolio * 100;
    });
    if (totalAllocation > 100 || totalAllocation < 0) {
      return false;
    }
    return true;
  }

  newComponent() {
    this.noImportData = false;
    this.portfolio.components.push(new PortfolioComponent('', 0));
  }

  deleteComponent(component: PortfolioComponent) {
    const indexToDelete = this.portfolio.components.indexOf(component);
    this.portfolio.components.splice(indexToDelete, 1);
  }

  onDelete() {
    this.deletePortfolio.emit(this.portfolio);
  }
}
