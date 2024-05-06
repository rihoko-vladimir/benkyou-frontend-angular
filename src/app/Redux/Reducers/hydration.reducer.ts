import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import RootState from '../app.state';

export const hydrationMetaReducer = (reducer: ActionReducer<RootState>): ActionReducer<RootState> => {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState, unnecessaryStateRemover));
    Object.keys(nextState);
    return nextState;
  };
};

const unnecessaryStateRemover = (key: string, value: RootState) => {
  switch (key) {
    case 'setStudy':
      return undefined;
    case 'snackbar':
      return undefined;
    case 'account':
      return Object.assign({}, value);
    default:
      return value;
  }
};
