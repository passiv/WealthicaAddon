import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOverviewComponent } from './portfolio-overview.component';

describe('PortfolioOverviewComponent', () => {
  let component: PortfolioOverviewComponent;
  let fixture: ComponentFixture<PortfolioOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
