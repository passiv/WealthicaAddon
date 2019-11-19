import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PortfolioTemplate, PortfolioType, PortfolioComponent } from '../../models';
import { WidgetView } from '../widget-view';


@Component({
  selector: 'app-portfolio-overview',
  templateUrl: './portfolio-overview.component.html',
  styleUrls: ['./portfolio-overview.component.scss']
})
export class PortfolioOverviewComponent implements OnInit {

  portfolios: PortfolioTemplate[] = [];

  portfolio: PortfolioTemplate = new PortfolioTemplate();
  currentView: WidgetView;

  @Output() switchPortfolio: EventEmitter<PortfolioTemplate> = new EventEmitter();
  @Output() switchView: EventEmitter<WidgetView> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  viewPortfolio(portfolio: PortfolioTemplate) {
    this.portfolio = portfolio;
    this.switchPortfolio.emit(portfolio);
    this.switchView.emit(WidgetView.PortfolioDetails);
  }

  newPortfolio() {
    this.portfolio = new PortfolioTemplate();
    this.portfolio.portfolioName = 'New Portfolio';
    this.portfolio.components = [new PortfolioComponent('', 1)];
    this.portfolios.push(this.portfolio);
    this.switchPortfolio.emit(this.portfolio);
    this.switchView.emit(WidgetView.EditPortfolio);
  }

  importPortfolio() {

  }

}
