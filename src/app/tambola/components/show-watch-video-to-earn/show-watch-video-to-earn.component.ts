import { Component, OnInit } from '@angular/core';
import { EventEmitterService, EventData, } from 'src/app/core';
import { APP_EVENTS } from './../../../constants';



@Component({
  selector: 'app-show-watch-video-to-earn',
  templateUrl: './show-watch-video-to-earn.component.html',
  styleUrls: ['./show-watch-video-to-earn.component.scss']
})
export class ShowWatchVideoToEarnComponent implements OnInit {
  ShowWatchVideoToEarnPopup = false;

  constructor(
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.SHOW_WATCH_VIDEO_TO_EARN) {
        this.ShowWatchVideoToEarnPopup = event.data;
      }
    });
  }

  showWatchAndEarnOverlay(visibility) {
    this.eventEmitterService.emit({
      type: APP_EVENTS.SHOW_WATCH_VIDEO_TO_EARN,
      data: visibility
    });
  }

  playEarnCoin() {
    this.ShowWatchVideoToEarnPopup = false;
    this.eventEmitterService.emit({
      type: APP_EVENTS.EARN_COINS_PLAY_VIDEO,
      data: 'JioTambola',
    });
  }
}
