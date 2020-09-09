import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TambolaService, WinPatterns, AnalyticsService } from 'src/app/core';

@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.scss']
})
export class GameResultsComponent implements OnInit {
  loading = true;
  currentEvent;
  results: any = {};
  currentEventSponsor;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private tambolaService: TambolaService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    const isSponsoredRoom = this.tambolaService.getCurrentSponsor() && this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
    } else {
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
    }
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Full House Claimed Page'
    );
    this.activatedRoute.params
      .pipe(
        switchMap((params) =>
          this.tambolaService.getCurrentEvent()
            ? of(this.tambolaService.getCurrentEvent())
            : this.tambolaService.getEventById(params.eventId)
        )
      )
      .subscribe((event) => {
        this.currentEvent = event;
        this.getGameResults();
      });
  }

  getGameResults() {
    this.tambolaService.getGameResults(this.currentEventSponsor._id || this.currentEventSponsor.roomId).subscribe((res) => {
      this.results = res;
      this.results.myprizes = this.results.myprizes.map((prize) => ({
        name: this.getPrizeName(prize),
        image: this.getPrizeImage(prize)
      }));
      this.loading = false;
    });
  }

  getPrizeName(type) {
    const pattern = WinPatterns.filter((p) => p.type === type)[0];
    return pattern.name;
  }

  getPrizeImage(type) {
    const gameConfig = this.tambolaService.getGameConfig();
    if (gameConfig.prizeCoupons) {
      const prizeConfig = gameConfig.prizeCoupons[type];
      if (prizeConfig) {
        return this.sanitizer.sanitize(
          SecurityContext.RESOURCE_URL,
          this.sanitizer.bypassSecurityTrustResourceUrl(prizeConfig.imageUrl)
        );
      }
      return null;
    }
    return null;
  }

  continue() {
    this.analyticsService.clickTrack(
      'Continue | Full House Claimed Page',
      'Jio Tambola 2 | Full House Claimed Page'
    );
    this.router.navigate(['../../../prizes'], {
      relativeTo: this.activatedRoute
    });
  }
}
