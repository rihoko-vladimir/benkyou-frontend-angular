import {KanjiResponse} from "./KanjiResponse";

export interface SetResponse{
  id : string,
  authorId : string,
  name : string,
  description : string,
  kanjiList : KanjiResponse[]
}
