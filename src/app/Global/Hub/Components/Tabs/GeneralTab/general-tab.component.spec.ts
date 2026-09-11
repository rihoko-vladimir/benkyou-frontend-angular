import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AccountService } from '../../../../../Services/account.service';
import { IAccountState, accountInitialState } from '../../../../../Redux/Reducers/account.reducer';
import { accountError, accountInfoSuccess } from '../../../../../Redux/Actions/account.actions';
import { visibilityChangeSuccess } from '../../../../../Redux/Actions/snackbar.actions';
import { UserResponse } from '../../../../../Models/Responses/UserResponse';
import { mapUserResponseToAccountState } from '../../../../../Services/Helpers/converters';
import { GeneralTabComponent } from './general-tab.component';

describe('GeneralTabComponent', () => {
  let component: GeneralTabComponent;
  let fixture: ComponentFixture<GeneralTabComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let accountState$: BehaviorSubject<IAccountState>;
  let accountServiceMock: { updateUserAccount: ReturnType<typeof vi.fn> };

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

  // The account slice, and the exact "current account" payload the component
  // sends when a visibility update is requested.
  const accountSlice = {
    firstName: 'Taro',
    lastName: 'Yamada',
    userName: 'taro',
    isAccountPublic: false,
    birthDay: '1990-01-01',
    about: 'hi'
  };

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>({ ...accountInitialState, ...accountSlice });
    store = { select: () => accountState$, dispatch: vi.fn() };
    accountServiceMock = { updateUserAccount: vi.fn() };

    TestBed.configureTestingModule({
      imports: [GeneralTabComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: AccountService, useValue: accountServiceMock }
      ]
    });
    fixture = TestBed.createComponent(GeneralTabComponent);
    component = fixture.componentInstance;
  });

  it('reflects the account visibility slice in the toggle checked state', () => {
    fixture.detectChanges();
    const toggle = fixture.debugElement.query(By.directive(MatSlideToggle)).componentInstance as MatSlideToggle;

    expect(toggle.checked).toBe(false);

    accountState$.next({ ...accountInitialState, ...accountSlice, isAccountPublic: true });
    fixture.detectChanges();

    expect(toggle.checked).toBe(true);
  });

  it('dispatches visibilityChangeSuccess and accountInfoSuccess when visibility actually changes', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of({ ...userResponse, isAccountPublic: true }));
    fixture.detectChanges();

    component.onVisibilityChanged({ checked: true } as MatSlideToggleChange);

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalledWith(accountSlice, {
      ...accountSlice,
      isAccountPublic: true
    });
    expect(store.dispatch).toHaveBeenCalledWith(visibilityChangeSuccess());
    expect(store.dispatch).toHaveBeenCalledWith(
      accountInfoSuccess(mapUserResponseToAccountState({ ...userResponse, isAccountPublic: true }))
    );
  });

  it('does not dispatch visibilityChangeSuccess when visibility is unchanged', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of({ ...userResponse, isAccountPublic: false }));
    fixture.detectChanges();

    component.onVisibilityChanged({ checked: false } as MatSlideToggleChange);

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalledWith(accountSlice, accountSlice);
    expect(store.dispatch).not.toHaveBeenCalledWith(visibilityChangeSuccess());
    expect(store.dispatch).toHaveBeenCalledWith(
      accountInfoSuccess(mapUserResponseToAccountState({ ...userResponse, isAccountPublic: false }))
    );
  });

  it('dispatches accountError when the update request fails', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(throwError(() => ({ error: 'boom' })));
    fixture.detectChanges();

    component.onVisibilityChanged({ checked: true } as MatSlideToggleChange);

    expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'boom' }));
  });

  it('invokes the account update when the slide toggle emits a change', () => {
    accountServiceMock.updateUserAccount.mockReturnValue(of({ ...userResponse, isAccountPublic: true }));
    fixture.detectChanges();
    const toggle = fixture.debugElement.query(By.directive(MatSlideToggle)).componentInstance as MatSlideToggle;

    toggle.change.emit(new MatSlideToggleChange(toggle, true));

    expect(accountServiceMock.updateUserAccount).toHaveBeenCalledWith(accountSlice, {
      ...accountSlice,
      isAccountPublic: true
    });
    expect(store.dispatch).toHaveBeenCalledWith(visibilityChangeSuccess());
  });
});
