import { loadAllSetsFailure, loadAllSetsSuccess } from './all-sets.actions';
import Set from '../../Models/Set';

describe('all-sets.actions', () => {
  it('loadAllSetsSuccess carries sets, pagesCount and pageNumber', () => {
    const sets = [new Set('1', 'Set 1')];

    const action = loadAllSetsSuccess({ sets, pagesCount: 3, pageNumber: 1 });

    expect(action.type).toBe('[All Sets Page] Load All Sets Success');
    expect(action.sets).toBe(sets);
    expect(action.pagesCount).toBe(3);
    expect(action.pageNumber).toBe(1);
  });

  it('loadAllSetsFailure carries an errorMessage', () => {
    const action = loadAllSetsFailure({ errorMessage: 'Boom' });

    expect(action.type).toBe('[All Sets Page] Load All Sets Failure');
    expect(action.errorMessage).toBe('Boom');
  });
});
