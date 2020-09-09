import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { GameConfig, TambolaService } from 'src/app/core';

@Component({
  selector: 'app-flipper',
  templateUrl: './flipper.component.html',
  styleUrls: ['./flipper.component.scss']
})
export class FlipperComponent implements OnInit {
  @Input() currentBall;
  @Input() flip = this.currentBall ? true : false;

  brandImage;

  private gameConfig: GameConfig;
  private previousBall;
  currentEventSponsor;

  constructor(
    private sanitizer: DomSanitizer,
    private tambolaService: TambolaService
  ) { }

  ngOnInit() {
    const isSponsoredRoom = this.tambolaService.getCurrentSponsor() && this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
    } else {
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
    }
    this.handleCurrentBall();
  }

  ngOnChanges() {
    this.handleCurrentBall();
  }

  handleCurrentBall() {
    if (this.currentBall !== this.previousBall) {
      this.gameConfig = this.tambolaService.getGameConfig();
      if (
        this.gameConfig.ballToBrandMap &&
        this.gameConfig.ballToBrandMap[+this.currentBall]
      ) {
        this.brandImage = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.gameConfig.ballToBrandMap[+this.currentBall]
        );
      } else {
        this.brandImage = 'assets/images/brand-ball-icons/tambola-ball.svg';
      }
      this.previousBall = this.currentBall;
    }
  }
}
