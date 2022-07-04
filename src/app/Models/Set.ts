import Kanji from "./Kanji";

export default class Set {
  id: string;
  name: string;
  description: string;
  authorName: string;
  authorId: string;
  kanjiList: Kanji[]


  constructor(id: string, name: string, description: string, authorName: string, authorId: string, kanjiList: Kanji[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.authorName = authorName;
    this.authorId = authorId;
    this.kanjiList = kanjiList;
  }
}
