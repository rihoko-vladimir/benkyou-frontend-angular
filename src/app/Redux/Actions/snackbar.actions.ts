import { createAction } from '@ngrx/store';

export const addSetSuccess = createAction('[Snackbar] Set add success');

export const createSetSuccess = createAction('[Snackbar] Set create success');

export const removeSetSuccess = createAction('[Snackbar] Set remove success');

export const visibilityChangeSuccess = createAction('[Snackbar] Visibility change success');

export const dismissSnackbar = createAction('[Snackbar] Dismiss snackbar');
