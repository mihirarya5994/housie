import { Component, OnInit, OnDestroy } from '@angular/core';

import { EventEmitterService, EventData, RoomService, AnalyticsService } from 'src/app/core';
import { APP_EVENTS } from './../../../constants';

@Component({
  selector: 'app-how-to-play',
  templateUrl: './how-to-play.component.html',
  styleUrls: ['./how-to-play.component.scss']
})
export class HowToPlayComponent implements OnInit, OnDestroy {
  showHowToPlayPopup = false;
  showEarnCoinPopUp = false;
  rewardCoins = 50;
  roomId;
  intervalId = null;
  intervalIds = null;
  playVideo = false;
  videoLink;
  buttons = [
    {
      text1: 'BUMMPEER ',
      text2: 'PRIZE',
      video: 'assets/videos/bumper-prize.mp4'
    },
    {
      text1: 'HOW TO ',
      text2: 'CREATE A ROOM',
      video: 'assets/videos/create-own-your-room.mp4'
    },
    {
      text1: 'HOW TO ',
      text2: 'JOIN A ROOM',
      video: 'assets/videos/enter-a-private-room.mp4'
    }
  ];
  duration = 0;
  initialDuration = 0;
  showProgressBar = false;

  constructor(
    private eventEmitterService: EventEmitterService,
    private roomService: RoomService,
    private analyticsService: AnalyticsService
  ) {
    this.playVideo = false;
  }

  ngOnInit() {
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.SHOW_HOW_TO_PLAY_VIDEO) {
        this.analyticsService.pageLoad(
          null,
          'Jio Tambola 2 | How To Play'
        );
        this.showHowToPlayPopup = true;
      } else if (event.type === APP_EVENTS.HIDE_HOW_TO_PLAY_VIDEO) {
        this.showHowToPlayPopup = false;
      } else if (event.type === APP_EVENTS.EARN_COINS_PLAY_VIDEO) {
        this.handleShowEarnCoinPopUp(event.data);
      } else {
        this.showEarnCoinPopUp = false;
      }
    });
  }
  handleShowEarnCoinPopUp(data) {
    this.showEarnCoinPopUp = true;
    this.showProgressBar = true;
    this.duration = 5;
    this.initialDuration = this.duration;
    this.clearInterval();
    this.intervalId = setInterval(() => {
      if (this.duration > 0) {
        this.duration = this.duration - 1;
      }
    }, 1000);
    this.roomId = data;
    this.intervalIds = setInterval(() => {
      if (this.showEarnCoinPopUp) {
        this.earnCoinVideoEnd();
        this.stopAd();
      }
      this.showEarnCoinPopUp = false;
      clearInterval(this.intervalId);
    }, 5000);
  }

  onVideoEnd() {
    this.showHowToPlayPopup = false;
    this.playVideo = false;

  }

  earnCoinVideoEnd() {
    this.roomService.earnReward(this.rewardCoins, this.roomId).subscribe((res: any) => {
      if (res.success) {
        this.roomService.setCoins(res.coins);
      }
    });
  }

  handleVideoPlay(button) {
    this.analyticsService.clickTrack(
      button.text1 + button.text2,
      'Jio Tambola 2 | Home Page'
    );
    this.playVideo = true;
    this.videoLink = button.video;
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      clearInterval(this.intervalIds);
      this.intervalId = null;
      this.intervalIds = null;
    }
  }

  stopAd() {
    clearInterval(this.intervalId);
    clearInterval(this.intervalIds);
    this.showProgressBar = false;
  }


  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.intervalIds);
  }

  close() {
    this.showHowToPlayPopup = false;
    this.playVideo = false;
  }
}
