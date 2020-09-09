
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss']
})
export class PrizesComponent implements OnInit {

  tabs = [
    {
      id: 1,
      title: 'My Winnings'
    },
    {
      id: 2,
      title: 'Winners'
    },
    {
      id: 3,
      title: 'Redeem'
    }
  ];
  activeTab;

  constructor(
  ) { }

  ngOnInit() {
    this.setTab(this.tabs[0]);
  }

  setTab(tab) {
    this.activeTab = tab;
  }
}
