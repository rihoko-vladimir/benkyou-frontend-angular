import { selectAccount, selectAllSets, selectMySets, selectSetStudy, selectSnackbar } from './selectors';
import AppState from '../app.state';
import { accountInitialState } from '../Reducers/account.reducer';
import { allSetsInitialState } from '../Reducers/all-sets.reducer';
import { mySetsInitialState } from '../Reducers/my-sets.reducer';
import { setStudyInitialState } from '../Reducers/set-study.reducer';

describe('selectors', () => {
  const state: AppState = {
    account: accountInitialState,
    allSets: allSetsInitialState,
    mySets: mySetsInitialState,
    setStudy: setStudyInitialState,
    snackbar: { isShown: true, message: 'Set was created successfully' }
  };

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
