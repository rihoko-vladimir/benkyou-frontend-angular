import {SetResponse} from "./SetResponse";

export interface PagedSetsResponse{
  currentPage : number,
  pagesCount : number,
  setsCount : number
  sets : SetResponse[]
}
