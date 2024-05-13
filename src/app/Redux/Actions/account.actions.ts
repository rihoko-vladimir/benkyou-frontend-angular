import { createAction, props } from '@ngrx/store';
import { IAccountState } from '../Reducers/account.reducer';
import { ThemePreference } from '../../Models/Enums/ThemePreference';

export const loginSuccess = createAction('[Login page] Login Success', props<IAccountState>());

export const getAccountInfoSuccess = createAction(
  '[Account Page/Login Page] Get Account Info Success',
  props<IAccountState>()
);

export const logout = createAction('[Account page] Log out');

export const dismissError = createAction('[Account page] Dismiss error');

export const accountError = createAction('[Login page] Account error', props<{ errorMessage: string }>());

export const themeChange = createAction('[Benkyou] Theme change', props<{ theme: ThemePreference }>());
