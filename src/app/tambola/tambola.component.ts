import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { filter } from 'rxjs/operators';

import {
  AudioService,
  ProfileService,
  EventEmitterService,
  EventData,
  ExternalInterfaceService,
  AnalyticsService
} from '../core';

import { APP_EVENTS } from './../constants';

declare const document: any;

@Component({
  selector: 'app-tambola',
  templateUrl: './tambola.component.html',
  styleUrls: ['./tambola.component.scss']
})
export class TambolaComponent implements OnInit {
  showFooter = true;
  showFullPageAd = false;
  keyboardPresent = false;
  chatOverlay = false;
  showExitPopup = false;
  showFastestFinger = true;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private audioService: AudioService,
    private eventEmitterService: EventEmitterService,
    private profileService: ProfileService,
    private externalInterface: ExternalInterfaceService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    let hidden;
    let visibilityChange;
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
      // Firefox up to v17
      hidden = 'mozHidden';
      visibilityChange = 'mozvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
      // Chrome up to v32, Android up to v4.4, Blackberry up to v10
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    document.addEventListener(
      visibilityChange,
      () => {
        if (!document[hidden]) {
          this.profileService.getProfile().subscribe(profile => {
            if ([false, 'false'].includes(profile.sound)) {
              this.audioService.mute();
            } else {
              this.audioService.unmute();
            }
          });
        } else {
          this.audioService.mute();
        }
      },
      false
    );

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showFooter = this.activatedRoute.snapshot.firstChild.data.showFooter;
      });

    this.eventEmitterService.subscribe((event: EventData) => {
      switch (event.type) {
        case APP_EVENTS.HIDE_FOOTER:
          this.showFooter = false;
          break;
        case APP_EVENTS.SHOW_FOOTER:
          this.showFooter = true;
          break;
        case APP_EVENTS.KEYBOARD_PRESENT:
          this.keyboardPresent = event.data;
          break;
        case APP_EVENTS.CHAT_OVERLAY:
          this.chatOverlay = event.data;
          break;
        case APP_EVENTS.SHOW_NATIVE_POP_UP:
          this.handleNativeBack();
          break;
      }
    });
  }

  handleNativeBack() {
    if (
      this.router.url.includes('/game') ||
      this.router.url.includes('/status') ||
      this.router.url.includes('/manage') ||
      this.router.url === '/tambola/events'
    ) {
      if (this.chatOverlay) {
        this.chatOverlay = false;
      } else {
        this.toggleExitPopup();
      }
    } else {
      this.router.navigate(['/tambola/events']);
    }
  }

  toggleExitPopup() {
    this.showExitPopup = !this.showExitPopup;
  }


  handleCtaAction(value) {
    switch (value.id) {
      case 0:
        if (this.router.url === '/tambola/events') {
          this.analyticsService.clickTrack(
            'Yes | Quit Tambola Pop Up',
            'Jio Tambola 2 | Home page'
          );
          this.externalInterface.sendNativeBackControl(true);
          this.externalInterface.close();
        } else {
          if (this.router.url.includes('/manage')) {
            this.eventEmitterService.emit({
              type: APP_EVENTS.LEAVE_ROOM,
              data: null
            });
            this.toggleExitPopup();
          } else {
            this.analyticsService.clickTrack(
              'Yes | Leave Lobby Pop Up',
              'Jio Tambola 2 | Private Room Lobby'
            );
            this.toggleExitPopup();
            this.router.navigate(['tambola/events']);
          }
        }
        break;
      case 1:
        this.analyticsService.clickTrack(
          'No | Quit Pop-up',
          'Jio Tambola 2 | Exit Pop up'
        );
        this.toggleExitPopup();
        break;
    }
  }
}
