import { mySetsReducer, mySetsInitialState } from './my-sets.reducer';
import { loadMySetsFailure, loadMySetsSuccess } from '../Actions/my-sets.actions';
import { logout } from '../Actions/account.actions';
import Set from '../../Models/Set';

describe('mySetsReducer', () => {
  it('returns the initial state for an unknown action', () => {
    const state = mySetsReducer(undefined, { type: 'unknown' });

    expect(state).toEqual(mySetsInitialState);
  });

  it('populates sets, pagesCount and currentPage on loadMySetsSuccess, preserving setsCount', () => {
    const sets = [new Set('1', 'Set 1')];

    const state = mySetsReducer(mySetsInitialState, loadMySetsSuccess({ sets, pagesCount: 2, pageNumber: 2 }));

    expect(state.sets).toBe(sets);
    expect(state.pagesCount).toBe(2);
    expect(state.currentPage).toBe(2);
    expect(state.setsCount).toBe(mySetsInitialState.setsCount);
    expect(state.errorMessage).toBeUndefined();
  });

  it('sets errorMessage on loadMySetsFailure, keeping the rest of the state', () => {
    const state = mySetsReducer(mySetsInitialState, loadMySetsFailure({ errorMessage: 'Boom' }));

    expect(state.errorMessage).toBe('Boom');
    expect(state.sets).toBe(mySetsInitialState.sets);
  });

  it('resets to the initial state on logout', () => {
    const populated = mySetsReducer(mySetsInitialState, loadMySetsSuccess({ sets: [], pagesCount: 5, pageNumber: 3 }));

    const state = mySetsReducer(populated, logout());

    expect(state).toEqual(mySetsInitialState);
  });
});
