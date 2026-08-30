import { createReducer, on } from '@ngrx/store';
import { accountError, accountInfoSuccess, logout, themeChange } from '../Actions/account.actions';
import { ThemePreference } from '../../Models/Enums/ThemePreference';

export interface IAccountState {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  userRole: string;
  birthDay: string;
  avatarUrl: string;
  isTermsAccepted: boolean;
  isAccountPublic: boolean;
  about: string;
  error: { isError: boolean; errorMessage: string };
  themePreference?: ThemePreference;
}

const initialState: IAccountState = {
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

// Maps a full account snapshot onto state. Used by accountInfoSuccess for every flow that
// yields fresh account info (login, get-info, update-info, avatar upload); the error flag is
// reset so a failed request followed by a success clears the error UI.
const mapAccountInfo = (account: IAccountState) => ({
  about: account.about,
  avatarUrl: account.avatarUrl,
  birthDay: account.birthDay,
  firstName: account.firstName,
  lastName: account.lastName,
  isAccountPublic: account.isAccountPublic,
  isTermsAccepted: account.isTermsAccepted,
  userRole: account.userRole,
  userName: account.userName,
  id: account.id,
  error: { isError: false, errorMessage: '' }
});

export const accountReducer = createReducer(
  initialState,
  on(accountInfoSuccess, (state, account) => ({
    ...state,
    ...mapAccountInfo(account)
  })),
  on(accountError, (state, { errorMessage }) => ({
    ...state,
    error: { isError: true, errorMessage: errorMessage }
  })),
  on(themeChange, (state, { theme }) => ({
    ...state,
    themePreference: theme
  })),
  on(logout, () => initialState)
);
