import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { CountdownService, ICountdown } from 'src/app/core';

@Component({
  selector: 'app-game-timer',
  templateUrl: './game-timer.component.html',
  styleUrls: ['./game-timer.component.scss']
})
export class GameTimerComponent implements OnInit, OnDestroy {
  @Input() forNextGame = false;
  @Input() date;
  @Output() start: EventEmitter<any> = new EventEmitter();

  private subscription: Subscription = new Subscription();

  timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  constructor(private countdownService: CountdownService) { }

  ngOnInit() {
    this.subscription.add(
      this.countdownService.getCountdownStream().subscribe((countdown: ICountdown) => {
        this.timeLeft = countdown;
        if (
          countdown.days === 0 &&
          countdown.hours === 0 &&
          countdown.minutes === 0 &&
          countdown.seconds === 0
        ) {
          this.start.emit();
        }
      })
    );

    this.countdownService.startCountdown(this.date);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.countdownService.stopCountdown();
  }
}
