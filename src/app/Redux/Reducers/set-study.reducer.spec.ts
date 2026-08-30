import Answer from '../../Models/Answer';
import Kanji from '../../Models/Kanji';
import Set from '../../Models/Set';
import { logout } from '../Actions/account.actions';
import { finishStudying, nextKanji, startStudying } from '../Actions/set-study.actions';
import { initialState, setStudyReducer } from './set-study.reducer';

// Note: getRandomizedReadings is not exported, so it is verified through the
// observable behavior of startStudying/nextKanji (currentRandomReadings must
// contain the current kanji's readings plus exactly two distractors, shuffled).

const kanji = (char: string, kunyomi: string[] = [], onyomi: string[] = []) => new Kanji(char, kunyomi, onyomi);

// Three kanji with globally unique readings make reading-set assertions exact.
const studySet = new Set('set-1', 'Study set', '', '', 'user-1', [
  kanji('一', ['いち', 'ひと'], ['イチ', 'イツ']),
  kanji('二', ['に', 'ふた'], ['ニ']),
  kanji('三', ['さん', 'み'], ['サン'])
]);

const allReadings = ['いち', 'ひと', 'イチ', 'イツ', 'に', 'ふた', 'ニ', 'さん', 'み', 'サン'];

describe('setStudyReducer', () => {
  describe('startStudying', () => {
    it('shuffles the kanji list and initializes the study state', () => {
      // Deterministic shuffle keys: 0.9, 0.1, 0.4 ascending -> [二, 三, 一].
      // Enough values are supplied for every Math.random() in the reducer path.
      spyOn(Math, 'random').and.returnValues(0.9, 0.1, 0.4, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5);

      const state = setStudyReducer(initialState, startStudying({ set: studySet }));

      expect(state.kanjiList.map(item => item.kanji)).toEqual(['二', '三', '一']);
      expect(state.currentStep).toBe(0);
      expect(state.length).toBe(3);
      expect(state.currentKanji).toBe(state.kanjiList[0]);
      expect(state.answerList).toEqual([]);
    });

    it('sets currentRandomReadings to the current kanji readings plus two distractors, shuffled', () => {
      const state = setStudyReducer(initialState, startStudying({ set: studySet }));
      const { currentKanji, currentRandomReadings } = state;
      const correctReadings = [...currentKanji.kunyomi, ...currentKanji.onyomi];

      // With exactly 3 kanji the distractors are the other two: all 10 readings.
      expect(currentRandomReadings.length).toBe(10);
      expect([...currentRandomReadings].sort()).toEqual([...allReadings].sort());
      correctReadings.forEach(reading => expect(currentRandomReadings).toContain(reading));
    });

    it('selects exactly two distractor kanji even when more are available', () => {
      const fourKanjiSet = new Set('set-2', 'Four kanji', '', '', 'user-1', [
        kanji('一', ['a']),
        kanji('二', ['b']),
        kanji('三', ['c']),
        kanji('四', ['d'])
      ]);

      const state = setStudyReducer(initialState, startStudying({ set: fourKanjiSet }));
      const { currentKanji, currentRandomReadings } = state;

      expect(currentRandomReadings.length).toBe(3); // 1 correct + 2 distractor readings
      [...currentKanji.kunyomi, ...currentKanji.onyomi].forEach(reading =>
        expect(currentRandomReadings).toContain(reading)
      );
      currentRandomReadings.forEach(reading => expect(['a', 'b', 'c', 'd']).toContain(reading));
    });
  });

  describe('nextKanji', () => {
    it('accumulates answers and advances through the kanji list', () => {
      const started = setStudyReducer(initialState, startStudying({ set: studySet }));
      const answerOne = new Answer(started.currentKanji, ['いち'], ['イチ']);

      const stepOne = setStudyReducer(started, nextKanji({ answer: answerOne }));

      expect(stepOne.currentStep).toBe(1);
      expect(stepOne.currentKanji).toBe(started.kanjiList[1]);
      expect(stepOne.answerList).toEqual([answerOne]);
      expect(stepOne.length).toBe(3);
    });

    it('regenerates randomized readings containing the new current kanji', () => {
      const started = setStudyReducer(initialState, startStudying({ set: studySet }));

      const stepOne = setStudyReducer(started, nextKanji({ answer: new Answer(started.currentKanji) }));

      expect(stepOne.currentRandomReadings.length).toBe(10);
      expect([...stepOne.currentRandomReadings].sort()).toEqual([...allReadings].sort());
      [...stepOne.currentKanji.kunyomi, ...stepOne.currentKanji.onyomi].forEach(reading =>
        expect(stepOne.currentRandomReadings).toContain(reading)
      );
    });

    it('stops advancing once every kanji has been answered', () => {
      const started = setStudyReducer(initialState, startStudying({ set: studySet }));
      let state = started;

      state = setStudyReducer(state, nextKanji({ answer: new Answer(state.currentKanji) }));
      state = setStudyReducer(state, nextKanji({ answer: new Answer(state.currentKanji) }));
      const beforeLast = state;
      state = setStudyReducer(state, nextKanji({ answer: new Answer(state.currentKanji) }));

      expect(state.currentStep).toBe(3);
      expect(state.answerList.length).toBe(3);
      expect(state.currentKanji).toBe(beforeLast.currentKanji);
      expect(state.currentRandomReadings).toEqual(beforeLast.currentRandomReadings);
    });
  });

  describe('finishStudying', () => {
    it('resets the study state to its initial state', () => {
      const started = setStudyReducer(initialState, startStudying({ set: studySet }));

      const state = setStudyReducer(started, finishStudying());

      expect(state).toBe(initialState);
    });
  });

  describe('logout', () => {
    it('resets the study state to its initial state', () => {
      const started = setStudyReducer(initialState, startStudying({ set: studySet }));
      const answered = setStudyReducer(started, nextKanji({ answer: new Answer(started.currentKanji) }));

      const state = setStudyReducer(answered, logout());

      expect(state).toBe(initialState);
    });
  });
});
