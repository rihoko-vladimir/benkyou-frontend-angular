import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import AppState from '../app.state';
import { hydrationMetaReducer } from './hydration.reducer';

describe('hydrationMetaReducer', () => {
  const storageKey = 'state';

  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => (key in storage ? storage[key] : null));
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      storage[key] = String(value);
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
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
    const reducer = vi.fn().mockReturnValue(nextState) as unknown as ActionReducer<AppState>;
    return { meta: hydrationMetaReducer(reducer), reducer: reducer as ReturnType<typeof vi.fn> };
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
