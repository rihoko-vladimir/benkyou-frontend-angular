import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import AppState from '../app.state';
import { hydrationMetaReducer } from './hydration.reducer';

describe('hydrationMetaReducer', () => {
  const storageKey = 'state';

  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => (key in storage ? storage[key] : null));
    spyOn(Storage.prototype, 'setItem').and.callFake((key: string, value: string) => {
      storage[key] = String(value);
    });
    spyOn(Storage.prototype, 'removeItem').and.callFake((key: string) => {
      delete storage[key];
    });
  });

  // setStudy and snackbar get dropped on serialization, so their contents are
  // irrelevant to the assertions; only the top-level keys matter.
  const makeMockState = (): AppState =>
    ({
      setStudy: {
        currentStep: 1,
        length: 2,
        currentKanji: {},
        currentRandomReadings: [],
        kanjiList: [],
        answerList: []
      },
      allSets: { sets: [] },
      mySets: { sets: [] },
      account: { id: 'user-1', userName: 'taro' },
      snackbar: { message: 'hello' }
    }) as unknown as AppState;

  const createMetaReducer = (nextState: AppState) => {
    const reducer = jasmine.createSpy('reducer').and.returnValue(nextState) as unknown as ActionReducer<AppState>;
    return { meta: hydrationMetaReducer(reducer), reducer };
  };

  it(`returns the stored state on ${INIT} without touching the reducer or storage`, () => {
    const stored = makeMockState();
    storage[storageKey] = JSON.stringify(stored);
    const { meta, reducer } = createMetaReducer(makeMockState());

    const result = meta(undefined, { type: INIT });

    expect(result).toEqual(stored);
    expect(reducer).not.toHaveBeenCalled();
    expect(storage[storageKey]).toBe(JSON.stringify(stored));
  });

  it(`rehydrates on ${UPDATE} too`, () => {
    storage[storageKey] = JSON.stringify(makeMockState());
    const { meta, reducer } = createMetaReducer(makeMockState());

    const result = meta(undefined, { type: UPDATE });

    expect(result).toEqual(makeMockState());
    expect(reducer).not.toHaveBeenCalled();
  });

  it('discards corrupt stored state and re-serializes the fresh state', () => {
    storage[storageKey] = '{not valid json';
    const nextState = makeMockState();
    const { meta, reducer } = createMetaReducer(nextState);

    const result = meta(undefined, { type: INIT });

    expect(result).toBe(nextState);
    expect(reducer).toHaveBeenCalledTimes(1);
    const persisted = JSON.parse(storage[storageKey] as string);
    expect(persisted.setStudy).toBeUndefined();
    expect(persisted.snackbar).toBeUndefined();
    expect(persisted.account).toBeDefined();
  });

  it('persists the next state for regular actions, dropping setStudy and snackbar', () => {
    const nextState = makeMockState();
    const { meta, reducer } = createMetaReducer(nextState);

    const result = meta(undefined, { type: 'SOME_ACTION' });

    expect(result).toBe(nextState);
    expect(reducer).toHaveBeenCalledTimes(1);
    const persisted = JSON.parse(storage[storageKey] as string);
    expect(persisted.setStudy).toBeUndefined();
    expect(persisted.snackbar).toBeUndefined();
    expect(persisted.account).toBeDefined();
    expect(persisted.allSets).toBeDefined();
    expect(persisted.mySets).toBeDefined();
  });
});
