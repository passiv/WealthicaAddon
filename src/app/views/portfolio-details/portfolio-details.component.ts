import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PortfolioTemplate, PortfolioType } from '../../models';
import { WidgetView } from '../widget-view';

@Component({
  selector: 'app-portfolio-details',
  templateUrl: './portfolio-details.component.html',
  styleUrls: ['./portfolio-details.component.scss']
})
export class PortfolioDetailsComponent implements OnInit {
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType = 'pie';
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(155,155,0,0.3)', 'rgba(155,0,155,0.3)', 'rgba(0,155,155,0.3)', 'rgba(100,255,0,0.3)', 'rgba(0,100,255,0.3)', 'rgba(255,0,100,0.3)', 'rgba(255,100,25,0.3)'],
    },
  ];

  portfolio: PortfolioTemplate;
  currentView: WidgetView;
  percentCash = 100;

  @Output() switchView: EventEmitter<WidgetView> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    // Need to update piechart here to have colours in pie chart
    this.portfolio = new PortfolioTemplate(PortfolioType.CanadianEquity);
    this.updatePiechart();
  }

  updatePiechart() {
    this.pieChartLabels = [];
    this.pieChartData = [];
    this.percentCash = 100;
    this.portfolio.components.forEach(component => {
      this.pieChartLabels.push(component.symbol);
      this.pieChartData.push(parseFloat((component.percentOfPortfolio * 100).toFixed(2)));
      this.percentCash -= component.percentOfPortfolio * 100;
    });
    if (this.percentCash > 0) {
      this.pieChartLabels.push('Cash');
      this.pieChartData.push(parseFloat(this.percentCash.toFixed(2)));
    }
  }

  formatPercent(percent: number): string {
    return (percent * 100).toFixed(1);
  }

  portfolioOverview() {
    this.switchView.emit(WidgetView.PortfolioOverview);
  }

  editPortfolio() {
    this.switchView.emit(WidgetView.EditPortfolio);
  }

  tradesNeeded() {
    this.switchView.emit(WidgetView.TradesNeeded);
  }
}
