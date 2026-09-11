import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Router, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AccountInfoListItemComponent } from './account-info-list-item.component';
import { AuthService } from '../../../../Services/auth.service';
import { accountInitialState, IAccountState } from '../../../../Redux/Reducers/account.reducer';
import { logout, accountInfoSuccess, accountError } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';

describe('AccountInfoListItemComponent', () => {
  let component: AccountInfoListItemComponent;
  let fixture: ComponentFixture<AccountInfoListItemComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let authService: { getUserInfo: ReturnType<typeof vi.fn> };
  let router: Router;
  let accountState$: BehaviorSubject<IAccountState>;

  const userInfo = {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    userName: 'jd',
    userRole: 'user',
    isTermsAccepted: true,
    isAccountPublic: false,
    birthDay: '',
    about: '',
    avatarUrl: 'url'
  };

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>({ ...accountInitialState, firstName: 'Jane', lastName: 'Doe' });
    store = { select: () => accountState$, dispatch: vi.fn() };
    authService = { getUserInfo: vi.fn().mockReturnValue(of(userInfo)) };

    TestBed.configureTestingModule({
      imports: [AccountInfoListItemComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: store },
        { provide: AuthService, useValue: authService }
      ]
    });

    fixture = TestBed.createComponent(AccountInfoListItemComponent);
    component = fixture.componentInstance;
    // RouterLink/RouterLinkActive need the real Router from provideRouter; only navigate is spied.
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('creates and dispatches accountInfoSuccess on init when getUserInfo succeeds', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(store.dispatch).toHaveBeenCalledWith(accountInfoSuccess(mapUserResponseToAccountState(userInfo)));
    expect(component.firstName()).toBe('Jane');
  });

  it('dispatches accountError when getUserInfo fails', () => {
    authService.getUserInfo.mockReturnValue(throwError(() => ({ error: 'boom' })));

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'boom' }));
  });

  it('goes down the avatar image branch when the account has an avatarUrl', () => {
    accountState$.next({ ...accountInitialState, avatarUrl: 'https://example.com/avatar.png' });

    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/avatar.png');
    expect(img.getAttribute('width')).toBe('32');
    expect(img.getAttribute('height')).toBe('32');
  });

  it('dispatches logout and navigates to auth on onLogoutClicked', async () => {
    fixture.detectChanges();

    (fixture.nativeElement.querySelectorAll('mat-list-item')[1] as HTMLElement).click();

    await vi.waitFor(() => expect(store.dispatch).toHaveBeenCalledWith(logout()));
    await vi.waitFor(() => expect(router.navigate).toHaveBeenCalledWith(['auth']));
  });
});
