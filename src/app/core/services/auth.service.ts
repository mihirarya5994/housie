import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AppService } from './app.service';
import { RestService } from './rest.service';
import { LocalStorageService } from './local-storage.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private isAuthenticated = false;
  private appQuery: any = {};
  private authInfo = null;
  startTime;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private localStorageService: LocalStorageService,
    private util: UtilService,
  ) {
  }

  setAuthInfo(info) {
    this.localStorageService.addItem('userInfo', info);
    this.authInfo = info;
  }

  getAuthInfo() {
    return this.authInfo || this.localStorageService.getItem('userInfo');
  }

  setAppQuery(query) {
    this.appQuery = query;
  }

  setIsAuthenticated(bool) {
    this.isAuthenticated = bool;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthToken() {
    return this.token;
  }

  login() {
    const jwt = this.appQuery.jwt;
    const host = this.appQuery.host;
    this.token =
      jwt && jwt !== 'null'
        ? jwt
        : this.getAuthInfo()
          ? this.getAuthInfo().jwt
          : null;
    if (this.token) {
      const start = new Date(new Date);
      this.startTime = start.toISOString();
      return this.restService
        .post(this.appService.getEnvVariable('API_HOST') + '/login', { host })
        .pipe(
          map(() => ({
            ...this.util.parseJWT(this.token),
            jwt: this.token,
            host,
          })),
          tap(authInfo => {
            this.setAuthInfo(authInfo);
            this.setIsAuthenticated(true);
          })
        );
    } else {
      return throwError(new Error('NO_JWT'));
    }
  }

  logout() {
    this.setAuthInfo(null);
    this.setIsAuthenticated(false);
  }
}
