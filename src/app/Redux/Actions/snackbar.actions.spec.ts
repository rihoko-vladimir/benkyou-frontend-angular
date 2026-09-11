import {
  addSetSuccess,
  createSetSuccess,
  dismissSnackbar,
  removeSetSuccess,
  visibilityChangeSuccess
} from './snackbar.actions';

describe('snackbar.actions', () => {
  it('addSetSuccess has the expected type', () => {
    expect(addSetSuccess().type).toBe('[Snackbar] Set add success');
  });

  it('createSetSuccess has the expected type', () => {
    expect(createSetSuccess().type).toBe('[Snackbar] Set create success');
  });

  it('removeSetSuccess has the expected type', () => {
    expect(removeSetSuccess().type).toBe('[Snackbar] Set remove success');
  });

  it('visibilityChangeSuccess has the expected type', () => {
    expect(visibilityChangeSuccess().type).toBe('[Snackbar] Visibility change success');
  });

  it('dismissSnackbar has the expected type', () => {
    expect(dismissSnackbar().type).toBe('[Snackbar] Dismiss snackbar');
  });
});
