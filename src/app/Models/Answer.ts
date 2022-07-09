export default class Answer {
  selectedKunyomi: string[]
  selectedOnyomi: string[]

  constructor(kunyomi: string[] = [], onyomi: string[] = []) {
    this.selectedKunyomi = kunyomi
    this.selectedOnyomi = onyomi
  }
}
