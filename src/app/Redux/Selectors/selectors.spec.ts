import { selectAccount, selectAllSets, selectMySets, selectSetStudy, selectSnackbar } from './selectors';
import AppState from '../app.state';

describe('selectors', () => {
  const state = {
    setStudy: { currentStep: 1 },
    allSets: { sets: [1] },
    mySets: { sets: [2] },
    account: { id: 'user-1' },
    snackbar: { isShown: true, message: 'hi' }
  } as unknown as AppState;

  it('selectAccount reads the account slice', () => {
    expect(selectAccount(state)).toBe(state.account);
  });

  it('selectAllSets reads the allSets slice', () => {
    expect(selectAllSets(state)).toBe(state.allSets);
  });

  it('selectMySets reads the mySets slice', () => {
    expect(selectMySets(state)).toBe(state.mySets);
  });

  it('selectSetStudy reads the setStudy slice', () => {
    expect(selectSetStudy(state)).toBe(state.setStudy);
  });

  it('selectSnackbar reads the snackbar slice', () => {
    expect(selectSnackbar(state)).toBe(state.snackbar);
  });
});
