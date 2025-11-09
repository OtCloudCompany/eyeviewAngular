import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfricaMap } from './africa-map';

describe('AfricaMap', () => {
  let component: AfricaMap;
  let fixture: ComponentFixture<AfricaMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfricaMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfricaMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
