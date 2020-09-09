import { WinPatterns } from './../../../core/models/game-state';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';

import { TambolaService, AnalyticsService } from '../../../core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss']
})
export class WinnersComponent implements OnInit, OnDestroy {
  @ViewChild('winner', { static: false }) winner: ElementRef;
  events;
  loading = true;
  loadingWinners = false;
  activeEvent;
  timeoutIds = [];
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  constructor(
    private tambolaService: TambolaService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Prizes| Winners'
    );
    this.tambolaService
      .getPastEventsForWinnings()
      .pipe(map(res => (Array.isArray(res) ? res : [])))
      .subscribe(res => this.processEvents(res));
  }

  processEvents(events) {
    events.forEach(event => {
      event.hours = new Date(event.start).getHours();
      if (event.hours === 0) {
        event.hours = 12;
        event.meridian = 'AM';
      } else if (event.hours > 12) {
        event.meridian = 'PM';
        event.hours = event.hours % 12;
      } else if (event.hours < 12) {
        event.meridian = 'AM';
      }
      event.date = new Date(event.start).getDate();
      event.month = this.months[new Date(event.start).getMonth()];
    });
    this.events = events;
    if (this.events[this.events.length - 1]) {
      this.getWinnersForEvent(this.events[this.events.length - 1]);
    }
    this.loading = false;
  }

  getWinnersForEvent(event) {
    this.loadingWinners = true;
    if (this.activeEvent !== event) {
      this.activeEvent = event;
      this.tambolaService
        .getWinnersForEvent(this.activeEvent._id)
        .pipe(map(res => (Array.isArray(res) ? res : [])))
        .subscribe(res => {
          const patternsMap = {};
          WinPatterns.forEach(pattern => (patternsMap[pattern.type] = pattern));
          this.activeEvent.winners = res.map(winner => JSON.parse(winner));
          this.activeEvent.winners.forEach(
            winner => (winner.prize = patternsMap[winner.prize].name)
          );
          this.timeoutIds.push(
            setTimeout(() => {
              this.scrollToTodaysReward();
            }, 50)
          );
          this.loadingWinners = false;
        });
    }
  }

  scrollToTodaysReward() {
    const recentEvent = this.winner.nativeElement.querySelector(
      '.calendar-item.active'
    );
    if (recentEvent) {
      this.winner.nativeElement.scrollLeft =
        recentEvent.offsetLeft -
        screen.width / 2 +
        recentEvent.getBoundingClientRect().width / 2;
    }
  }

  ngOnDestroy() {
    this.timeoutIds.forEach(timeoutId => timeoutId && clearTimeout(timeoutId));
  }
}
