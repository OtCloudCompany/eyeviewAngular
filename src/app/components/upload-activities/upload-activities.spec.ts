import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadActivities } from './upload-activities';

describe('UploadActivities', () => {
  let component: UploadActivities;
  let fixture: ComponentFixture<UploadActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
