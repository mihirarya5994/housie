import { DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  SecurityContext
} from '@angular/core';

import { TambolaService } from 'src/app/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  @ViewChild('ticketEle', { static: true }) ticketEle: ElementRef;
  @Input() ticketId = null;
  @Input() daubed: number[] = [];
  @Input() disabled = true;
  @Input() cancelled = false;

  @Output() daub: EventEmitter<any> = new EventEmitter();

  ticketMatrix: any[][] = [];
  bgImage;
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
    const gameConfig = this.tambolaService.getGameConfig();
    if (gameConfig && gameConfig.theme) {
      this.bgImage = this.sanitizer.sanitize(
        SecurityContext.RESOURCE_URL,
        this.sanitizer.bypassSecurityTrustResourceUrl(gameConfig.theme)
      );
      // this.ticketEle.nativeElement.style.background = `url('${this.bgImage}') no-repeat center center`;
      // this.ticketEle.nativeElement.style.backgroundSize = '100% 100%';
    }
  }

  @Input()
  set matrix(matrix) {
    matrix = matrix || [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.ticketMatrix[i] = this.ticketMatrix[i] || [];
        this.ticketMatrix[i][j] = {
          number: matrix[i][j],
          daubed: this.daubed.includes(matrix[i][j])
        };
      }
    }
  }

  daubNumber(rowIndex, colIndex) {
    if (this.ticketMatrix[rowIndex][colIndex].number !== '0') {
      this.ticketMatrix[rowIndex][colIndex].daubed = !this.ticketMatrix[
        rowIndex
      ][colIndex].daubed;
      this.daub.emit({
        daub: this.ticketMatrix[rowIndex][colIndex].daubed,
        number: this.ticketMatrix[rowIndex][colIndex].number
      });
    }
  }

  getTicketMatrix() {
    return this.ticketMatrix;
  }
}
