import { AnalyticsService } from './../../../core/services/analytics.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fastest-finger',
  templateUrl: './fastest-finger.component.html',
  styleUrls: ['./fastest-finger.component.scss']
})
export class FastestFingerComponent implements OnInit {
  @Output() proceed: EventEmitter<any> = new EventEmitter();

  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.clickTrack('Fastest Finger First Pop-up', 'Jio Tambola 2 | Home Page');
  }
  navigate() {
    this.analyticsService.clickTrack('Awesome', 'JioTambola 2 | Fastest Finger First Pop - up');
    this.proceed.emit();
  }
}
