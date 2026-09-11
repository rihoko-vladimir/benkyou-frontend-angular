import Kanji from './Kanji';

describe('Kanji', () => {
  it('defaults to an empty character with no readings', () => {
    const kanji = new Kanji();

    expect(kanji.kanji).toBe('');
    expect(kanji.kunyomi).toEqual([]);
    expect(kanji.onyomi).toEqual([]);
  });

  it('assigns every constructor argument', () => {
    const kunyomi = ['いち', 'ひと'];
    const onyomi = ['イチ', 'イツ'];

    const kanji = new Kanji('一', kunyomi, onyomi);

    expect(kanji.kanji).toBe('一');
    expect(kanji.kunyomi).toBe(kunyomi);
    expect(kanji.onyomi).toBe(onyomi);
  });
});
