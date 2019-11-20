import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WidgetView } from '../widget-view';

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.component.html',
  styleUrls: ['./splash-page.component.scss']
})
export class SplashPageComponent implements OnInit {

  @Output() switchView: EventEmitter<WidgetView> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  skip() {
    this.switchView.emit(WidgetView.PortfolioOverview);
  }

}
