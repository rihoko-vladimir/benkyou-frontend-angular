import { accountError, accountInfoSuccess, dismissError, logout, themeChange } from './account.actions';
import { ThemePreference } from '../../Models/Enums/ThemePreference';

describe('account.actions', () => {
  it('accountInfoSuccess carries the account payload', () => {
    const payload = {
      id: 'user-1',
      firstName: 'Taro',
      lastName: 'Yamada',
      userName: 'taro',
      userRole: 'user',
      birthDay: '1990-01-01',
      avatarUrl: '',
      isTermsAccepted: true,
      isAccountPublic: false,
      about: '',
      error: { isError: false, errorMessage: '' },
      themePreference: ThemePreference.Auto
    };

    const action = accountInfoSuccess(payload);

    expect(action.type).toBe('[Auth] Account Info Success');
    expect(action).toMatchObject(payload);
  });

  it('logout has no payload', () => {
    expect(logout().type).toBe('[Account page] Log out');
  });

  it('dismissError has no payload', () => {
    expect(dismissError().type).toBe('[Account page] Dismiss error');
  });

  it('accountError carries an errorMessage', () => {
    const action = accountError({ errorMessage: 'Invalid credentials' });

    expect(action.type).toBe('[Login page] Account error');
    expect(action.errorMessage).toBe('Invalid credentials');
  });

  it('themeChange carries a theme', () => {
    const action = themeChange({ theme: ThemePreference.Dark });

    expect(action.type).toBe('[Benkyou] Theme change');
    expect(action.theme).toBe(ThemePreference.Dark);
  });
});
