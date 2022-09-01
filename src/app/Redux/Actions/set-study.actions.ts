import {createAction, props} from "@ngrx/store";
import Set from "../../Models/Set";
import Answer from "../../Models/Answer";

export const startStudying = createAction(
  "[Study page] Start studying",
  props<{set : Set}>()
)

export const nextKanji = createAction(
  "[Study page] Next kanji",
  props<{answer : Answer}>()
)

export const finishStudying = createAction(
  "[Study page] Finish studying"
)
