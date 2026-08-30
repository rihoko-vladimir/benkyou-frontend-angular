import { ThemePreference } from '../../Models/Enums/ThemePreference';
import { accountError, accountInfoSuccess, accountInfoSuccess, logout, themeChange } from '../Actions/account.actions';
import { accountReducer, IAccountState } from './account.reducer';

const accountPayload: IAccountState = {
  id: 'user-1',
  firstName: 'Taro',
  lastName: 'Yamada',
  userName: 'taro',
  userRole: 'admin',
  birthDay: '1990-01-01',
  avatarUrl: 'http://example.com/avatar.png',
  isTermsAccepted: true,
  isAccountPublic: true,
  about: 'About me',
  error: { isError: false, errorMessage: '' },
  themePreference: ThemePreference.Dark
};

const expectedInitialState = {
  about: '',
  avatarUrl: '',
  birthDay: '',
  firstName: '',
  id: '',
  isAccountPublic: false,
  userRole: 'user',
  lastName: '',
  userName: '',
  isTermsAccepted: true,
  error: { isError: false, errorMessage: '' },
  themePreference: ThemePreference.Auto
};

describe('accountReducer', () => {
  it('starts from an empty account with no error and the auto theme', () => {
    const state = accountReducer(undefined, { type: 'unknown' });

    expect(state).toEqual(expectedInitialState);
  });

  it('populates the account on accountInfoSuccess', () => {
    const state = accountReducer(undefined, accountInfoSuccess(accountPayload));

    expect(state.id).toBe('user-1');
    expect(state.firstName).toBe('Taro');
    expect(state.lastName).toBe('Yamada');
    expect(state.userName).toBe('taro');
    expect(state.userRole).toBe('admin');
    expect(state.birthDay).toBe('1990-01-01');
    expect(state.avatarUrl).toBe('http://example.com/avatar.png');
    expect(state.isTermsAccepted).toBeTrue();
    expect(state.isAccountPublic).toBeTrue();
    expect(state.about).toBe('About me');
    expect(state.error).toEqual({ isError: false, errorMessage: '' });
  });

  it('populates the account on accountInfoSuccess', () => {
    const state = accountReducer(undefined, accountInfoSuccess(accountPayload));

    expect(state.id).toBe('user-1');
    expect(state.firstName).toBe('Taro');
    expect(state.userName).toBe('taro');
    expect(state.about).toBe('About me');
    expect(state.error).toEqual({ isError: false, errorMessage: '' });
  });

  it('does not change themePreference on login', () => {
    const state = accountReducer(undefined, accountInfoSuccess(accountPayload));

    expect(state.themePreference).toBe(ThemePreference.Auto);
  });

  it('sets the error flag and message on accountError, preserving account data', () => {
    const loggedIn = accountReducer(undefined, accountInfoSuccess(accountPayload));

    const state = accountReducer(loggedIn, accountError({ errorMessage: 'Invalid credentials' }));

    expect(state.error).toEqual({ isError: true, errorMessage: 'Invalid credentials' });
    expect(state.id).toBe('user-1');
  });

  it('updates themePreference on themeChange', () => {
    let state = accountReducer(undefined, themeChange({ theme: ThemePreference.Dark }));
    expect(state.themePreference).toBe(ThemePreference.Dark);

    state = accountReducer(state, themeChange({ theme: ThemePreference.Light }));
    expect(state.themePreference).toBe(ThemePreference.Light);
  });

  it('resets the account to its initial state on logout', () => {
    const loggedIn = accountReducer(undefined, accountInfoSuccess(accountPayload));
    const withError = accountReducer(loggedIn, accountError({ errorMessage: 'Boom' }));

    const state = accountReducer(withError, logout());

    expect(state).toEqual(expectedInitialState);
  });
});
