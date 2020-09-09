import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  SecurityContext,
  HostListener
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  GameState,
  GameService,
  TambolaService,
  DefaultGameState,
  ProfileService,
  WinPattern,
  EventEmitterService,
  AudioService,
  UtilService,
  GameConfig,
  AppService,
  LoggerService,
  RoomService,
  EventData,
  AnalyticsService
} from 'src/app/core';

import {
  TEST_GAME_STATE,
  SOCKET_EVENTS,
  APP_EVENTS
} from './../../../constants';

import { TicketComponent } from '../ticket/ticket.component';
import { FlipperComponent } from '../flipper/flipper.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild(TicketComponent, { static: false })
  ticketComponent: TicketComponent;
  @ViewChild(FlipperComponent, { static: false })
  flipperComponent: FlipperComponent;

  profile: any = {};
  currentEvent: any;
  gameState: GameState = new DefaultGameState();
  // gameState: GameState = TEST_GAME_STATE;
  showConfetti = false;
  showHistory = false;
  showBogiePopup = false;
  showClaimConfirmationPopup = false;
  currentPatternBeingClaimed: WinPattern = null;
  lastClaimedPattern;
  incomingAd = false;
  incomingAdTimeoutId = null;
  incomingAdDuration;
  loading = true;
  gameType;
  roomId;
  prizeList = false;
  prizeDistribution;
  distributionDesc = {
    first5: 'Early 5',
    row1: 'Top Line',
    row2: 'Middle Line',
    row3: 'Bottom Line',
    corners: 'Corners',
    fullhouse: 'Full House'
  };
  currentEventSponsor;
  ballDrawStarted;
  gameEventStatus;
  prizeWon;
  isRoomLeader;
  showNoCoins = false;
  showLeaderLeftTheGamePopup = false;
  showLeaveConfirmationPopUp = false;
  isSponsoredRoom = false;
  showDialogue: any = true;
  playerCount;
  private subscriptions: Subscription[] = [];
  private gameConfig: GameConfig;
  private bgSound;
  eventStatus;
  leaveGameResponse: any;
  notification = false;
  chatNotification;
  profileNickName;

  room: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private appService: AppService,
    private tambolaService: TambolaService,
    private gameService: GameService,
    private audioService: AudioService,
    private profileService: ProfileService,
    private eventEmitterService: EventEmitterService,
    private utilService: UtilService,
    private logger: LoggerService,
    private roomService: RoomService,
    private analyticsService: AnalyticsService
  ) { }
  @HostListener('window:beforeunload', ['$event'])
  canDeactivate() {
    if (window.event) {
      return {
        show: this.showDialogue
      };
    }
    return {
      show: this.showDialogue
    };
  }
  ngOnInit() {
    this.showDialogue = true;
    this.room = this.tambolaService.getCurrentEvent();
    this.isSponsoredRoom =
      this.tambolaService.getCurrentSponsor() &&
      this.tambolaService.getCurrentSponsor().type;
    if (this.isSponsoredRoom) {
      this.analyticsService.pageLoad(
        null,
        'Jio Tambola 2| Game Screen'
      );
      this.showNoCoins = true;
      this.tambolaService.setShowCoins(this.showNoCoins);
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
      this.gameType = this.tambolaService.getCurrentSponsor().type;
    } else {
      this.analyticsService.pageLoad(
        null,
        'Jio Tambola 2| Game Screen PWF'
      );
      this.showNoCoins = false;
      this.tambolaService.setShowCoins(this.showNoCoins);
      this.isRoomLeader = this.tambolaService.getPlayerInfo().isLeader;
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
      this.gameType = 'private';
    }
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.SHOW_POP_UP && this.tambolaService.sponsor == null) {
        this.showLeaveConfirmationPopUp = true;
      } else if (event.type === APP_EVENTS.SHOW_POP_UP) {
        this.showDialogue = false;
        this.quitGameForGolden();
      }
    });
    this.profileService.getServerProfile().subscribe((res) => {
      this.profileNickName = res.nickName || 'Player';
    });
    this.gameConfig = this.tambolaService.getGameConfig();
    this.activatedRoute.params
      .pipe(
        switchMap(params =>
          this.tambolaService.getCurrentEvent()
            ? of(this.tambolaService.getCurrentEvent())
            : this.tambolaService.getEventById(params.eventId)
        )
      )
      .subscribe(event => {
        this.currentEvent = this.currentEventSponsor;
        this.currentEvent.start = new Date(this.currentEvent.start);
        this.currentEvent.started =
          this.currentEventSponsor.status === 'started' ||
          this.currentEvent.status === 'started';
        this.tambolaService.setCurrentEvent(event);
        this.subscriptions.push(
          this.gameService
            .getGameEvents()
            .subscribe(gameEvent => this.handleGameEvents(gameEvent)),
          this.profileService.getProfile().subscribe(profile => {
            this.profile = profile;
            if (this.profile.sound) {
              this.audioService.unmute();
            } else {
              this.audioService.mute();
            }
            if (this.bgSound) {
              this.bgSound.stop();
              this.bgSound = null;
            }
            this.bgSound = this.audioService.playWithHowler(
              'assets/jc/audio/bg.mp3',
              true
            );
          })
        );
        this.eventEmitterService.subscribe((eve: EventData) => {
          if (eve.type === APP_EVENTS.NOTIFY) {
            this.notification = true;
            this.chatNotification = eve.data.data;
            setTimeout(() => {
              this.notification = false;
            }, 3000);
          }
        });
        if (this.gameType === 'private') {
          this.gameService.initialize(
            this.currentEvent.roomId,
            true,
            this.isRoomLeader
          );
        } else {
          this.gameService.initialize(
            this.currentEventSponsor._id,
            false,
            false
          );
        }
        this.getCoinsDistribution();
      });
  }

  handleGameEvents(event) {
    switch (event.eventName) {
      case SOCKET_EVENTS.SOCKET_AUTHENTICATED:
        this.gameState.socketAuthenticated = true;
        break;
      case SOCKET_EVENTS.GAME_STATE:
        if (event.data.nextevent) {
          event.data.nextevent = new Date(event.data.nextevent);
        }
        this.gameState.winPatterns.forEach(pattern => {
          pattern.total = +event.data.prizeCount[pattern.type];
          pattern.available = +event.data.availablePrizecount[pattern.type];
        });
        Object.assign(this.gameState, event.data);
        this.eventStatus = this.gameState.eventstatus;
        if (this.eventStatus === 'started') {
          this.roomService.playerCount(this.currentEvent.roomId).subscribe((res) => {
            this.playerCount = res.count;
          });
        }
        // show ads
        if ([true, 'true'].includes(this.gameState.ad)) {
          this.eventEmitterService.emit({
            type: APP_EVENTS.START_FULL_PAGE_AD,
            data: {}
          });
          this.audioService.mute();
        }
        this.gameService.getParticipantsCountOnSocket();
        break;
      case SOCKET_EVENTS.USER_GAME_STATE:
        const matrix = [[], [], []];
        if (event.data.ticket) {
          const ticketArr = event.data.ticket.split(',');
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 9; j++) {
              matrix[i][j] = ticketArr[i * 9 + j];
            }
          }
        }
        const userState = {
          ticketId: event.data.ticketId,
          ticketMatrix: matrix,
          daubed: event.data.daubed,
          winnings: [],
          isBogie: event.data.isBogie === 'true' ? true : false
        };
        this.gameState.winPatterns.forEach(pattern => {
          if (event.data.prizesClaimed.includes(pattern.type)) {
            pattern.claimed = true;
            if (
              this.gameConfig.prizeCoupons &&
              this.gameConfig.prizeCoupons[pattern.type]
            ) {
              pattern.prizeImage = this.gameConfig.prizeCoupons[
                pattern.type
              ].imageUrl;
            } else {
              if (pattern.type === 'fullhouse') {
                pattern.prizeImage = 'assets/images/full-house-prize.png';
              }
            }
          }
        });
        Object.assign(this.gameState, userState);
        if (this.gameState.isBogie) {
          this.analyticsService.clickTrack(
            'Invalid Claim Pop-up',
            'Jio Tambola 2 | Game Screen'
          );
          this.toggleBogiePopup();
        }
        this.loading = false;
        this.gameService.getParticipantsCountOnSocket();
        break;
      case SOCKET_EVENTS.BALL_DRAW:
        this.startBallDraw();
        setTimeout(() => {
          if (this.gameState.currentBall) {
            this.gameState.drawn = this.gameState.drawn.includes(
              this.gameState.currentBall
            )
              ? this.gameState.drawn
              : this.gameState.drawn.concat([this.gameState.currentBall]);
          }
          this.ballDrawStarted = event.eventName;
          this.gameState.currentBall = event.data.message;
          this.gameState.successfulClaim = false;
          this.gameState.missedClaim = false;
          if (new Date(event.data.end) > new Date()) {
            // code is to be removed later
            if (!this.bgSound) {
              this.bgSound = this.audioService.playWithHowler(
                'assets/jc/audio/bg.mp3',
                true
              );
            }
            //
            if (
              this.gameConfig.ballToSoundMap &&
              this.gameConfig.ballToSoundMap[event.data.message]
            ) {
              this.audioService.playWithHowler(
                this.sanitizer.sanitize(
                  SecurityContext.RESOURCE_URL,
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    this.gameConfig.ballToSoundMap[event.data.message]
                  )
                )
              );
            } else {
              this.audioService.playWithHowler(
                `assets/jc/audio/${event.data.message}.mp3`
              );
            }
          }
          this.logger.warn(
            'this.gameState.drawn.length > ',
            this.gameState.drawn.length
          );
          this.incomingAd = (this.gameConfig.ads.adAt || []).includes(
            this.gameState.drawn.length + 1
          );
          if (this.incomingAd) {
            this.incomingAdDuration = this.gameConfig.ads.drawDuration;
            if (this.incomingAdTimeoutId) {
              clearInterval(this.incomingAdTimeoutId);
              this.incomingAdTimeoutId = null;
            }
            this.incomingAdTimeoutId = setInterval(() => {
              if (this.incomingAdDuration > 0) {
                this.incomingAdDuration -= 1;
              } else {
                clearInterval(this.incomingAdTimeoutId);
                this.incomingAd = false;
              }
            }, 1000);
          }
        }, 1000);
        this.gameService.getParticipantsCountOnSocket();
        break;
      case SOCKET_EVENTS.PRIZE_CLAIMED:
        const updatedPrizes = event.data.message;
        const state = { winPatterns: this.gameState.winPatterns };
        state.winPatterns.forEach(pattern => {
          pattern.available = +updatedPrizes[pattern.type];
        });
        Object.assign(this.gameState, state);
        this.gameService.getParticipantsCountOnSocket();
        break;
      case SOCKET_EVENTS.GAME_END:
        this.gameState.eventstatus = 'ended';
        this.analyticsService.clickTrack(
          'Game Over Page',
          'Jio Tambola 2 | Game Screen'
        );
        this.gameService.getParticipantsCountOnSocket();
        if (!this.appService.getHasGameEndSoundBeenPlayed()) {
          this.audioService.playWithHowler('assets/jc/audio/game-over.mp3');
          this.appService.setHasGameEndSoundBeenPlayed(true);
        }
        if (!this.gameState.drawn.includes(this.gameState.currentBall)) {
          this.gameState.drawn.push(this.gameState.currentBall);
        }
        break;
      case SOCKET_EVENTS.AD_START:
        this.incomingAd = false;
        this.eventEmitterService.emit({
          type: APP_EVENTS.START_FULL_PAGE_AD,
          data: { duration: event.data.message }
        });
        this.gameService.getParticipantsCountOnSocket();
        this.audioService.mute();
        break;
      case SOCKET_EVENTS.AD_END:
        this.incomingAd = false;
        this.eventEmitterService.emit({
          type: APP_EVENTS.STOP_FULL_PAGE_AD,
          data: null
        });
        this.gameService.getParticipantsCountOnSocket();
        if (this.profile.sound) {
          this.audioService.unmute();
        }
        break;
      case SOCKET_EVENTS.EVENT_STATUS:
        this.eventStatus = event.data.message;
        if (this.eventStatus === 'started') {
          this.roomService.playerCount(this.currentEvent.roomId).subscribe((res) => {
            this.playerCount = res.count;
          });
          this.currentEvent.started = true;
        }
        this.gameState.winPatterns.forEach(pattern => {
          pattern.total = +event.data.prizeCount[pattern.type];
          pattern.available = +event.data.availablePrizecount[pattern.type];
        });
        break;
      case SOCKET_EVENTS.LEADER_STATUS:
        if (event.data && event.data.message === 'Leader left the game') {
          this.analyticsService.clickTrack(
            'No Game Leader | Wrong Code Pop-up',
            'Jio Tambola 2 | Game Screen PWF'
          );
          this.toggleLeaderLeftTheGamePopup();
        }
        break;
    }
  }

  toggleLeaderLeftTheGamePopup() {
    this.showLeaderLeftTheGamePopup = !this.showLeaderLeftTheGamePopup;
  }

  redirectToHome() {
    this.showDialogue = false;
    this.toggleLeaderLeftTheGamePopup();
    this.router.navigate(['tambola/events']);
  }

  handleTimerEnd() {
    if (this.currentEvent.status === 'active') {
      if (!this.appService.getHasGameStartSoundBeenPlayed()) {
        this.audioService.playWithHowler('assets/jc/audio/game-start.mp3');
        this.appService.setHasGameStartSoundBeenPlayed(true);
      }
    }
    this.currentEvent.started = true;
  }

  startBallDraw() {
    this.flipperComponent.flip = false;
    setTimeout(() => (this.flipperComponent.flip = true), 3000);
  }

  toggleAudio() {
    this.profile.sound = !this.profile.sound;
    this.profileService
      .updateProfile({ sound: this.profile.sound })
      .subscribe(() => {
        if (!this.profile.sound) {
          this.audioService.mute();
        } else {
          this.audioService.unmute();
        }
      });

    if (this.gameType === 'private') {
      this.analyticsService.clickTrack(
        'Sound | Game Screen PWF',
        'Jio Tambola 2 | Game Screen PWF'
      );
    } else {
      this.analyticsService.clickTrack(
        'Sound | Game Screen',
        'Jio Tambola 2 | Game Screen'
      );
    }
  }

  toggleBogiePopup() {
    this.showBogiePopup = !this.showBogiePopup;
  }

  toggleConfetti() { }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.gameType === 'private') {
      this.analyticsService.clickTrack(
        'Number History | Game Screen PWF',
        'Jio Tambola 2 | Game Screen PWF'
      );
    } else {
      this.analyticsService.clickTrack(
        'Number History | Game Screen',
        'Jio Tambola 2 | Game Screen'
      );
    }
  }

  toggleClaimConfirmationPopup(pattern) {
    this.currentPatternBeingClaimed = pattern;
    this.showClaimConfirmationPopup = !this.showClaimConfirmationPopup;
  }

  handleDaub(event) {
    if (event.daub) {
      this.gameService.daubNumber(event.number).subscribe((res: any) => {
        if (res.success) {
          this.gameState.daubed = [...this.gameState.daubed, event.number];
          this.gameState.daubed = this.utilService.clone(this.gameState.daubed);
        }
      });
    } else {
      this.gameService.undaubNumber(event.number).subscribe((res: any) => {
        if (res.success) {
          this.gameState.daubed.splice(
            this.gameState.daubed.indexOf(event.number),
            1
          );
          this.gameState.daubed = this.utilService.clone(this.gameState.daubed);
        }
      });
    }
  }

  claimSecretReward() {
    this.gameService.claimSecretReward().subscribe((res: any) => {
      if (!res.error) {
        if (res.success) {
          this.gameState.wonSecretReward = true;
          this.eventEmitterService.emit({
            type: APP_EVENTS.REFRESH_PRIZES,
            data: null
          });
          setTimeout(() => (this.gameState.wonSecretReward = false), 3000);
        }
      }
    });
  }

  handleClaimWin() {
    this.claimWin(this.currentPatternBeingClaimed, this.gameType);
    this.toggleClaimConfirmationPopup(null);
  }

  claimWin(claimedPattern: WinPattern, gameType) {
    if (this.gameType === 'private') {
      this.analyticsService.clickTrack(
        'Claim_' + claimedPattern.name + '| Game Screen PWF',
        'Jio Tambola 2 | Game Screen PWF'
      );
    } else {
      this.analyticsService.clickTrack(
        'Claim_' + claimedPattern.name + '| Game Screen',
        'Jio Tambola 2 | Game Screen'
      );
    }
    claimedPattern.validating = true;
    this.gameService
      .claimWin(claimedPattern.type, this.gameType)
      .subscribe((res: any) => this.handleClaimResponse(res, claimedPattern));
  }

  handleClaimResponse(res, claimedPattern) {
    this.lastClaimedPattern = claimedPattern;
    if (!res.error) {
      if (res.success) {
        if (res.coins) {
          this.roomService.setCoins(res.coins);
          this.getCoinsDistribution();
        }
        this.gameState.successfulClaim = true;
        setTimeout(() => (this.gameState.successfulClaim = false), 5000);
        this.eventEmitterService.emit({
          type: APP_EVENTS.REFRESH_PRIZES,
          data: null
        });
        // pattern prize
        if (this.gameConfig.prizeCoupons) {
          const prizeConfig = this.gameConfig.prizeCoupons[claimedPattern.type];
          if (claimedPattern.type === 'fullhouse' && !prizeConfig) {
            claimedPattern.prizeImage = 'assets/images/full-house-prize.png';
          } else {
            if (prizeConfig) {
              claimedPattern.prizeImage = prizeConfig.imageUrl;
            }
          }
        }
        claimedPattern.claimed = true;
      } else {
        if (res.bogie) {
          this.gameState.isBogie = true;
          this.analyticsService.clickTrack(
            'Invalid Claim Pop-up',
            'Jio Tambola 2 | Game Screen'
          );
          this.toggleBogiePopup();
        } else if (res.notAvailable) {
          this.gameState.missedClaim = true;
          setTimeout(() => (this.gameState.missedClaim = false), 5000);
        }
      }
    }
    claimedPattern.validating = false;
  }

  showResults() {
    this.analyticsService.clickTrack(
      'See Results |  Game Over Page',
      'Jio Tambola 2 | Game Over Page'
    );
    this.showDialogue = false;
    this.router.navigate(['../results'], { relativeTo: this.activatedRoute });
    // this.cleanup();
  }

  showFriendsResult() {
    this.analyticsService.clickTrack(
      'See Results | Game Over PWF Page',
      'Jio Tambola 2 | Game Over PWF Page'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: false
    });
    this.showDialogue = false;
    this.router.navigate(['../friends-result'], { relativeTo: this.activatedRoute });
  }

  joinNextGame() {
    this.analyticsService.clickTrack(
      'Continue |  Game Over Page',
      'Jio Tambola 2 | Game Over Page'
    );
    this.router.navigate(['../../../events'], {
      relativeTo: this.activatedRoute
    });
  }

  ngOnDestroy() {
    if (this.bgSound) {
      this.bgSound.stop();
      this.bgSound = null;
    }
    this.audioService.mute();
    this.gameService.dispose();
    this.subscriptions.forEach(s => s.unsubscribe());

    if (this.incomingAdTimeoutId) {
      clearInterval(this.incomingAdTimeoutId);
      this.incomingAdTimeoutId = null;
    }
  }

  showPrizes() {
    this.prizeList = !this.prizeList;
    this.getCoinsDistribution();
  }

  getCoinsDistribution() {
    this.roomService
      .getCoinsDistribution(this.currentEvent.roomId)
      .subscribe((res: any) => {
        this.prizeDistribution = res.prizes;
        this.gameState.winPatterns.forEach(
          (pattern: WinPattern) =>
            (pattern.pointsWon = this.prizeDistribution[pattern.type])
        );
      });
  }

  quitGameForGolden() {
    if (this.gameType === 'golden') {
      this.router.navigate(['tambola/events']);
    }
  }
  quitGame() {
    this.analyticsService.clickTrack(
      'Yes | Quit Game Pop-up',
      'Jio Tambola 2 | Game Screen PWF'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: false
    });
    this.showDialogue = false;
    this.router.navigate(['tambola/events']);
  }

  doNotQuit() {
    this.analyticsService.clickTrack(
      'No | Quit Game Pop-up',
      'Jio Tambola 2 | Game Screen PWF'
    );
    this.showLeaveConfirmationPopUp = !this.showLeaveConfirmationPopUp;
  }

  openChatWindowOverlay(visibility) {
    this.analyticsService.clickTrack(
      'Chat | Game Screen PWF',
      'Jio Tambola 2 | Game Screen PWF'
    );
    this.notification = false;
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: visibility
    });
  }
}
