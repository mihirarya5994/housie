import { Component, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements AfterViewInit {
  @ViewChild('ad', { static: true }) adElement: ElementRef;

  @Input() adId = 'dfad65aa';
  @Input() type = 'banner';

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.adElement) {
        this.adElement.nativeElement.setAttribute('data-adspot-key', this.adId);
        this.adElement.nativeElement.setAttribute(
          'id',
          `ad_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        );
        this.adElement.nativeElement.setAttribute('data-language-of-article', 'eng');
      }
    });
  }
}
