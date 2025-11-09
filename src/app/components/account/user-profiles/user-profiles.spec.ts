import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfiles } from './user-profiles';

describe('UserProfiles', () => {
  let component: UserProfiles;
  let fixture: ComponentFixture<UserProfiles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfiles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfiles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
