import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  RouterService,
  RouteInfo,
  EventEmitterService,
  EventData,
  AnalyticsService
} from 'src/app/core';
import { APP_EVENTS } from './../../../constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  navLinks = [
    {
      id: 1,
      title: 'Home',
      icon: 'home.svg',
      hoverIcon: 'home_active.svg',
      route: 'events'
    },
    {
      id: 2,
      title: 'Prizes',
      icon: 'prize.svg',
      hoverIcon: 'prize_active.svg',
      route: 'prizes'
    },
    {
      id: 3,
      title: 'Settings',
      icon: 'settings.svg',
      hoverIcon: 'settings_active.svg',
      route: 'settings'
    }
  ];
  activeNav;
  showPrizeWinNotificationIcon = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routerService: RouterService,
    private eventEmitterService: EventEmitterService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    const { url } = this.router;
    this.setActiveNav({ url });
    this.routerService.getRouterState().subscribe((state: RouteInfo) => {
      this.setActiveNav(state);
    });
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.REFRESH_PRIZES) {
        this.showPrizeWinNotificationIcon = true;
      }
    });
  }

  setActiveNav(state) {
    let activatedLink;
    activatedLink = this.navLinks.filter(l => state.url.indexOf(l.route) >= 0);
    if (activatedLink[0]) {
      this.activeNav = activatedLink[0];
    } else {
      this.activeNav = this.navLinks[0];
    }

    if (this.activeNav.id === 2) {
      this.showPrizeWinNotificationIcon = false;
    }
  }

  navigateTo(link) {
    this.analyticsService.clickTrack(
      'Footer | ' + link.title,
      'Jio Tambola 2 | Home Page'
    );
    if (link.id === 2) {
      this.showPrizeWinNotificationIcon = false;
    }
    this.router.navigate([link.route], { relativeTo: this.activatedRoute });
    this.activeNav = link;
  }
}
