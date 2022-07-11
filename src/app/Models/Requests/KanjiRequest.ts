import {ReadingResponse} from "../Responses/ReadingResponse";

export interface KanjiRequest{
  kanjiChar : string,
  kunyomiReadings : ReadingResponse[],
  onyomiReadings : ReadingResponse[]
}
