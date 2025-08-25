import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserConfiguration } from '../lib/types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {
  private urlDaApi = import.meta.env.NG_APP_URL_DA_API;
  private urlDoModel = `${this.urlDaApi}/api/UserConfiguration`;

  constructor(
    private httpClient: HttpClient
  ) { }

  getUserConfiguration(): Observable<UserConfiguration> {
    return this.httpClient.get<UserConfiguration>(this.urlDoModel, { withCredentials: true });
  }

  putUserConfiguration(config: UserConfiguration): Observable<UserConfiguration> {
    return this.httpClient.put<UserConfiguration>(this.urlDoModel, config, { withCredentials: true });
  }
}
