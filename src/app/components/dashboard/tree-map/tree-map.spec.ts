import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeMap } from './tree-map';

describe('TreeMap', () => {
  let component: TreeMap;
  let fixture: ComponentFixture<TreeMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
