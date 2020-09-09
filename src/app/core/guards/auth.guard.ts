import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { of, forkJoin } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import {
  AuthService,
  TambolaService,
  ExternalInterfaceService,
  ProfileService,
  RestService,
  AppService
} from './../services';

@Injectable()
export class AuthGuard implements CanActivate {
  digitalData;
  apiStats = {
    url: '',
    httpstatus: '',
    method: '',
    responseTime: 0,
    startTime: '',
    endTime: '',
    activity: ''
  };

  constructor(
    private router: Router,
    private externalInterfaceService: ExternalInterfaceService,
    private authService: AuthService,
    private tambolaService: TambolaService,
    private profileService: ProfileService,
    private restService: RestService,
    private appService: AppService
  ) {
    this.digitalData = {
      utmSource: this.getParameterByName('utm_source'),
      utmMedium: this.getParameterByName('utm_medium'),
      utmCampaign: this.getParameterByName('utm_campaign'),
      utmContent: this.getParameterByName('utm_content'),
      utmTerm: this.getParameterByName('utm_term')
    };
    localStorage.setItem('digitalData', JSON.stringify(this.digitalData));
  }

  canActivate(route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot) {
    if (this.authService.getIsAuthenticated()) {
      return true;
    }
    return this.authService.login().pipe(
      switchMap(() => {
        const end = new Date(new Date);
        this.apiStats.startTime = this.authService.startTime;
        this.apiStats.endTime = end.toISOString();
        this.apiStats.method = 'end';
        this.apiStats.activity = 'login';
        return this.handleApiStatus(this.apiStats);
      }),
      switchMap(() => this.tambolaService.getConfiguration()),
      switchMap(() =>
        forkJoin([
          this.profileService.getProfile(),
          this.profileService.getServerProfile(),
          this.dailyStats(),
          // this.loginUat()
        ])
      ),
      switchMap(([profile, serverProfile]) => {
        this.router.navigate(['/splash']);
        // if ([true, 'true'].includes(profile.TnC)) {
        //   if (serverProfile['nickName']) {
        //     this.router.navigate(['/tambola']);
        //   } else {
        //     this.router.navigate(['/profile-capture']);
        //   }
        // } else {
        //   this.router.navigate(['/splash']);
        // }
        return of(true);
      }),
      catchError(e => {
        if (e.status === 404) {
          this.router.navigate(['/splash']);
          return of(true);
        } else {
          this.externalInterfaceService.requestJWT();
          return of(false);
        }
      })
    );
  }


  handleApiStatus(data) {
    return this.restService
      .post(this.appService.getEnvVariable('API_HOST') + '/stats',
        {
          url: data.url,
          httpstatus: data.httpstatus,
          method: data.method,
          responseTime: data.responseTime,
          startTime: data.startTime,
          endTime: data.endTime,
          activity: data.activity
        });
  }

  dailyStats() {
    return this.restService.post(this.appService.getEnvVariable('API_HOST') + '/dailystats', {

    });
  }

  // loginUat() {
  //   return this.restService.post(this.appService.getEnvVariable('LOGIN_UAT') + '/login', {

  //   });
  // }

  public getParameterByName(name, url?) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
