import {createAction, props} from "@ngrx/store";
import Set from "../../Models/Set";

export const startStudying = createAction(
  "[Study page] Start studying",
  props<{set : Set}>()
)

export const nextKanji = createAction(
  "[Study page] Next kanji"
)

export const finishStudying = createAction(
  "[Study page] Finish studying"
)
