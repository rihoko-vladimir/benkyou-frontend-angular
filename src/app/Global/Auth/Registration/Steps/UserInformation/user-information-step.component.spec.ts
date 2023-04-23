import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationStepComponent } from './user-information-step.component';

describe('UserInformationStepComponent', () => {
  let component: UserInformationStepComponent;
  let fixture: ComponentFixture<UserInformationStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInformationStepComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInformationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
