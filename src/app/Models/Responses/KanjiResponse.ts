import {ReadingResponse} from "./ReadingResponse";

export interface KanjiResponse{
  kanjiChar : string,
  kunyomiReadings : ReadingResponse[],
  onyomiReadings : ReadingResponse[]
}
