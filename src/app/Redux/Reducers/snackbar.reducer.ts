import {createReducer, on} from "@ngrx/store";
import {
  addSetSuccess,
  createSetSuccess,
  dismissSnackbar,
  removeSetSuccess,
  visibilityChangeSuccess
} from "../Actions/snackbar.actions";

export interface ISnackbarState {
  isShown : boolean,
  message : string
}

const initialState : ISnackbarState = {
  isShown : false,
  message : ""
}

export const snackbarReducer = createReducer(initialState,
  on(addSetSuccess, () => ({
    isShown : true,
    message : "Set was successfully added to your list"
  })),
  on(createSetSuccess, () => ({
    isShown : true,
    message : "Set was created successfully"
  })),
  on(removeSetSuccess, () => ({
    isShown : true,
    message : "Set was removed successfully"
  })),
  on(visibilityChangeSuccess, () => ({
    isShown : true,
    message : "Visibility changed successfully"
  })),
  on(dismissSnackbar, () => ({
    isShown : false,
    message : ""
  }))
)
