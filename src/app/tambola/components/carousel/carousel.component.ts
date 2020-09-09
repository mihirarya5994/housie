import { Router, ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

import * as Flickity from 'flickity';

import {
  ExternalInterfaceService,
  TambolaService,
  AppService,
  EventEmitterService
} from 'src/app/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { APP_EVENTS } from './../../../constants';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  currentEvent: any = {};
  haveMoreEventsToday = false;
  loading = true;
  @ViewChild('carousel', { static: true }) carousel: ElementRef;
  @Output() navigate: EventEmitter<any> = new EventEmitter();
  @Input() events;
  banners = [];
  _event: any[] = [];
  eventTypes = [
    {
      type: 'golden',
      folderPath: 'assets/images/free',
      banner: 'free-ticket.gif',
    }
  ];

  private slider;

  constructor(
  ) { }

  ngOnInit() {
    this._event = this.events;
    this.banners = (Array.isArray(this.events) ? this.events : []).map((e) => {
      this.eventTypes.forEach((t) => {
        if (e.type === t.type) {
          e.assetPath = t.folderPath;
          e.img = t.banner;
        }
      });
      return e;
    });
  }

  ngAfterViewInit() {
    this.initialize();
  }

  handleTimerEnd() {
    this.currentEvent.status = 'started';
  }

  initialize() {
    const self = this;

    this.slider = new Flickity(this.carousel.nativeElement, {
      prevNextButtons: false,
      autoPlay: 3000,
      contain: true,
      wrapAround: true
    });
    this.slider.on('pointerDown', function () {
      self.slider.on('pointerUp', self.onNavMouseleave.bind(self));
    });

  }

  onNavMouseleave() {
    this.slider.playPlayer();
    this.slider.off('pointerUp', this.onNavMouseleave.bind(this));
  }

  ngOnDestroy() {
    if (this.slider) {
      this.slider.off('pointerDown', this.onNavMouseleave.bind(this));
      this.slider.destroy();
    }
  }

  select(event) {
    this.navigate.emit(event);
  }
}
