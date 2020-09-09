import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  RoomService, TambolaService, AppService, AnalyticsService
} from 'src/app/core';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent implements OnInit {
  showRoomPopup = false;
  roomResponse: any;
  roomId = '';
  incorrectCode = false;
  roomVanished = false;
  roomStarted = false;
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  roomCode = '';
  details;
  config = {
    allowNumbersOnly: false,
    isPasswordInput: false,
    disableAutoFocus: false
  };
  loading = true;
  inputconfig;
  constructor
    (
      private router: Router,
      private roomService: RoomService,
      private tambolaService: TambolaService,
      private appService: AppService,
      private analyticsService: AnalyticsService
    ) { }

  toggleRoomPopup(condition) {
    switch (condition) {
      case 'cancelled':
        this.analyticsService.clickTrack(
          'No Game Leader | Wrong Code Pop-up',
          'Jio Tambola 2 | Private Room'
        );
        this.showRoomPopup = !this.showRoomPopup;
        break;
      case 'ended':
        this.analyticsService.clickTrack(
          'Wrong Code | Wrong Code Pop-up',
          'Jio Tambola 2 | Private Room'
        );
        this.showRoomPopup = !this.showRoomPopup;
        break;
      case 'ended':
        this.analyticsService.clickTrack(
          'Wrong Code | Wrong Code Pop-up',
          'Jio Tambola 2 | Private Room'
        );
        this.showRoomPopup = !this.showRoomPopup;
        break;
      case 'started':
        this.analyticsService.clickTrack(
          'Room Full | Wrong Code Pop-up',
          'Jio Tambola 2 | Private Room'
        );
        this.showRoomPopup = !this.showRoomPopup;
        break;
      case null:
        this.showRoomPopup = !this.showRoomPopup;
        break;
    }
  }

  onCodeChange(code) {
    this.roomCode = code;
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  joinRoom() {
    this.analyticsService.clickTrack(
      'Lets Play | Private Room',
      'Jio Tambola 2 | Private Room'
    );
    this.loading = true;
    this.tambolaService.setCurrentEventSponsor(null);
    const sixDigitCode = this.roomCode.toUpperCase();
    this.roomService.joinRoomWithCode(sixDigitCode).subscribe(res => {
      this.roomResponse = res;
      this.loading = false;
      this.details = this.tambolaService.setPlayerInfo({ ...res, isLeader: false });
      if (this.roomResponse.success === true) {
        switch (this.roomResponse.hasTicket) {
          case true:
            this.router.navigate(['tambola/events', this.roomResponse.roomId, 'quiz']);
            break;
          case false:
            this.router.navigate(['tambola/room', this.roomResponse.roomId, 'status']);
        }
      } else {
        switch (this.roomResponse.message) {
          case 'room_cancelled':
            this.toggleRoomPopup('cancelled');
            this.roomVanished = true;
            break;
          case 'room_ended':
            this.toggleRoomPopup('ended');
            this.incorrectCode = true;
            break;
          case 'room_not_found':
            this.toggleRoomPopup('ended');
            this.incorrectCode = true;
            break;
          case 'room_started':
            this.toggleRoomPopup('started');
            this.roomStarted = true;
        }
      }
    });
  }

  navigateToCreateRoom() {
    this.analyticsService.clickTrack(
      'Start a game | Private Room',
      'Jio Tambola 2 | Private Room'
    );
    this.router.navigate(['tambola/room/create']);
  }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Private Room'
    );
    this.roomService.getCoins().subscribe((res: any) => {
      this.roomService.setCoins(res.coins);
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
          'margin': '0px'
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
          'margin': '0px'
        }
      }
      return this.inputconfig;
    }
  }
}
