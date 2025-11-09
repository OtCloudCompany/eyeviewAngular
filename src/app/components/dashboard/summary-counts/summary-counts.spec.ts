import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCounts } from './summary-counts';

describe('SummaryCounts', () => {
  let component: SummaryCounts;
  let fixture: ComponentFixture<SummaryCounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryCounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
