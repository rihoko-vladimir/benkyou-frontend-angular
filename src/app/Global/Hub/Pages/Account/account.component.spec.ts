import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { IAccountState, accountInitialState } from '../../../../Redux/Reducers/account.reducer';
import { AccountService } from '../../../../Services/account.service';
import { accountError, accountInfoSuccess } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';
import { UserResponse } from '../../../../Models/Responses/UserResponse';
import { AccountInformationComponent } from '../../Components/AccountInformation/account-information.component';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let accountService: {
    getAccountInfo: ReturnType<typeof vi.fn>;
    uploadNewAvatar: ReturnType<typeof vi.fn>;
    updateUserAccount: ReturnType<typeof vi.fn>;
  };
  let accountState$: BehaviorSubject<IAccountState>;

  const userResponse: UserResponse = {
    id: '1',
    firstName: 'Taro',
    lastName: 'Yamada',
    userName: 'taro',
    userRole: 'user',
    birthDay: '2000-01-01',
    avatarUrl: '',
    isTermsAccepted: true,
    isAccountPublic: true,
    about: 'hello'
  };

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>(accountInitialState);
    store = { select: () => accountState$, dispatch: vi.fn() };

    accountService = {
      getAccountInfo: vi.fn().mockReturnValue(of(userResponse)),
      uploadNewAvatar: vi.fn(),
      updateUserAccount: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [AccountComponent],
      providers: [
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: AccountService, useValue: accountService }
      ]
    });

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
  });

  it('loads account info on init and clears the spinner', () => {
    fixture.detectChanges();

    expect(accountService.getAccountInfo).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(false);
    expect(fixture.nativeElement.querySelector('app-account-overview')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-account-information')).toBeTruthy();
  });

  it('dispatches accountInfoSuccess with the mapped state on successful load', () => {
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(accountInfoSuccess(mapUserResponseToAccountState(userResponse)));
  });

  it('dispatches accountError when the initial load fails', () => {
    accountService.getAccountInfo.mockReturnValue(throwError(() => ({ error: 'boom' })));
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'boom' }));
  });

  it('reflects the error state from the store slice', () => {
    accountState$.next({ ...accountInitialState, error: { isError: true, errorMessage: 'failed' } });
    fixture.detectChanges();

    expect(component.isError()).toBe(true);
    expect(fixture.nativeElement.querySelector('app-error')).toBeTruthy();
  });

  it('shows the spinner while the reload is in flight and hides it once the slice settles', () => {
    fixture.detectChanges();
    component.onRetryClicked();

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-account-overview')).toBeFalsy();

    accountState$.next({ ...accountInitialState, ...mapUserResponseToAccountState(userResponse) });
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeFalsy();
  });

  it('tracks the tab index emitted by the account information panel', () => {
    fixture.detectChanges();
    const panel = fixture.debugElement.query(By.directive(AccountInformationComponent)).componentInstance;

    panel.tabIndexChange.emit(2);

    expect(component.currentTab).toBe(2);
  });

  it('reloads account info on retry', () => {
    fixture.detectChanges();
    accountService.getAccountInfo.mockClear();

    component.onRetryClicked();
    // Simulate the store round trip: the success action lands back in the
    // slice, which re-runs the effect that clears the spinner.
    accountState$.next({ ...accountInitialState, ...mapUserResponseToAccountState(userResponse) });
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(accountService.getAccountInfo).toHaveBeenCalled();
  });

  it('retries the load from the error component', () => {
    accountState$.next({ ...accountInitialState, error: { isError: true, errorMessage: 'failed' } });
    fixture.detectChanges();
    accountService.getAccountInfo.mockClear();

    fixture.debugElement.query(By.css('app-error')).nativeElement.querySelector('button').click();

    expect(accountService.getAccountInfo).toHaveBeenCalled();
  });
});
