import { finishStudying, nextKanji, startStudying } from './set-study.actions';
import Set from '../../Models/Set';
import Kanji from '../../Models/Kanji';
import Answer from '../../Models/Answer';

describe('set-study.actions', () => {
  it('startStudying carries the set to study', () => {
    const set = new Set('1', 'Set 1');

    const action = startStudying({ set });

    expect(action.type).toBe('[Study page] Start studying');
    expect(action.set).toBe(set);
  });

  it('nextKanji carries the given answer', () => {
    const answer = new Answer(new Kanji('一', ['いち'], ['イチ']), ['いち']);

    const action = nextKanji({ answer });

    expect(action.type).toBe('[Study page] Next kanji');
    expect(action.answer).toBe(answer);
  });

  it('finishStudying has no payload', () => {
    expect(finishStudying().type).toBe('[Study page] Finish studying');
  });
});
