import Kanji from '../../Models/Kanji';
import Set from '../../Models/Set';
import { KanjiRequest } from '../../Models/Requests/KanjiRequest';
import { SetRequest } from '../../Models/Requests/SetRequest';
import { KanjiResponse } from '../../Models/Responses/KanjiResponse';
import { SetResponse } from '../../Models/Responses/SetResponse';
import { mapKanjiResponseToKanji, mapKanjiToKanjiRequest, mapSetResponseToSet, mapSetToSetRequest } from './converters';

describe('converters', () => {
  describe('mapKanjiResponseToKanji', () => {
    it('maps a KanjiResponse to a Kanji, unwrapping reading objects', () => {
      const response: KanjiResponse = {
        kanjiChar: '一',
        kunyomiReadings: [{ reading: 'いち' }, { reading: 'ひと' }],
        onyomiReadings: [{ reading: 'イチ' }]
      };

      const kanji = mapKanjiResponseToKanji(response);

      expect(kanji).toEqual(new Kanji('一', ['いち', 'ひと'], ['イチ']));
    });

    it('maps empty reading lists to empty arrays', () => {
      const response: KanjiResponse = { kanjiChar: '二', kunyomiReadings: [], onyomiReadings: [] };

      expect(mapKanjiResponseToKanji(response)).toEqual(new Kanji('二', [], []));
    });
  });

  describe('mapSetResponseToSet', () => {
    it('maps a SetResponse to a Set, leaving authorName empty', () => {
      const response: SetResponse = {
        id: 'set-1',
        authorId: 'user-1',
        name: 'Kanji set',
        description: 'A description',
        kanjiList: [
          { kanjiChar: '一', kunyomiReadings: [{ reading: 'いち' }], onyomiReadings: [] },
          { kanjiChar: '二', kunyomiReadings: [{ reading: 'に' }], onyomiReadings: [{ reading: 'ニ' }] }
        ]
      };

      const set = mapSetResponseToSet(response);

      expect(set).toEqual(
        new Set('set-1', 'Kanji set', 'A description', '', 'user-1', [
          new Kanji('一', ['いち'], []),
          new Kanji('二', ['に'], ['ニ'])
        ])
      );
      expect(set.authorName).toBe('');
    });
  });

  describe('mapKanjiToKanjiRequest', () => {
    it('maps a Kanji to a KanjiRequest, wrapping each reading', () => {
      const kanji = new Kanji('一', ['いち', 'ひと'], ['イチ']);

      const request = mapKanjiToKanjiRequest(kanji);

      expect(request).toEqual({
        kanjiChar: '一',
        kunyomiReadings: [{ reading: 'いち' }, { reading: 'ひと' }],
        onyomiReadings: [{ reading: 'イチ' }]
      } satisfies KanjiRequest);
    });
  });

  describe('mapSetToSetRequest', () => {
    it('maps a Set to a SetRequest dropping id and author fields', () => {
      const set = new Set('set-1', 'Kanji set', 'A description', 'Author Name', 'user-1', [
        new Kanji('一', ['いち'], []),
        new Kanji('二', ['に'], ['ニ'])
      ]);

      const request = mapSetToSetRequest(set);

      expect(request).toEqual({
        name: 'Kanji set',
        description: 'A description',
        kanjiList: [
          { kanjiChar: '一', kunyomiReadings: [{ reading: 'いち' }], onyomiReadings: [] },
          { kanjiChar: '二', kunyomiReadings: [{ reading: 'に' }], onyomiReadings: [{ reading: 'ニ' }] }
        ]
      } satisfies SetRequest);
    });
  });

  describe('Set default kanjiList', () => {
    it('defaults kanjiList to three empty Kanji', () => {
      const set = new Set();

      expect(set.kanjiList.length).toBe(3);
      set.kanjiList.forEach(kanji => expect(kanji).toEqual(new Kanji('', [], [])));
    });
  });
});
