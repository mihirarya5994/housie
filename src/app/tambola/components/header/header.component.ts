import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { filter } from 'rxjs/operators';

import {
  TambolaService,
  RouterService,
  RouteInfo,
  EventEmitterService,
  EventData,
  ExternalInterfaceService,
  RoomService
} from 'src/app/core';

import { APP_EVENTS } from '../../../constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  participantsCount;
  loadingParticipantsCount = true;
  showParticipantsCount = false;
  backTo;
  playerCoins = '';
  coinsSubscription: Subscription;
  playerCoinsSubscription: Subscription;
  showNoCoins;

  constructor(
    private router: Router,
    private location: Location,
    private routerService: RouterService,
    private tambolaService: TambolaService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.coinsSubscription = this.tambolaService.getShowCoins().subscribe((res: any) => {
      this.showNoCoins = res.showCoin;
    });
    this.getPlayerCoin();
    this.playerCoinsSubscription = this.roomService.getCoinsEvent().subscribe((res: any) => {
      this.playerCoins = res.coins;
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadingParticipantsCount = true;
        this.getParticipantsCount();
      });
    this.routerService.getRouterState().subscribe((state: RouteInfo) => {
      this.backTo = state.data.backTo;
    });
    this.getParticipantsCount();
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.REFRESH_PARTICIPANTS_COUNT) {
        this.participantsCount = event.data.count;
      }
    });
  }

  getPlayerCoin() {
    this.roomService.createPlayer().subscribe((res: any) => {
      this.playerCoins = res.coins;
    });
  }

  getParticipantsCount() {
    this.tambolaService.getParticipantsCount().subscribe(res => {
      this.participantsCount = res.count;
      this.showParticipantsCount = this.participantsCount >= 1000000;
      this.loadingParticipantsCount = false;
    });
  }

  back() {
    if (this.router.url === '/tambola/events') {
      this.eventEmitterService.emit({
        type: 'NATIVE_BACK_CLICKED',
        data: ''
      });
    } else {
      if (this.backTo) {
        this.eventEmitterService.emit({
          type: 'NATIVE_BACK_CLICKED',
          data: ''
        });
        // this.router.navigate([this.backTo]);
      } else {
        this.eventEmitterService.emit({
          type: APP_EVENTS.CHAT_OVERLAY,
          data: false
        });
        this.location.back();
      }
    }
  }
  showWatchAndEarnOverlay(visibility) {
    this.eventEmitterService.emit({
      type: APP_EVENTS.SHOW_WATCH_VIDEO_TO_EARN,
      data: visibility
    });
  }
}
