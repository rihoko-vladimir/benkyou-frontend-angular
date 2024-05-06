import { createAction, props } from '@ngrx/store';
import Set from '../../Models/Set';

export const loadAllSetsSuccess = createAction(
  '[All Sets Page] Load All Sets Success',
  props<{ sets: Set[]; pagesCount: number; pageNumber: number }>()
);

export const loadAllSetsFailure = createAction(
  '[All Sets Page] Load All Sets Failure',
  props<{ errorMessage: string }>()
);
