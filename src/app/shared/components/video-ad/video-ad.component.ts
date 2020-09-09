import { Component, OnInit, Input } from '@angular/core';
import {
  EventEmitterService, AnalyticsService
} from 'src/app/core';

import { APP_EVENTS } from './../../../constants';

@Component({
  selector: 'app-video-ad',
  templateUrl: './video-ad.component.html',
  styleUrls: ['./video-ad.component.scss']
})
export class VideoAdComponent implements OnInit {

  @Input() roomId;

  constructor(
    private eventEmitterService: EventEmitterService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {

  }
  playEarnCoin() {
    this.analyticsService.clickTrack(
      'Watch Ad',
      'Jio Tambola 2 | Create Private Room Lobby'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.EARN_COINS_PLAY_VIDEO,
      data: this.roomId ? this.roomId : 'JioTambola',
    });
  }
}
