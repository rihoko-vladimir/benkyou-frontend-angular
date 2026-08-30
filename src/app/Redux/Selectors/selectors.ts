import { createFeatureSelector } from '@ngrx/store';
import { IAccountState } from '../Reducers/account.reducer';
import { ISetsState } from '../Reducers/all-sets.reducer';
import { IStudyState } from '../Reducers/set-study.reducer';
import { ISnackbarState } from '../Reducers/snackbar.reducer';

export const selectAccount = createFeatureSelector<IAccountState>('account');
export const selectAllSets = createFeatureSelector<ISetsState>('allSets');
export const selectMySets = createFeatureSelector<ISetsState>('mySets');
export const selectSetStudy = createFeatureSelector<IStudyState>('setStudy');
export const selectSnackbar = createFeatureSelector<ISnackbarState>('snackbar');
