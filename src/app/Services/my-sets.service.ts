import {Injectable} from "@angular/core";
import {IMySetsService} from "./Interfaces/my-sets.service";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../Constants/AppConfiguration";
import {Store} from "@ngrx/store";
import AppState from "../Redux/app.state";
import Set from "../Models/Set";
import {SetResponse} from "../Models/Responses/SetResponse";
import {PagedSetsResponse} from "../Models/Responses/PagedSetsResponse";
import {catchError, EMPTY, map} from "rxjs";
import {loadMySetsFailure, loadMySetsSuccess} from "../Redux/Actions/my-sets.actions";
import Kanji from "../Models/Kanji";
import {SetRequest} from "../Models/Requests/SetRequest";
import {KanjiRequest} from "../Models/Requests/KanjiRequest";
import {ReadingResponse} from "../Models/Responses/ReadingResponse";

@Injectable()

export class MySetsService implements IMySetsService {

  constructor(private httpClient: HttpClient, private appConfig: AppConfiguration, private store: Store<AppState>) {
  }

  createSet(set: Set): void {
    const request: SetRequest = {
      name: set.name,
      description: set.description,
      kanjiList: set.kanjiList.map(kanji => {
        const kunyomi = kanji.kunyomi.map(kunyomiReading => {
          const reading: ReadingResponse = {reading: kunyomiReading}
          return reading
        })
        const onyomi = kanji.onyomi.map(onyomiReading => {
          const reading: ReadingResponse = {reading: onyomiReading}
          return reading
        })
        const request: KanjiRequest = {kanjiChar: kanji.kanji, kunyomiReadings: kunyomi, onyomiReadings: onyomi}
        return request
      }),

    }
    this.httpClient.post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, request, {
      withCredentials: true
    })
      .pipe(
        map((setResponse =>
          new Set(setResponse.id, setResponse.name, setResponse.description, "", setResponse.authorId,
            setResponse.kanjiList.map(kanjiResponse =>
              new Kanji(kanjiResponse.kanjiChar,
                kanjiResponse.kunyomiReadings.map(kunyomiResponse => kunyomiResponse.reading),
                kanjiResponse.onyomiReadings.map(onyomiResponse => onyomiResponse.reading)))))),
        catchError(error => {
          this.store.dispatch(loadMySetsFailure({errorMessage: error}))
          return EMPTY
        })
      )
      .subscribe(() => {
        this.getMySets(1, 9)
      })
  }

  getMySets(pageNumber: number, pageSize: number): void {
    this.httpClient.get<PagedSetsResponse>(`${this.appConfig.apiEndpoint}/sets/my-sets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        withCredentials: true
      })
      .pipe(
        map((pagedResponse) => ({
            sets: pagedResponse.sets.map(setResponse =>
              new Set(setResponse.id, setResponse.name, setResponse.description, "", setResponse.authorId,
                setResponse.kanjiList.map(kanjiResponse =>
                  new Kanji(kanjiResponse.kanjiChar,
                    kanjiResponse.kunyomiReadings.map(kunyomiResponse => kunyomiResponse.reading),
                    kanjiResponse.onyomiReadings.map(onyomiResponse => onyomiResponse.reading))))),
            pagesCount: pagedResponse.pagesCount,
            currentPage: pagedResponse.currentPage
          }),
          catchError(error => {
            this.store.dispatch(loadMySetsFailure({errorMessage: error}))
            return EMPTY
          })
        )).subscribe(value => {
      this.store.dispatch(loadMySetsSuccess({
        sets: value.sets,
        pagesCount: value.pagesCount,
        pageNumber: value.currentPage
      }))
    })
  }

  patchMySet(setId: string, newSet: Set): void {
  }

  removeMySet(setId: string): void {

  }

}
