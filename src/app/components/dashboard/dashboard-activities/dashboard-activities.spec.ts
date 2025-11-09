import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActivities } from './dashboard-activities';

describe('DashboardActivities', () => {
  let component: DashboardActivities;
  let fixture: ComponentFixture<DashboardActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
