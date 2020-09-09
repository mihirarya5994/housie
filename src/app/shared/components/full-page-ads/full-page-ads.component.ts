import { Component, OnInit } from '@angular/core';

import { EventEmitterService, EventData } from 'src/app/core';

import { APP_EVENTS } from '../../../constants';

@Component({
  selector: 'app-full-page-ads',
  templateUrl: './full-page-ads.component.html',
  styleUrls: ['./full-page-ads.component.scss']
})
export class FullPageAdsComponent implements OnInit {
  show = false;
  sound = true;
  duration = 0;
  initialDuration = 0;
  intervalId = null;
  showProgressBar = false;
  canSkip = false;

  constructor(
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.START_FULL_PAGE_AD) {
        this.showProgressBar = !!event.data.duration;
        if (event.data.duration) {
          this.duration = +event.data.duration || 10;
          this.initialDuration = this.duration;
          this.clearInterval();
          this.intervalId = setInterval(() => {
            if (this.duration === 3) {
              this.canSkip = true;
            }
            if (this.duration > 0) {
              this.duration -= 1;
            } else {
              this.stopAd();
            }
          }, 1000);
        }
        this.show = true;
      } else if (event.type === APP_EVENTS.STOP_FULL_PAGE_AD) {
        this.stopAd();
      }
    });
  }

  stopAd() {
    this.clearInterval();
    this.canSkip = false;
    this.show = false;
    this.showProgressBar = false;
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggleSound() {
    this.sound = !this.sound;
  }
}
