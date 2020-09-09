import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

declare const window: any;

import { AppService } from './app.service';
import { RestService } from './rest.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profile: any = {};
  private serverProfile: any = {};
  private adParamsSent = false;

  constructor(
    private appService: AppService,
    private restService: RestService,
    private logger: LoggerService
  ) { }

  getProfile() {
    return this.restService.get(this.appService.getEnvVariable('API_HOST') + '/my_profile').pipe(
      tap((res) => {
        this.profile = res;
        // this.profile.sound = typeof this.profile.sound === 'undefined' ? true : this.profile.sound;
        this.appService.setAppLanguage(this.profile.language);
        this.appService.setUserPhoneNo(this.profile.phoneNo);
        if (window.AD_USER && !this.adParamsSent) {
          window.AD_USER.city = '' + res.city + ';' + res.region;
          this.logger.log('Adid passed to JioAds' + JSON.stringify(window.AD_USER));
          this.adParamsSent = true;
        }
      })
    );
  }

  getProfileSync() {
    return this.profile;
  }

  updateProfile(profile) {
    return this.restService
      .put(this.appService.getEnvVariable('API_HOST') + '/my_profile', profile)
      .pipe(tap((updates) => Object.assign(this.profile, updates)));
  }

  getServerProfile() {
    return this.restService
      .get(this.appService.getEnvVariable('PROFILE_API_HOST') + '/users/my_profile')
      .pipe(
        tap((res) => {
          this.serverProfile = res;
          this.appService.setAppLanguage(this.profile.language);
          if (window.AD_USER) {
            window.AD_USER.city = '' + res.city + ';' + res.region;
            window.AD_USER.state = res.state;
            window.AD_USER.gender = res.gender;
            window.AD_USER.age = res.ageGroup;
            this.logger.log('Adid passed to JioAds' + JSON.stringify(window.AD_USER));
          }
        })
      );
  }

  getServerProfileSync() {
    return this.serverProfile;
  }

  updateServerProfile(profile) {
    return this.restService
      .post(this.appService.getEnvVariable('PROFILE_API_HOST') + '/users/my_profile', profile)
      .pipe(tap((updates) => Object.assign(this.serverProfile, updates)));
  }
}
