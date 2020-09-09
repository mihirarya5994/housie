import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-native-back',
  templateUrl: './native-back.component.html',
  styleUrls: ['./native-back.component.scss']
})
export class NativeBackComponent implements OnInit {

  cta = [
    {
      id: 0,
      text: 'yes'
    },
    {
      id: 1,
      text: 'no'
    }
  ];

  @Output() handleCta: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() { }
  handleClick(button) {
    this.handleCta.emit(button);
  }

}
