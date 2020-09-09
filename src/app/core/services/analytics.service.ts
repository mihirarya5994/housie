import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { LoggerService } from './logger.service';

declare const dataLayer: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private appService: AppService,
    private router: Router,
    private logger: LoggerService
  ) { }


  pageLoad(pageUrl, pageTitle) {
    let pageData: any = {};
    try {
      pageData = {
        event: 'virtualPageView',
        virtualPageURL: this.router.url,
        virtualPageTitle: pageTitle,
        appName: 'Jio Tambola 2.0',
        env: this.appService.getEnvVariable('ENV')
      };
      dataLayer.push(pageData);
    } catch (e) {
      this.logger.error('Error tracking Page');
    }
  }

  clickTrack(action, label) {
    let linkData: any = {};
    try {
      linkData = {
        new_Category: 'Jio Tambola 2',
        new_Label: label,
        new_Action: action,
        event: 'jioTambola2'
      };
      dataLayer.push(linkData);
    } catch (e) {
      this.logger.error('Error tracking Link');
    }
  }
}
