import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  ExternalInterfaceService,
  TambolaService,
  AppService,
  EventEmitterService,
  AudioService,
  RoomService,
  ProfileService,
  ValidatorService,
  AnalyticsService
} from 'src/app/core';

import { APP_EVENTS } from './../../../constants';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, AfterViewInit, OnDestroy {
  currentEvent: any = {};
  haveMoreEventsToday = false;
  loading = true;
  currentEventSponsor;
  showNoCoins = false;
  eventTypes = [
    {
      type: 'golden',
      folderPath: 'assets/images/free',
      banner: 'free-ticket.png',
    },
  ];
  profile;
  showProfilePopUp = false;
  private welcomeAudio;
  apiStats = {
    url: '',
    httpstatus: '',
    method: '',
    responseTime: 0,
    startTime: '',
    endTime: '',
    activity: ''
  };
  profileData = {
    nickName: 'Player',
  };
  errors: any = {};
  TnC;
  showTncPopup = false;
  game = {
    golden: false,
    private: false,
    event
  };
  isKeyBoardPresent = false;
  profileTnc;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private tambolaService: TambolaService,
    private eventEmitterService: EventEmitterService,
    private externalInterfaceService: ExternalInterfaceService,
    private audioService: AudioService,
    private roomService: RoomService,
    private profileService: ProfileService,
    private validatorService: ValidatorService,
    private analyticsService: AnalyticsService
  ) {
    const start = new Date(new Date);
    this.apiStats.startTime = start.toISOString();
    this.apiStats.method = 'start';
    this.apiStats.activity = 'home';
  }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Home Page'
    );
    this.tambolaService.setShowCoins(this.showNoCoins);
    this.getEvents();
    this.profileService.getProfile().subscribe((res) => {
      this.profileTnc = res.TnC;
      if (!this.appService.getHasWelcomeSoundBeenPlayed()) {
        this.welcomeAudio = this.audioService.playWithHowler(
          'assets/jc/audio/welcome.mp3'
        );
        this.appService.setHasWelcomeSoundBeenPlayed(true);
      }
    });
    if (this.welcomeAudio) {
      this.welcomeAudio.stop();
    }
    this.roomService.getCoins().subscribe((res: any) => {
      this.roomService.setCoins(res.coins);
    });
    this.profileService.getServerProfile().subscribe((res) => {
      this.profile = res.nickName;
    });
  }

  ngAfterViewInit() {
    const end = new Date(new Date);
    this.apiStats.endTime = end.toISOString();
    this.apiStats.method = 'end';
    this.apiStats.activity = 'home';
    this.handleApiStatus(this.apiStats);
  }

  navigateToRoom() {
    this.analyticsService.clickTrack(
      'Play with friends',
      'Jio Tambola 2 | Home Page'
    );
    if (!this.profileTnc) {
      this.showTncPopup = true;
      this.analyticsService.clickTrack(
        'New Player Pop-up',
        'Jio Tambola 2 | Home Page'
      );
      this.game.private = true;
    } else {
      if (this.profileTnc && this.profile === undefined) {
        this.showProfilePopUp = true;
        this.analyticsService.clickTrack(
          'Username Pop-up',
          'Jio Tambola 2 | Home Page'
        );
      } else {
        this.router.navigate(['tambola/room']);
      }
    }
  }

  handleTnC() {
    this.analyticsService.clickTrack(
      'Proceed | New Player Pop-up',
      'Jio Tambola 2 | Home Page'
    );
    this.profileService.updateProfile({ TnC: true }).subscribe((res: any) => {
      if (res.success) {
        this.showTncPopup = false;
        this.profileTnc = true;
        if (this.game.golden) {
          this.navigateToGame(this.game.event);
        } else {
          if (!this.profile) {
            this.analyticsService.clickTrack(
              'Username Pop-up',
              'Jio Tambola 2 | Home Page'
            );
            this.showProfilePopUp = true;
          } else {
            this.router.navigate(['tambola/room']);
          }
        }
      }
    });
  }

  acceptTnC() {
    this.TnC = !this.TnC;
  }

  validate() {
    this.errors = {};
    if (!this.validatorService.isValidNickName(
      (this.profileData.nickName || '').trim()
    )) {
      this.errors.nickName = 'Please enter a valid nick name.';
      return false;
    } else if ((this.profileData.nickName || '').length < 2) {
      this.errors.nickName = 'Nick name should at least be 2 characters long.';
      return false;
    } else {
      return true;
    }
  }

  submitProfile() {
    if (!this.validate()) {
      return;
    }
    this.analyticsService.clickTrack(
      'Lets Play | Username Pop-up',
      'Jio Tambola 2 | Home Page'
    );
    this.profileService.updateServerProfile(this.profileData).subscribe((res: any) => {
      if (res.success) {
        this.router.navigate(['tambola/room']);
      }
    });
  }

  getEvents() {
    this.tambolaService.getConfiguration().subscribe(res => {
      this.tambolaService.getEvents().subscribe(events => {
        this.currentEvent = Array.isArray(events) ? events : events;
        if (this.currentEvent) {
          this.currentEvent.start = new Date(this.currentEvent.start);
        }
        this.tambolaService.setCurrentEvent(this.currentEvent);
        let pageStatus = '';
        if (this.currentEvent.status === 'ended') {
          pageStatus = 'PostMatch';
        } else if (this.currentEvent.status === 'active') {
          pageStatus = 'PreMatch';
        } else if (this.currentEvent.status === 'started') {
          pageStatus = 'LiveMatch';
        }
        const nextEvents = (Array.isArray(events) ? events : [events]).filter(
          event => event.status === 'active'
        );
        this.haveMoreEventsToday = !!nextEvents.filter(event => {
          const today = new Date();
          const eventStartTime = new Date(
            new Date(event.start).valueOf() +
            this.appService.getCurrentTimeOffset()
          );
          return (
            eventStartTime.getFullYear() === today.getFullYear() &&
            eventStartTime.getMonth() === today.getMonth() &&
            eventStartTime.getDate() === today.getDate() &&
            eventStartTime.getMilliseconds() >= today.getMilliseconds()
          );
        }).length;
        this.loading = false;
      });
    });
  }

  handleTimerEnd() {
    this.currentEvent.status = 'started';
  }

  howToPlay() {
    this.analyticsService.clickTrack(
      'How to play',
      'Jio Tambola 2 | Home Page'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.SHOW_HOW_TO_PLAY_VIDEO,
      data: null
    });
  }

  navigateToGame(currentEvent) {
    this.analyticsService.clickTrack(
      'Play Now_GoldenTicket',
      'Jio Tambola 2 | Home Page'
    );
    if (!this.profileTnc) {
      this.showTncPopup = true;
      this.game.golden = true;
      this.game.event = currentEvent;
    } else {
      this.tambolaService.setCurrentEventSponsor(currentEvent);
      this.currentEventSponsor = currentEvent;
      if (this.currentEventSponsor && this.currentEventSponsor._id) {
        if (
          this.currentEventSponsor.status !== 'started' &&
          !this.isEventInLast10Minutes(this.currentEventSponsor)
        ) {
          this.eventEmitterService.emit({
            type: APP_EVENTS.START_FULL_PAGE_AD,
            data: { duration: 10 }
          });
          const timeoutId = setTimeout(() => {
            this.eventEmitterService.emit({
              type: APP_EVENTS.STOP_FULL_PAGE_AD,
              data: null
            });
            clearTimeout(timeoutId);
            this.router.navigate(['.', this.currentEventSponsor._id, 'quiz'], {
              relativeTo: this.activatedRoute
            });
          }, 10 * 1000);
        } else {
          this.router.navigate(['.', this.currentEventSponsor._id, 'quiz'], {
            relativeTo: this.activatedRoute
          });
        }
      } else {
        this.router.navigate(['tambola/prizes']);
      }
    }
  }

  isEventInLast10Minutes(event) {
    const difference = new Date(event.start).getTime() - new Date().getTime();
    const minutesDiff = Math.round(difference / 60000);
    return minutesDiff <= 10;
  }

  inviteFriends() {
    this.analyticsService.clickTrack(
      'Invite Friends',
      'Jio Tambola 2 | Home Page'
    );
    this.externalInterfaceService.share(
      this.appService.getEnvVariable('SHARE_MESSAGE')
    );
  }

  handleApiStatus(data) {
    this.tambolaService.apiStats(data).subscribe((res: any) => {
    });
  }


  ngOnDestroy() {
    if (this.welcomeAudio) {
      this.welcomeAudio.stop();
    }
  }

  noProfileSubmit() {
    this.showProfilePopUp = !this.showProfilePopUp;
  }

  closeTncPopUp() {
    this.showTncPopup = !this.showTncPopup;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
    this.eventEmitterService.emit({
      type: APP_EVENTS.KEYBOARD_PRESENT,
      data: this.isKeyBoardPresent
    });
  }

  navigateTo(link) {
    switch (link) {
      case 'tnc':
        this.externalInterfaceService.launchBrowser(
          this.appService.getEnvVariable('TNC_URL')
        );
        break;
    }
  }
}
