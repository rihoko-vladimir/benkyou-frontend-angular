import { snackbarReducer } from './snackbar.reducer';
import {
  addSetSuccess,
  createSetSuccess,
  dismissSnackbar,
  removeSetSuccess,
  visibilityChangeSuccess
} from '../Actions/snackbar.actions';

describe('snackbarReducer', () => {
  it('returns the initial state (hidden, empty message) for an unknown action', () => {
    const state = snackbarReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({ isShown: false, message: '' });
  });

  it('shows the "added" message on addSetSuccess', () => {
    const state = snackbarReducer(undefined, addSetSuccess());

    expect(state).toEqual({ isShown: true, message: 'Set was successfully added to your list' });
  });

  it('shows the "created" message on createSetSuccess', () => {
    const state = snackbarReducer(undefined, createSetSuccess());

    expect(state).toEqual({ isShown: true, message: 'Set was created successfully' });
  });

  it('shows the "removed" message on removeSetSuccess', () => {
    const state = snackbarReducer(undefined, removeSetSuccess());

    expect(state).toEqual({ isShown: true, message: 'Set was removed successfully' });
  });

  it('shows the "visibility changed" message on visibilityChangeSuccess', () => {
    const state = snackbarReducer(undefined, visibilityChangeSuccess());

    expect(state).toEqual({ isShown: true, message: 'Visibility changed successfully' });
  });

  it('hides and clears the message on dismissSnackbar', () => {
    const shown = snackbarReducer(undefined, addSetSuccess());

    const state = snackbarReducer(shown, dismissSnackbar());

    expect(state).toEqual({ isShown: false, message: '' });
  });
});
