import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivity } from './edit-activity';

describe('EditActivity', () => {
  let component: EditActivity;
  let fixture: ComponentFixture<EditActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditActivity]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditActivity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
