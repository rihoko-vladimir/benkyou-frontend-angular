import {ReadingResponse} from "./ReadingResponse";

export interface KanjiResponse{
  kanji : string,
  kunyomiReadings : ReadingResponse[],
  onyomiReadings : ReadingResponse[]
}
