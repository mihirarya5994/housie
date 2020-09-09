import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-draws',
  templateUrl: './recent-draws.component.html',
  styleUrls: ['./recent-draws.component.scss']
})
export class RecentDrawsComponent {
  @Input() matrix = [];

  ballDraws = [];
  daubs = [];

  @Input()
  set numbers(numbers) {
    this.ballDraws = numbers.slice(-6).map((number) => ({ number, opaque: false }));
    this.checkDraws();
  }

  @Input()
  set daubed(daubs) {
    this.daubs = daubs;
    this.checkDraws();
  }

  checkDraws() {
    this.ballDraws = this.ballDraws.map((number) => ({
      number: number.number,
      opaque:
        this.matrix.reduce((a1, a2) => a1.concat(a2)).includes(number.number) &&
        !this.daubs.includes(number.number)
    }));
  }
}
