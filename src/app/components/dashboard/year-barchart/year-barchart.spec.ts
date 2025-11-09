import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearBarchart } from './year-barchart';

describe('YearBarchart', () => {
  let component: YearBarchart;
  let fixture: ComponentFixture<YearBarchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearBarchart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearBarchart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
