import Kanji from './Kanji';

export default class Answer {
  kanji: Kanji;
  selectedKunyomi: string[];
  selectedOnyomi: string[];

  constructor(kanji: Kanji, kunyomi: string[] = [], onyomi: string[] = []) {
    this.selectedKunyomi = kunyomi;
    this.selectedOnyomi = onyomi;
    this.kanji = kanji;
  }
}
