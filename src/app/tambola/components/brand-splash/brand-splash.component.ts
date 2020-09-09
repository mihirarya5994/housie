import { Component, OnInit } from '@angular/core';

import { EventEmitterService, EventData, TambolaService } from '../../../core';

import { APP_EVENTS } from '../../../constants';

@Component({
  selector: 'app-brand-splash',
  templateUrl: './brand-splash.component.html',
  styleUrls: ['./brand-splash.component.scss']
})
export class BrandSplashComponent implements OnInit {
  show = false;
  splashImg;

  constructor(private tambolaService: TambolaService, private eventEmitterService: EventEmitterService) { }

  ngOnInit() {
    this.splashImg = this.tambolaService.getGameConfig().splash;
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.SHOW_BRAND_SPLASH) {
        this.show = true;
      } else if (event.type === APP_EVENTS.HIDE_BRAND_SPLASH) {
        this.show = false;
      }
    });
  }
}
