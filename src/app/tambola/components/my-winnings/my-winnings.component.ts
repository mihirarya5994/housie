import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';

import {
  TambolaService,
  WinPatterns,
  ExternalInterfaceService,
  AnalyticsService
} from 'src/app/core';

@Component({
  selector: 'app-my-winnings',
  templateUrl: './my-winnings.component.html',
  styleUrls: ['./my-winnings.component.scss']
})
export class MyWinningsComponent implements OnInit {
  winnings = [];
  loading = true;

  constructor(
    private tambolaService: TambolaService,
    private externalInterfaceService: ExternalInterfaceService,
    private clipboardService: ClipboardService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Prizes| My Winnings'
    );
    this.getMyWinnings();
  }

  getMyWinnings() {
    this.tambolaService.getMyWinnings().subscribe(res => {
      this.winnings = res.winnerDetails;
      (this.winnings || []).forEach(win => {
        win.expiryDate = new Date(win.expiryDate);
        win.expired = win.expiryDate < new Date();
        if (win.achievement) {
          const winPattern = WinPatterns.filter(
            pattern => pattern.type === win.achievement
          );
          if (win.achievement === 'fullhouse') {
            win.desc =
              win.desc ||
              `Thanks for successful 'Full House Prize' claim! JioEngage Team will review and contact you shortly.`;
            win.img = win.img || 'assets/images/brand-ball-icons/default.svg';
            win.name = win.name || 'Jio';
            win.couponCode = win.couponCode || null;
            win.claimUrl = win.claimUrl || null;
          }
          if (winPattern[0]) {
            win.achievement = winPattern[0].name;
          }
        }
      });
      this.loading = false;
    });
  }

  claim(win) {
    this.analyticsService.clickTrack(
      'Coupon Claim',
      win.name + '-' + win.couponCode
    );
    this.externalInterfaceService.launchBrowser(win.claimUrl);
  }

  copyCouponCode(win) {
    this.analyticsService.clickTrack(
      'Coupon Copy',
      win.name + '-' + win.couponCode
    );
    this.clipboardService.copyFromContent(win.couponCode);
  }

  checkTnc(tnc) {
    this.externalInterfaceService.launchBrowser(
      tnc
    );
  }
}
