import {createReducer, on} from "@ngrx/store";
import {finishStudying, nextKanji, startStudying} from "../Actions/set-study.actions";
import Kanji from "../../Models/Kanji";
import Answer from "../../Models/Answer";

export interface IStudyState {
  currentStep: number,
  length : number,
  currentKanji : Kanji,
  currentRandomReadings : string[],
  kanjiList: Kanji[],
  answerList: Answer[]
}

export const initialState: IStudyState = {
  currentStep: 0,
  length : 0,
  currentKanji : new Kanji(),
  currentRandomReadings : [],
  kanjiList: [],
  answerList: []
}

export const setStudyReducer = createReducer(
  initialState,
  on(startStudying, (state, {set}) =>{
    const randomizedList = set.kanjiList
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)

    const randomReadings = getRandomizedReadings(randomizedList, 0)

    console.log(randomizedList)

    return {
      kanjiList : randomizedList,
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
    return {
      ...state,
      currentStep : nextStep,
      answerList: newAnswerList,
      currentRandomReadings: getRandomizedReadings(state.kanjiList, nextStep),
      currentKanji: state.kanjiList[nextStep],
    }
  }),
  on(finishStudying, (_) => initialState))



const getRandomizedReadings = (kanjiList : Kanji[], currentIndex : number) => {
  const correctReadings = [
    ...kanjiList[currentIndex].kunyomi,
    ...kanjiList[currentIndex].onyomi]
  const indexArray = kanjiList.map((value, index) => index)
  indexArray.splice(currentIndex, 1)
  let incorrectReadings : string[]
  let firstRandomKanjiIndex : number = Math.floor(Math.random() * indexArray.length)
  indexArray.splice(firstRandomKanjiIndex, 1)
  let secondRandomKanjiIndex : number = Math.floor(Math.random() * indexArray.length)
  incorrectReadings = [
    ...kanjiList[firstRandomKanjiIndex].kunyomi,
    ...kanjiList[firstRandomKanjiIndex].onyomi,
    ...kanjiList[secondRandomKanjiIndex].kunyomi,
    ...kanjiList[secondRandomKanjiIndex].onyomi
  ]

  return [...correctReadings, ...incorrectReadings]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
