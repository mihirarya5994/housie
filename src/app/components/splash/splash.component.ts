import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

import {
  AppService,
  ExternalInterfaceService,
  ProfileService,
  TambolaService,
  EventEmitterService,
  AnalyticsService
} from '../../core';

import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('inner', { static: false }) inner: ElementRef;
  centralProfile: any = {};
  serverProfile: any = {};
  presenters = [];
  sponsors = [];
  tnc = false;
  loading = true;
  apiStats = {
    url: '',
    httpstatus: '',
    method: '',
    responseTime: 0,
    startTime: '',
    endTime: '',
    activity: ''
  };
  private timeoutId = null;

  constructor(
    private router: Router,
    private appService: AppService,
    private profileService: ProfileService,
    private tambolaService: TambolaService,
    private externalInterfaceService: ExternalInterfaceService,
    private activatedRoute: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {
    const start = new Date(new Date);
    this.apiStats.startTime = start.toISOString();
    this.apiStats.method = 'start';
    this.apiStats.activity = 'splash';
  }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2 | Loading Screen'
    );
    this.presenters = this.tambolaService.getGameConfig().presenters || [];
    this.sponsors = this.tambolaService.getGameConfig().sponsors || [];
    this.loading = false;
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/tambola'], {
        relativeTo: this.activatedRoute
      });
    }, 3000);
  }

  ngAfterViewInit() {
    const end = new Date(new Date);
    this.apiStats.endTime = end.toISOString();
    this.apiStats.method = 'end';
    this.apiStats.activity = 'splash';
    this.handleApiStatus(this.apiStats);
    this.inner.nativeElement.style.transition = `width ${environment.SPLASH_DURATION /
      1000}s linear;`;
    setTimeout(() => (this.inner.nativeElement.style.width = '100%'), 0);
  }

  navigateTo(link) {
    switch (link) {
      case 'game':
        if (!this.serverProfile.TnC) {
          this.profileService.updateProfile({ TnC: true }).subscribe();
        }
        if (this.centralProfile && this.centralProfile['nickName']) {
          this.router.navigate(['/tambola']);
        } else {
          this.router.navigate(['/profile-capture']);
        }
        break;
      case 'tnc':
        this.externalInterfaceService.launchBrowser(
          this.appService.getEnvVariable('TNC_URL')
        );
        break;
    }
  }

  // acceptTnC() {
  //   this.profileService.updateProfile({ TnC: true }).subscribe();
  //   this.tnc = true;
  // }

  handleApiStatus(data) {
    this.tambolaService.apiStats(data).subscribe((res: any) => {
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
