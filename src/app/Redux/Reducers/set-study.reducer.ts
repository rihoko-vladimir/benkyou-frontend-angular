import {createReducer, on} from "@ngrx/store";
import {nextKanji, startStudying} from "../Actions/set-study.actions";
import Kanji from "../../Models/Kanji";
import Answer from "../../Models/Answer";

export interface IStudyState {
  currentStep: number,
  kanjiList: Kanji[],
  answerList: Answer[]
}

export const initialState: IStudyState = {
  currentStep: 0,
  kanjiList: [],
  answerList: []
}

export const setStudyReducer = createReducer(
  initialState,
  on(startStudying, (state, {set}) =>
    ({currentStep: 0, answerList: [], kanjiList: set.kanjiList})),
  on(nextKanji, (state) =>
    ({...state, currentStep: state.currentStep + 1})))
