export default class Kanji {
  kanji: string;
  kunyomi: string[]
  onyomi: string[]

  constructor(kanji: string = "", kunyomi: string[] = [], onyomi: string[] = []) {
    this.kanji = kanji
    this.kunyomi = kunyomi
    this.onyomi = onyomi
  }
}
