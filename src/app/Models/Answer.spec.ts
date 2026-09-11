import Answer from './Answer';
import Kanji from './Kanji';

describe('Answer', () => {
  it('defaults the selected readings to empty arrays', () => {
    const kanji = new Kanji('一', ['いち'], ['イチ']);

    const answer = new Answer(kanji);

    expect(answer.kanji).toBe(kanji);
    expect(answer.selectedKunyomi).toEqual([]);
    expect(answer.selectedOnyomi).toEqual([]);
  });

  it('assigns every constructor argument', () => {
    const kanji = new Kanji('二', ['に'], ['ニ']);
    const selectedKunyomi = ['に'];
    const selectedOnyomi = ['ニ'];

    const answer = new Answer(kanji, selectedKunyomi, selectedOnyomi);

    expect(answer.kanji).toBe(kanji);
    expect(answer.selectedKunyomi).toBe(selectedKunyomi);
    expect(answer.selectedOnyomi).toBe(selectedOnyomi);
  });
});
