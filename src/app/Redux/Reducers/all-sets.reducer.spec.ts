import { allSetsReducer, allSetsInitialState } from './all-sets.reducer';
import { loadAllSetsFailure, loadAllSetsSuccess } from '../Actions/all-sets.actions';
import { logout } from '../Actions/account.actions';
import Set from '../../Models/Set';

describe('allSetsReducer', () => {
  it('returns the initial state for an unknown action', () => {
    const state = allSetsReducer(undefined, { type: 'unknown' });

    expect(state).toEqual(allSetsInitialState);
  });

  it('populates sets, pagesCount and currentPage on loadAllSetsSuccess, preserving setsCount', () => {
    const sets = [new Set('1', 'Set 1')];

    const state = allSetsReducer(allSetsInitialState, loadAllSetsSuccess({ sets, pagesCount: 4, pageNumber: 2 }));

    expect(state.sets).toBe(sets);
    expect(state.pagesCount).toBe(4);
    expect(state.currentPage).toBe(2);
    expect(state.setsCount).toBe(allSetsInitialState.setsCount);
    expect(state.errorMessage).toBeUndefined();
  });

  it('sets errorMessage on loadAllSetsFailure, keeping the rest of the state', () => {
    const state = allSetsReducer(allSetsInitialState, loadAllSetsFailure({ errorMessage: 'Boom' }));

    expect(state.errorMessage).toBe('Boom');
    expect(state.sets).toBe(allSetsInitialState.sets);
  });

  it('resets to the initial state on logout', () => {
    const populated = allSetsReducer(
      allSetsInitialState,
      loadAllSetsSuccess({ sets: [], pagesCount: 5, pageNumber: 3 })
    );

    const state = allSetsReducer(populated, logout());

    expect(state).toEqual(allSetsInitialState);
  });
});
