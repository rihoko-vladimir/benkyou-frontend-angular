import { Injectable } from '@angular/core';
import { IAppConfiguration } from './IAppConfiguration';

@Injectable({
  providedIn: 'root'
})
export class AppConfiguration implements IAppConfiguration {
  public apiEndpoint = 'http://localhost:3080';
}
