import { KanjiRequest } from './KanjiRequest';

export interface SetRequest {
  name: string;
  description: string;
  kanjiList: KanjiRequest[];
}
