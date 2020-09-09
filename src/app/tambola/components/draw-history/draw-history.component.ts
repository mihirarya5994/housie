import { Component, OnInit, Input } from '@angular/core';
import {
  TambolaService
} from 'src/app/core';

@Component({
  selector: 'app-draw-history',
  templateUrl: './draw-history.component.html',
  styleUrls: ['./draw-history.component.scss']
})
export class DrawHistoryComponent implements OnInit {
  @Input() board = [];
  currentEventSponsor;
  private drawHistory = [];

  constructor(
    private tambolaService: TambolaService
  ) {}

  ngOnInit() {
    const isSponsoredRoom = this.tambolaService.getCurrentSponsor() && this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
      // this.gameType = this.tambolaService.getCurrentSponsor().type;
    } else {
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
      // this.gameType = 'private';
    }
    for (let i = 0; i < 9; i++) {
      this.board[i] = this.board[i] || [];
      for (let j = 0; j < 10; j++) {
        this.board[i].push({ number: i * 10 + j + 1, called: false });
      }
    }
    this.applyHistory();
  }

  @Input()
  set history(history) {
    this.drawHistory = history;
    this.applyHistory();
  }

  private applyHistory() {
    if (this.board.length && this.drawHistory.length) {
      this.drawHistory.forEach(number => {
        let remainder = number % 10;
        let division = Math.floor(number / 10);
        if (remainder === 0) {
          division = division - 1;
          remainder = 9;
        } else {
          remainder = remainder - 1;
        }
        this.drawHistory.forEach(number => {
          this.board[division][remainder].called = true;
        });
      });
    }
  }
}
