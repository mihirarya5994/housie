import { ComponentCanDeactivate } from './../../../core/guards/route.guard';
import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  RoomService,
  ExternalInterfaceService,
  AppService,
  GameService,
  EventEmitterService,
  EventData,
  TambolaService,
  ProfileService,
  RestService,
  AnalyticsService
} from 'src/app/core';
import { SOCKET_EVENTS, APP_EVENTS } from './../../../constants';
import { Subscription } from 'rxjs';

declare const window: any;

@Component({
  selector: 'app-manage-room',
  templateUrl: './manage-room.component.html',
  styleUrls: ['./manage-room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageRoomComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  config = {
    disableAutoFocus: true,
    allowNumbersOnly: false,
    isPasswordInput: false,
  };
  showPrizePopup = false;
  showPopUp = false;
  loading = true;
  showDialogue = true;
  showConfirmationPopUp = false;
  kickedOut = false;
  leaveGameResponse;
  playerStatus: any[] = [];
  roomName;
  kickOut;
  private subscriptions: Subscription[] = [];
  room;
  playerInfo;
  profile;
  isReadOnly = false;
  isDisabled = false;
  hasTicket = [];
  hasNoTicket = [];
  serverProfile;
  inputconfig;
  startGamePopup = false;
  notification = false;
  chatNotification;
  isKeyBoardPresent = false;

  constructor(
    private roomService: RoomService,
    private externalInterfaceService: ExternalInterfaceService,
    private appService: AppService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private gameService: GameService,
    private tambolaService: TambolaService,
    private restService: RestService,
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

  shareCode() {
    this.analyticsService.clickTrack(
      'Share Code | Game Incharge',
      'Jio Tambola 2 | Game Incharge'
    );
    this.externalInterfaceService.share(this.appService.getEnvVariable('SHARE_CODE_MESSAGE') +
      ` Room Name: ${this.room.name} ` + `Code: ${this.room.shareCode} `);
  }

  ticketStatusPopUp() {
    this.showPopUp = !this.showPopUp;
  }

  handleGameEvents(event) {
    const playerData = [];
    switch (event.eventName) {
      case SOCKET_EVENTS.PLAYERS_STATUS:
        if (event.data) {
          this.playerStatus = event.data.message.players;
          // to be deployed later
          this.hasTicket = this.playerStatus.filter((status) => {
            return status.hasTicket;
          });
          this.hasNoTicket = this.playerStatus.filter((status) => {
            return !status.hasTicket;
          });
          for (const player of this.playerStatus) {
            if (player['phoneNo'] === this.profile.phoneNo) {
              player['name'] = player['name'] + ' (You)';
              playerData.push(player);
            }
          }
          for (const player of this.playerStatus) {
            if (player['phoneNo'] !== this.profile.phoneNo) {
              playerData.push(player);
            }
          }
          this.playerStatus = playerData;
          this.kickOut = event.data.message.kicked_out;
        }
        break;
      case SOCKET_EVENTS.LEADER_STATUS:
        break;
    }
  }

  startGame() {
    this.analyticsService.clickTrack(
      'Start Game | Game Incharge',
      'Jio Tambola 2 | Game Incharge'
    );
    if (this.hasNoTicket.length > 0) {
      this.analyticsService.clickTrack(
        'No Ticket Continue Pop-up',
        'Jio Tambola 2 | Game Incharge'
      );
      this.startGamePopup = true;
    } else {
      this.continueGame();
    }
  }

  exitGamePopUp() {
    this.showConfirmationPopUp = !this.showConfirmationPopUp;
  }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Game Incharge'
    );
    this.isReadOnly = true;
    this.isDisabled = true;
    const players = [];
    this.loading = false;
    this.room = this.tambolaService.getCurrentEvent();
    this.restService.get(this.appService.getEnvVariable('PROFILE_API_HOST') + '/users/my_profile').subscribe((res) => {
      this.serverProfile = res;
    });
    this.restService.get(this.appService.getEnvVariable('API_HOST') + '/my_profile').subscribe((res) => {
      this.profile = res;
      for (const player of this.playerStatus) {
        if (player['phoneNo'] === this.profile.phoneNo) {
          player['name'] = player['name'] + ' (You)';
          players.push(player);
        }
      }
      for (const player of this.playerStatus) {
        if (player['phoneNo'] !== this.profile.phoneNo) {
          players.push(player);
        }
      }
      this.playerStatus = players;
      this.playerStatus.map((status) => {
      });
      this.subscriptions.push(this.gameService
        .getGameEvents()
        .subscribe(gameEvent => this.handleGameEvents(gameEvent)));

      this.eventEmitterService.subscribe((eve: EventData) => {
        switch (eve.type) {
          case APP_EVENTS.NOTIFY:
            this.notification = true;
            this.chatNotification = eve.data.data;
            setTimeout(() => {
              this.notification = false;
            }, 3000);
            break;
          case APP_EVENTS.LEAVE_ROOM:
            this.quitGame();
            break;
          case APP_EVENTS.SHOW_POP_UP:
            this.analyticsService.clickTrack(
              'Quit Lobby Pop-up',
              'Jio Tambola 2 | Game Incharge'
            );
            this.showConfirmationPopUp = true;
        }
      });

      this.gameService.initialize(this.tambolaService.getCurrentEvent().roomId, true, false);
    });

  }

  ngAfterViewInit() {
    this.isDisabled = true;
    this.isReadOnly = true;
    setTimeout(() => {
      this.ngOtpInput.setValue(this.room.shareCode);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.gameService.dispose();
  }

  navigateTo() {
    this.showDialogue = false;
    this.router.navigate(['splash']);
  }

  quitGame() {
    this.analyticsService.clickTrack(
      'Yes | Quit Lobby Pop-up',
      'Jio Tambola 2 | Game Incharge'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: false
    });
    this.roomService.leaveGame(this.room.roomId).subscribe((res: any) => {
      this.leaveGameResponse = res;
      if (this.leaveGameResponse.success) {
        this.showDialogue = false;
        this.router.navigate(['tambola/events']);
        this.handleGameEvents(res);
      }
    });
  }
  doNotQuit() {
    this.showConfirmationPopUp = !this.showConfirmationPopUp;
  }

  kickOutPlayer(player) {
    this.analyticsService.clickTrack(
      'Kick Player | Game Incharge',
      'Jio Tambola 2 | Game Incharge'
    );
    const playerInfo = {
      'roomId': this.tambolaService.getCurrentEvent().roomId,
      'phone': player.phoneNo
    };
    this.roomService.kickOutPlayer(playerInfo).subscribe((res: any) => {
      if (res.success) {
        this.handleGameEvents(res);
      }
    });
  }
  getConfig() {
    if (this.appService.getOS() === 'ios') {
      this.inputconfig = {
        length: 6,
        disableAutoFocus: true,
        inputStyles: {
          'color': 'black',
          'text-align': 'left',
          'padding': '0px 0px 0px 7px',
          'font-size': '2rem',
          'margin': '0px',
          'pointer-events': 'none',
          'cursor': 'none'
        }
      }
      return this.inputconfig;
    } else if (this.appService.getOS() === 'android' || this.appService.getOS() === 'others') {
      this.inputconfig = {
        length: 6,
        disableAutoFocus: true,
        inputStyles: {
          'color': 'black',
          'text-align': 'center',
          'padding-left': '0px 0px 0px 7px',
          'font-size': '3rem',
          'margin': '0px',
          'pointer-events': 'none',
          'cursor': 'none',
        }
      }
      return this.inputconfig;
    }
  }

  doNotContinue() {
    this.analyticsService.clickTrack(
      'No | No ticket Continue',
      'Jio Tambola 2 | Game Incharge'
    );
    this.startGamePopup = !this.startGamePopup;
  }

  continueGame() {
    this.analyticsService.clickTrack(
      'Yes | No ticket Continue',
      'Jio Tambola 2 | Game Incharge'
    );
    this.showDialogue = false;
    this.roomService.startRoom(this.room.roomId).subscribe((res: any) => {
      if (res.success) {
        this.roomService.setCoins(res.coins);
        this.router.navigate(['tambola/events', this.room.roomId, 'quiz']);
      }
    });
  }

  openChatWindowOverlay(visibility) {
    this.analyticsService.clickTrack(
      'Chat | Game Incharge',
      'Jio Tambola 2 | Game Incharge'
    );
    this.notification = false;
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: visibility
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
  }
}
