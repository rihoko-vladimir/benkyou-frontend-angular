import Set from './Set';
import Kanji from './Kanji';

describe('Set', () => {
  it('defaults every field and provides three empty kanji', () => {
    const set = new Set();

    expect(set.id).toBe('');
    expect(set.name).toBe('');
    expect(set.description).toBe('');
    expect(set.authorName).toBe('');
    expect(set.authorId).toBe('');
    expect(set.kanjiList.length).toBe(3);
    set.kanjiList.forEach(kanji => expect(kanji).toEqual(new Kanji()));
  });

  it('assigns every constructor argument', () => {
    const kanjiList = [new Kanji('一', ['いち'], ['イチ'])];

    const set = new Set('set-1', 'Kanji set', 'A description', 'Taro', 'user-1', kanjiList);

    expect(set.id).toBe('set-1');
    expect(set.name).toBe('Kanji set');
    expect(set.description).toBe('A description');
    expect(set.authorName).toBe('Taro');
    expect(set.authorId).toBe('user-1');
    expect(set.kanjiList).toBe(kanjiList);
  });
});
