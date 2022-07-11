import {Injectable} from "@angular/core";
import {IMySetsService} from "./Interfaces/my-sets.service";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../Constants/AppConfiguration";
import {Store} from "@ngrx/store";
import {AppState} from "../Redux/app.state";
import {SetRequest} from "../Models/Requests/SetRequest";
import Set from "../Models/Set";
import {SetResponse} from "../Models/Responses/SetResponse";

@Injectable()

export class MySetsService implements IMySetsService{

  constructor(private httpClient: HttpClient, private appConfig: AppConfiguration, private store: Store<AppState>) {
  }

  createSet(setRequest: SetRequest): void {
    this.httpClient.post<SetResponse>(`${this.appConfig.apiEndpoint}/sets/create`, setRequest, {
      withCredentials: true
    })
  }

  getMySets(pageNumber: number, pageSize: number): void {
  }

  patchMySet(setId: string, newSet: Set): void {
  }

  removeMySet(setId: string): void {
  }

}
