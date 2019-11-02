import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesNeededComponent } from './trades-needed.component';

describe('TradesNeededComponent', () => {
  let component: TradesNeededComponent;
  let fixture: ComponentFixture<TradesNeededComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradesNeededComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradesNeededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
