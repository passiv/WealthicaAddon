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
      backgroundColor: ['rgba(0,163,135,1)', 'rgba(190,224,219,1)', 'rgba(42,194,168,1)', 'rgba(20,183,188,1)', 'rgba(124,218,202,1)', 'rgba(0,148,123,1)', 'rgba(107,213,195,1)', 'rgba(137,191,182,1)'],
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
