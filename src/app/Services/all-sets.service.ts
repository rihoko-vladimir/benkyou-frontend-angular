import {Injectable} from "@angular/core";
import {IAllSetsService} from "./Interfaces/all-sers.service";
import {catchError, EMPTY, map} from "rxjs";
import Set from "../Models/Set"
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../Constants/AppConfiguration";
import {PagedSetsResponse} from "../Models/Responses/PagedSetsResponse";
import Kanji from "../Models/Kanji";
import {Store} from "@ngrx/store";
import AppState from "../Redux/app.state";
import {loadAllSetsFailure, loadAllSetsSuccess} from "../Redux/Actions/all-sets.actions";

@Injectable()

export class AllSetsService implements IAllSetsService {
  constructor(private httpClient: HttpClient, private appConfig: AppConfiguration, private store: Store<AppState>) {
  }

  getAllSets(pageNumber: number, pageSize: number, searchQuery?: string): void {
    this.httpClient.get<PagedSetsResponse>(`${this.appConfig.apiEndpoint}/sets/all-sets?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        withCredentials: true
      }).pipe(
      map(pagedResponse => ({
          sets: pagedResponse.sets.map(setResponse =>
            new Set(setResponse.id, setResponse.name, setResponse.description, "", setResponse.authorId,
              setResponse.kanjiList.map(kanjiResponse =>
                new Kanji(kanjiResponse.kanjiChar,
                  kanjiResponse.kunyomiReadings.map(kunyomiResponse => kunyomiResponse.reading),
                  kanjiResponse.onyomiReadings.map(onyomiResponse => onyomiResponse.reading))))),
          pagesCount: pagedResponse.pagesCount,
          currentPage: pagedResponse.currentPage
        }),
        catchError((error) => {
          this.store.dispatch(loadAllSetsFailure({errorMessage: error}))
          return EMPTY
        }))
    ).subscribe(response => {
      this.store.dispatch(loadAllSetsSuccess({
        sets: response.sets,
        pageNumber: response.currentPage,
        pagesCount: response.pagesCount,
      }))
    });
  }

}
