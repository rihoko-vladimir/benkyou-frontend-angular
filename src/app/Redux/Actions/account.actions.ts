import { createAction, props } from '@ngrx/store';
import { IAccountState } from '../Reducers/account.reducer';
import { ThemePreference } from '../../Models/Enums/ThemePreference';

// Single success action for every flow that yields fresh account info:
// login (AuthService.getUserInfo) and account refresh/update/avatar upload (AccountService).
export const accountInfoSuccess = createAction('[Auth] Account Info Success', props<IAccountState>());

export const logout = createAction('[Account page] Log out');

export const dismissError = createAction('[Account page] Dismiss error');

export const accountError = createAction('[Login page] Account error', props<{ errorMessage: string }>());

export const themeChange = createAction('[Benkyou] Theme change', props<{ theme: ThemePreference }>());
