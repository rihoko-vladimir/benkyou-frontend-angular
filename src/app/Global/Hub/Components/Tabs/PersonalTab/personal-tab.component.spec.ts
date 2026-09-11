import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { AccountService } from '../../../../../Services/account.service';
import { IAccountState, accountInitialState } from '../../../../../Redux/Reducers/account.reducer';
import { accountError, accountInfoSuccess } from '../../../../../Redux/Actions/account.actions';
import { visibilityChangeSuccess } from '../../../../../Redux/Actions/snackbar.actions';
import { UserResponse } from '../../../../../Models/Responses/UserResponse';
import { mapUserResponseToAccountState } from '../../../../../Services/Helpers/converters';
import { PersonalTabComponent } from './personal-tab.component';

describe('PersonalTabComponent', () => {
  let component: PersonalTabComponent;
  let fixture: ComponentFixture<PersonalTabComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let accountState$: BehaviorSubject<IAccountState>;
  let accountServiceMock: { updateUserAccount: ReturnType<typeof vi.fn> };

  const baseAccount: IAccountState = {
    ...accountInitialState,
    firstName: 'Taro',
    lastName: 'Yamada',
    userName: 'taro',
    birthDay: '1990-01-01',
    about: 'hi',
    isAccountPublic: true
  };

  const userResponse: UserResponse = {
    id: 'user-1',
    firstName: 'Taro',
    lastName: 'Yamada',
    userName: 'taro',
    userRole: 'user',
    isTermsAccepted: true,
    isAccountPublic: true,
    birthDay: '1990-01-01',
    about: 'hi',
    avatarUrl: ''
  };

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>(baseAccount);
    store = { select: () => accountState$, dispatch: vi.fn() };
    accountServiceMock = { updateUserAccount: vi.fn() };

    TestBed.configureTestingModule({
      imports: [PersonalTabComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: AccountService, useValue: accountServiceMock }
      ]
    });
    fixture = TestBed.createComponent(PersonalTabComponent);
    component = fixture.componentInstance;
  });

  it('populates the form from the account state and starts untouched', () => {
    fixture.detectChanges();

    expect(component.personalFormGroup.controls.firstNameControl.value).toBe('Taro');
    expect(component.personalFormGroup.controls.lastNameControl.value).toBe('Yamada');
    expect(component.personalFormGroup.controls.userNameControl.value).toBe('taro');
    expect(component.personalFormGroup.controls.aboutControl.value).toBe('hi');
    expect(component.isTouched()).toBe(false);
  });

  it('marks the form touched when a control diverges from the account state', () => {
    fixture.detectChanges();

    component.personalFormGroup.controls.firstNameControl.setValue('Jiro');
    fixture.detectChanges();

    expect(component.isTouched()).toBe(true);
  });

  it('surfaces the required error for an empty first name', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.firstNameControl.setValue('');
    component.personalFormGroup.controls.firstNameControl.markAsTouched();

    expect(component.getFirstNameError()).toBe('This field is required');
  });

  it('surfaces the maxlength error for an overlong first name', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.firstNameControl.setValue('a'.repeat(21));

    expect(component.getFirstNameError()).toBe('This field can not be longer than 20 characters');
  });

  it('falls back to an unknown error for the first name when no known error is present', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.firstNameControl.setValue('ok');

    expect(component.getFirstNameError()).toBe('Unknown error');
  });

  it('surfaces required/maxlength/unknown errors for the last name', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.lastNameControl.setValue('');
    expect(component.getLastNameError()).toBe('This field is required');

    component.personalFormGroup.controls.lastNameControl.setValue('a'.repeat(36));
    expect(component.getLastNameError()).toBe('This field can not be longer than 35 characters');

    component.personalFormGroup.controls.lastNameControl.setValue('ok');
    expect(component.getLastNameError()).toBe('Unknown error');
  });

  it('surfaces required/maxlength/unknown errors for the username', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.userNameControl.setValue('');
    expect(component.getUserNameError()).toBe('This field is required');

    component.personalFormGroup.controls.userNameControl.setValue('a'.repeat(11));
    expect(component.getUserNameError()).toBe('This field can not be longer than 10 characters');

    component.personalFormGroup.controls.userNameControl.setValue('ok');
    expect(component.getUserNameError()).toBe('Unknown error');
  });

  it('surfaces maxlength/unknown errors for the about field', () => {
    fixture.detectChanges();
    component.personalFormGroup.controls.aboutControl.setValue('a'.repeat(351));
    expect(component.getAboutError()).toBe('This field can not be longer than 350 characters');

    component.personalFormGroup.controls.aboutControl.setValue('ok');
    expect(component.getAboutError()).toBe('Unknown error');
  });

  it('saves the account and dispatches visibilityChangeSuccess + accountInfoSuccess', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of({ ...userResponse, isAccountPublic: false }));
    fixture.detectChanges();

    component.onAccountSaveClicked();

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(visibilityChangeSuccess());
    expect(store.dispatch).toHaveBeenCalledWith(
      accountInfoSuccess(mapUserResponseToAccountState({ ...userResponse, isAccountPublic: false }))
    );
  });

  it('does not dispatch visibilityChangeSuccess when visibility is unchanged on save', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of(userResponse));
    fixture.detectChanges();

    component.onAccountSaveClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(visibilityChangeSuccess());
    expect(store.dispatch).toHaveBeenCalledWith(accountInfoSuccess(mapUserResponseToAccountState(userResponse)));
  });

  it('dispatches accountError when the save request fails', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(throwError(() => ({ error: 'boom' })));
    fixture.detectChanges();

    component.onAccountSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'boom' }));
  });

  it('sends a null birthDay when the birthday control has no value', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of(userResponse));
    fixture.detectChanges();
    component.personalFormGroup.controls.birthdayControl.setValue(null);

    component.onAccountSaveClicked();

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ birthDay: null })
    );
  });

  it('invokes onAccountSaveClicked when the Save button is clicked', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of(userResponse));
    fixture.detectChanges();
    component.personalFormGroup.controls.firstNameControl.setValue('Changed');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.saveButton');
    button.click();

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalled();
  });
});
