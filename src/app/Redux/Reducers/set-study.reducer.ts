import {createReducer, on} from "@ngrx/store";
import {finishStudying, nextKanji, startStudying} from "../Actions/set-study.actions";
import Kanji from "../../Models/Kanji";
import Answer from "../../Models/Answer";
import {logout} from "../Actions/account.actions";

export interface IStudyState {
  currentStep: number,
  length: number,
  currentKanji: Kanji,
  currentRandomReadings: string[],
  kanjiList: Kanji[],
  answerList: Answer[]
}

export const initialState: IStudyState = {
  currentStep: 0,
  length: 0,
  currentKanji: new Kanji(),
  currentRandomReadings: [],
  kanjiList: [],
  answerList: []
}

export const setStudyReducer = createReducer(
  initialState,
  on(startStudying, (state, {set}) => {
    const randomizedList = set.kanjiList
      .map(value => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value)

    const randomReadings = getRandomizedReadings(randomizedList, 0)

    console.log(randomizedList)

    return {
      kanjiList: randomizedList,
      currentStep: 0,
      length: randomizedList.length,
      currentRandomReadings: randomReadings,
      currentKanji: randomizedList[0],
      answerList: [],
    }
  }),
  on(nextKanji, (state, {answer}) => {
    const newAnswerList = [...state.answerList]
    newAnswerList.push(answer)
    console.log(newAnswerList)
    const nextStep = state.currentStep + 1
    if (nextStep != state.length)
      return {
        ...state,
        currentStep: nextStep,
        answerList: newAnswerList,
        currentRandomReadings: getRandomizedReadings(state.kanjiList, nextStep),
        currentKanji: state.kanjiList[nextStep],
      }
    return {
      ...state,
      answerList: newAnswerList,
      currentStep: nextStep,
    }
  }),
  on(finishStudying, (_) => initialState),
  on(logout, () => initialState))


const getRandomizedReadings = (kanjiList: Kanji[], currentIndex: number) => {
  const kanjiListCopy = [...kanjiList]
  const correctReadings = [
    ...kanjiListCopy[currentIndex].kunyomi,
    ...kanjiListCopy[currentIndex].onyomi]
  kanjiListCopy.splice(currentIndex, 1)
  let incorrectReadings: string[]
  let firstRandomKanjiIndex: number = Math.floor(Math.random() * kanjiListCopy.length)
  let firstRandomKanji = kanjiListCopy.splice(firstRandomKanjiIndex, 1)[0]
  let secondRandomKanjiIndex: number = Math.floor(Math.random() * kanjiListCopy.length)
  let secondRandomKanji = kanjiListCopy.splice(secondRandomKanjiIndex, 1)[0]
  incorrectReadings = [
    ...firstRandomKanji.kunyomi,
    ...firstRandomKanji.onyomi,
    ...secondRandomKanji.kunyomi,
    ...secondRandomKanji.onyomi
  ]

  return [...correctReadings, ...incorrectReadings]
    .map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}
