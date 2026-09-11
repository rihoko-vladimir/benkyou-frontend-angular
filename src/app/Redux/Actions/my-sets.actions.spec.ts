import { createNewSetSuccess, loadMySetsFailure, loadMySetsSuccess } from './my-sets.actions';
import Set from '../../Models/Set';

describe('my-sets.actions', () => {
  it('loadMySetsSuccess carries sets, pagesCount and pageNumber', () => {
    const sets = [new Set('1', 'Set 1')];

    const action = loadMySetsSuccess({ sets, pagesCount: 3, pageNumber: 1 });

    expect(action.type).toBe('[My Sets Page] Load My Sets Success');
    expect(action.sets).toBe(sets);
    expect(action.pagesCount).toBe(3);
    expect(action.pageNumber).toBe(1);
  });

  it('loadMySetsFailure carries an errorMessage', () => {
    const action = loadMySetsFailure({ errorMessage: 'Boom' });

    expect(action.type).toBe('[My Sets Page] Load My Sets Failure');
    expect(action.errorMessage).toBe('Boom');
  });

  it('createNewSetSuccess carries the created set', () => {
    const set = new Set('1', 'Set 1');

    const action = createNewSetSuccess({ set });

    expect(action.type).toBe('[My Sets Page] Create My Sets Success');
    expect(action.set).toBe(set);
  });
});
