import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  RoomService,
  GameService,
  TambolaService,
  AnalyticsService
} from 'src/app/core';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  loading = true;
  roomName = '';
  ticketPrize: number;
  roomInfo = {
  };
  playerResponse: any;
  roomResponse: any;
  showPopUp = false;
  price = false;
  prizeDistribution;
  createdRoomName;
  validName = false;
  distributionDesc = {
    'first5': 'Early 5',
    'row1': 'Top Line',
    'row2': 'Middle Line',
    'row3': 'Bottom Line',
    'corners': 'Corners',
    'fullhouse': 'Full House'
  };
  isKeyBoardPresent = false;

  constructor(
    private gameService: GameService,
    private roomService: RoomService,
    private router: Router,
    private tambolaService: TambolaService,
    private analyticsService: AnalyticsService
  ) { }

  createGame() {
    this.tambolaService.setCurrentEventSponsor(null);
    this.inputValidator(this.roomInfo['name']);
    if (!this.createdRoomName) {
      this.validName = true;
      return;
    }
    this.validName = false;
    this.roomInfo = {
      'name': this.roomName,
      'ticketPrice': this.ticketPrize
    };
    this.roomService.createRoom(this.roomInfo).subscribe(res => {
      this.roomResponse = res;
      this.loading = false;
      this.tambolaService.setCurrentEvent(null);
      this.tambolaService.setCurrentEvent(res);
      this.tambolaService.setPlayerInfo({ ...res, isLeader: true });
      if (this.roomResponse.success) {
        if (this.roomResponse.roomId) {
          this.router.navigate(['tambola/room', this.roomResponse.roomId, 'manage']);
        }
      } else {
        switch (this.roomResponse.message) {
          case 'coins_insuf':
            this.analyticsService.clickTrack(
              'Insufficient Coins Popup',
              'Jio Tambola 2 | Create Private Room Lobby'
            );
            this.ticketStatusPopUp();
            this.price = true;
            break;
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
  }
  createPlayer() {
    this.analyticsService.clickTrack(
      'Create Game | Create Private Room Lobby',
      'Jio Tambola 2 | Create Private Room Lobby'
    );
    this.roomService.createPlayer().subscribe(res => {
      this.playerResponse = res;
      if (this.playerResponse.success) {
        this.createGame();
      }
    });
  }
  ticketStatusPopUp() {
    this.showPopUp = !this.showPopUp;
  }

  inputValidator($event) {
    const regex = new RegExp('^[a-zA-Z0-9 \'\-]+$');
    this.createdRoomName = regex.test(this.roomName);
  }


  priceUp() {
    if (this.ticketPrize === 100 || this.ticketPrize < 500) {
      this.ticketPrize = this.ticketPrize + 50;
    } else if (this.ticketPrize === 500 || this.ticketPrize < 2000) {
      this.ticketPrize = this.ticketPrize + 100;
    } else if (this.ticketPrize === 2000 || this.ticketPrize < 5000) {
      this.ticketPrize = this.ticketPrize + 500;
    } else if (this.ticketPrize === 5000 || this.ticketPrize < 20000) {
      this.ticketPrize = this.ticketPrize + 1000;
    } else if (this.ticketPrize === 20000 || this.ticketPrize < 100000) {
      this.ticketPrize = this.ticketPrize + 5000;
    }
  }
  priceDown() {
    if (this.ticketPrize === 100000 || this.ticketPrize > 20000) {
      this.ticketPrize = this.ticketPrize - 5000;
    } else if (this.ticketPrize === 20000 || this.ticketPrize > 5000) {
      this.ticketPrize = this.ticketPrize - 1000;
    } else if (this.ticketPrize === 5000 || this.ticketPrize > 2000) {
      this.ticketPrize = this.ticketPrize - 500;
    } else if (this.ticketPrize === 2000 || this.ticketPrize > 500) {
      this.ticketPrize = this.ticketPrize - 100;
    } else if (this.ticketPrize === 500 || this.ticketPrize > 100) {
      this.ticketPrize = this.ticketPrize - 50;
    }
  }

  getKittyPrizeDistribution() {
    this.roomService.getKittyPrize().subscribe((data: any) => {
      this.prizeDistribution = data.res;
    });
  }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Create Private Room Lobby'
    );
    this.loading = false;
    this.getKittyPrizeDistribution();
    this.ticketPrize = 100;
  }
}
