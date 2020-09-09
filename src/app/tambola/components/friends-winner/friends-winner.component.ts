import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  RoomService,
  TambolaService,
  AnalyticsService
} from 'src/app/core';

@Component({
  selector: 'app-friends-winner',
  templateUrl: './friends-winner.component.html',
  styleUrls: ['./friends-winner.component.scss']
})
export class FriendsWinnerComponent implements OnInit {
  currentEventSponsor;
  winnersResult: any[] = [];
  fullHouseWinner;
  otherWinner = [];
  loading = false;
  prizeDesc = [
    {
      type: 'first5',
      desc: 'Early 5'
    },
    {
      type: 'row1',
      desc: 'Top Line'
    },
    { type: 'row2', desc: 'Middle Line' },
    { type: 'row3', desc: 'Bottom Line' },
    { type: 'corners', desc: 'Corners' },
    { type: 'fullhouse', desc: 'Full House' }
  ];

  constructor(
    private roomService: RoomService,
    private tambolaService: TambolaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Full House Leaderboard Page'
    );
    const isSponsoredRoom = this.tambolaService.getCurrentSponsor() && this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
    } else {
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
    }
    this.getFriendsWinner();
  }

  getFriendsWinner() {
    this.roomService.getWinners(this.currentEventSponsor._id || this.currentEventSponsor.roomId).subscribe((res) => {
      this.winnersResult = res.result;
      this.loading = false;
      this.winnersResult.map(winner => {
        this.prizeDesc.forEach((prize) => {
          if (winner.prize === prize.type) {
            winner.value = prize.desc;
            if (winner.prize === 'fullhouse') {
              return this.fullHouseWinner = winner;
            }
          }
        });
        return winner;
      });
      this.otherWinner = this.winnersResult.filter(winner => {
        return winner.prize !== 'fullhouse';
      });
    });
  }

  continue() {
    this.analyticsService.clickTrack(
      'Continue | Full House Leaderboard Page',
      'Jio Tambola 2 | Full House Leaderboard Page'
    );
    this.router.navigate(['../../../events'], {
      relativeTo: this.activatedRoute
    });
  }

}
