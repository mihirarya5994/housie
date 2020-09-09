import { Injectable } from '@angular/core';

import { ProfileService } from './profile.service';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';

declare let digitalData: any;
declare const _satellite: any;

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private appName = '';
  private marketingData;

  constructor(
    private logger: LoggerService,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  initialize(appName) {
    this.appName = appName;
  }

  trackPage(pageName, status) {
    try {
      const {
        ageGroup,
        state,
        gender
      } = this.profileService.getServerProfileSync();
      digitalData = {
        page: {
          pageName,
          status,
          pageInfo: {
            appName: this.appName
          }
        },
        user: {
          bpid: this.authService.getAuthInfo().customerId,
          ageGroup,
          city: state,
          gender
        },
        campaign: this.getMarketingData()
      };
      _satellite.track('pageLoad');
    } catch (e) {
      this.logger.error('Error tracking pageLoad');
    }
  }

  trackLink(linkName, linkPosition, linkType, sendUserInfo = false) {
    try {
      // digitalData.page.pageName = pageName;
      digitalData.link = {
        linkName,
        linkPosition,
        linkType
      };
      if (sendUserInfo) {
        const {
          ageGroup,
          state,
          gender
        } = this.profileService.getServerProfileSync();
        digitalData.user = {
          ageGroup,
          city: state,
          gender
        };
      }
      _satellite.track('linkTracking');
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }

  private getMarketingData() {
    if (this.marketingData) {
      return this.marketingData;
    }
    this.marketingData = localStorage.getItem('digitalData');
    return this.marketingData ? JSON.parse(this.marketingData) : {};
  }
}
