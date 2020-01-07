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
  @Output() newPortfolio: EventEmitter<WidgetView> = new EventEmitter();
  @Output() importPortfolio: EventEmitter<PortfolioTemplate> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  viewPortfolio(portfolio: PortfolioTemplate) {
    this.portfolio = portfolio;
    this.switchPortfolio.emit(portfolio);
    this.switchView.emit(WidgetView.PortfolioDetails);
  }

  onNewPortfolio() {
    this.portfolio = new PortfolioTemplate();
    this.portfolio.portfolioName = 'New Portfolio';
    this.portfolio.components = [new PortfolioComponent('', 1)];
    this.portfolios.push(this.portfolio);
    this.switchPortfolio.emit(this.portfolio);
    this.newPortfolio.emit(null);
    this.switchView.emit(WidgetView.EditPortfolio);
  }

  onImportPortfolio() {
    this.portfolio = new PortfolioTemplate();
    const namesInUse: string[] = [];
    this.portfolios.forEach(portfolio => {
      namesInUse.push(portfolio.portfolioName);
    });

    if (!namesInUse.includes('Imported Portfolio')) {
      this.portfolio.portfolioName = 'Imported Portfolio';
    } else if (!namesInUse.includes('Imported Portfolio 2')) {
      this.portfolio.portfolioName = 'Imported Portfolio 2';
    } else if (!namesInUse.includes('Imported Portfolio 3')) {
      this.portfolio.portfolioName = 'Imported Portfolio 3';
    } else if (!namesInUse.includes('Imported Portfolio 4')) {
      this.portfolio.portfolioName = 'Imported Portfolio 4';
    } else if (!namesInUse.includes('Imported Portfolio 4')) {
      this.portfolio.portfolioName = 'Imported Portfolio 4';
    } else if (!namesInUse.includes('Imported Portfolio 5')) {
      this.portfolio.portfolioName = 'Imported Portfolio 5';
    } else if (!namesInUse.includes('Imported Portfolio 6')) {
      this.portfolio.portfolioName = 'Imported Portfolio 6';
    } else if (!namesInUse.includes('Imported Portfolio 7')) {
      this.portfolio.portfolioName = 'Imported Portfolio 7';
    } else if (!namesInUse.includes('Imported Portfolio 8')) {
      this.portfolio.portfolioName = 'Imported Portfolio 8';
    } else if (!namesInUse.includes('Imported Portfolio 9')) {
      this.portfolio.portfolioName = 'Imported Portfolio 9';
    } else if (!namesInUse.includes('Imported Portfolio 10')) {
      this.portfolio.portfolioName = 'Imported Portfolio 10';
    } else {
      this.portfolio.portfolioName = 'Another Imported Portfolio';
    }



    this.portfolio.components = [];
    this.portfolios.push(this.portfolio);
    this.switchPortfolio.emit(this.portfolio);
    this.importPortfolio.emit(this.portfolio);
    this.switchView.emit(WidgetView.EditPortfolio);
  }

  splashPage() {
    this.switchView.emit(WidgetView.SplashPage);
  }

}
