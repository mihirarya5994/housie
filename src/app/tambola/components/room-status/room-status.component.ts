import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  RoomService, TambolaService, GameService, AppService, RestService, EventEmitterService, EventData, AnalyticsService
} from 'src/app/core';
import { SOCKET_EVENTS, APP_EVENTS } from 'src/app/constants';

@Component({
  selector: 'app-room-status',
  templateUrl: './room-status.component.html',
  styleUrls: ['./room-status.component.scss']
})
export class RoomStatusComponent implements OnInit, OnDestroy {
  showPrizePopup = false;
  showPopUp = false;
  playerCoinBalance;
  leaveGamePopUp = false;
  prizeDistribution;
  playersInfo: any[] = [];
  roomDetail;
  ticketStatus;
  private subscriptions: Subscription[] = [];
  distributionDesc = {
    'first5': 'Early 5',
    'row1': 'Top Line',
    'row2': 'Middle Line',
    'row3': 'Bottom Line',
    'corners': 'Corners',
    'fullhouse': 'Full House'
  };
  kickOut;
  kickedOut = false;
  profile;
  roomDeleted = false;
  notification = false;
  chatNotification;
  isKeyBoardPresent = false;
  serverProfile;


  constructor(
    private roomService: RoomService,
    private router: Router,
    private tambolaService: TambolaService,
    private gameService: GameService,
    private appService: AppService,
    private restService: RestService,
    private eventEmitterService: EventEmitterService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Private Room Lobby'
    );
    const players = [];
    this.restService.get(this.appService.getEnvVariable('API_HOST') + '/my_profile').subscribe((res) => {
      this.profile = res;
      this.roomDetail = this.tambolaService.getPlayerInfo();
      this.playersInfo = this.roomDetail.players;
      for (const player of this.playersInfo) {
        if (player['phoneNo'] === this.profile.phoneNo) {
          player['name'] = player['name'] + ' (You)';
          players.push(player);
        }
      }
      for (const player of this.playersInfo) {
        if (player['phoneNo'] !== this.profile.phoneNo) {
          players.push(player);
        }
      }
      this.playersInfo = players;
      this.subscriptions.push(this.gameService
        .getGameEvents()
        .subscribe(gameEvent => this.handleGameEvents(gameEvent)));
      this.gameService.initialize(this.tambolaService.getCurrentEvent().roomId ||
        this.tambolaService.getPlayerInfo().roomId, true, false);
    });
    this.restService.get(this.appService.getEnvVariable('PROFILE_API_HOST') + '/users/my_profile').subscribe((res) => {
      this.serverProfile = res;
    });
    this.eventEmitterService.subscribe((eve: EventData) => {
      if (eve.type === APP_EVENTS.NOTIFY) {
        this.notification = true;
        this.chatNotification = eve.data.data;
        setTimeout(() => {
          this.notification = false;
        }, 3000);
      }
    });
  }

  kickedOutPopUp() {
    if (this.kickOut === this.appService.getUserPhoneNo()) {
      this.kickedOut = true;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.gameService.dispose();
  }

  buyTicket() {
    this.analyticsService.clickTrack(
      'Buy ticket | Private Room Lobby',
      'Jio Tambola 2 | Private Room Lobby'
    );
    this.roomService.getCoins().subscribe((res: any) => {
      this.playerCoinBalance = res.coins;
      if (this.playerCoinBalance >= this.roomDetail.ticketPrice) {
        this.roomService.buyRoomTicket(this.roomDetail.roomId).subscribe((data: any) => {
          if (data.success === true) {
            this.ticketStatus = data;
            this.roomService.setCoins(this.ticketStatus.coins);
            this.roomDetail.hasTicket = true;
            this.router.navigate(['tambola/events', this.roomDetail.roomId, 'quiz']);
          } else {
            this.kickedOutPopUp();
            this.kickedOut = true;
          }
        });
      } else {
        this.analyticsService.clickTrack(
          'Insufficient Coins Popup',
          'Jio Tambola 2 | Private Room Lobby'
        );
        this.ticketStatusPopUp();
      }
    });
  }

  togglePrizePopup() {
    this.analyticsService.clickTrack(
      'Prizes | Private Room Lobby',
      'Jio Tambola 2 | Private Room Lobby'
    );
    this.showPrizePopup = !this.showPrizePopup;
    this.getKittyPrizeDistribution();
  }

  ticketStatusPopUp() {
    this.showPopUp = !this.showPopUp;
  }

  roomCancelled() {
    this.roomDeleted = !this.roomDeleted;
  }

  leaveGame() {
    this.showPopUp = !this.showPopUp;
    this.leaveGamePopUp = !this.leaveGamePopUp;
  }

  getKittyPrizeDistribution() {
    this.roomService.getKittyPrize().subscribe((data: any) => {
      this.prizeDistribution = data.res;
    });
  }

  handleGameEvents(event) {
    const playerData = [];
    switch (event.eventName) {
      case SOCKET_EVENTS.PLAYERS_STATUS:
        if (event.data) {
          this.playersInfo = event.data.message.players;
          for (const player of this.playersInfo) {
            if (player['phoneNo'] === this.profile.phoneNo) {
              player['name'] = player['name'] + ' (You)';
              playerData.push(player);
            }
          }
          for (const player of this.playersInfo) {
            if (player['phoneNo'] !== this.profile.phoneNo) {
              playerData.push(player);
            }
          }
          this.playersInfo = playerData;
          this.kickOut = event.data.message.kicked_out;
          this.kickedOutPopUp();
        }
        break;
      case SOCKET_EVENTS.LEADER_STATUS:
        if (event.data) {
          this.roomCancelled();
        }
    }
  }

  redirectToHome() {
    this.analyticsService.clickTrack(
      'Kick Lobby Pop-up',
      'Jio Tambola 2 | Private Room Lobby'
    );
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: false
    });
    this.router.navigate(['tambola/events']);
  }

  openChatWindowOverlay(visibility) {
    this.analyticsService.clickTrack(
      'Chat | Private Room Lobby',
      'Jio Tambola 2 | Private Room Lobby'
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
