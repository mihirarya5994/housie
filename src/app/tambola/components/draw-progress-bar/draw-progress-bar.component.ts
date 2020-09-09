import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { GameService, AppService } from 'src/app/core';

import { TambolaService } from "src/app/core";

import { SOCKET_EVENTS } from './../../../constants';

@Component({
  selector: 'app-draw-progress-bar',
  templateUrl: './draw-progress-bar.component.html',
  styleUrls: ['./draw-progress-bar.component.scss']
})
export class DrawProgressBarComponent implements OnInit {
  @ViewChild('inner', { static: false }) inner: ElementRef;
  currentEventSponsor: any;

  constructor(
    private appService: AppService,
    private gameService: GameService,
    private tambolaService: TambolaService

  ) { }

  ngOnInit() {
    this.gameService
      .getGameEvents()
      .subscribe(gameEvent => this.handleGameEvents(gameEvent));
    const isSponsoredRoom = this.tambolaService.getCurrentSponsor() && this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
    } else {
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
    }
  }

  handleGameEvents(event) {
    switch (event.eventName) {
      case SOCKET_EVENTS.BALL_DRAW:
        this.inner.nativeElement.style.transition = '';
        this.inner.nativeElement.style.width = '100%';
        setTimeout(() => this.animate(), 1000);
        break;
    }
  }

  animate() {
    this.inner.nativeElement.style.transition = `width ${this.appService.getEnvVariable(
      'BALL_PROGRESS_BAR_TIME_IN_SECS'
    )}s linear`;
    setTimeout(() => (this.inner.nativeElement.style.width = '0%'), 0);
  }
}
