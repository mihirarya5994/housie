import { Component, OnInit } from '@angular/core';
import {
  RoomService
} from 'src/app/core';

@Component({
  selector: 'app-earn-burn',
  templateUrl: './earn-burn.component.html',
  styleUrls: ['./earn-burn.component.scss']
})
export class EarnBurnComponent implements OnInit {
  couponList;
  loading = true;
  redeemed = false;
  couponPopUp = false;
  couponDetail: any[] = [];
  couponCoins;
  successPopUp = false;
  couponDescription;
  noData = false;

  constructor(
    private roomService: RoomService,
  ) { }

  getEarnBurnCouponList() {
    this.roomService.earnBurnCoupons().subscribe(res => {
      if (res.resp === null) {
        this.noData = true;
        this.loading = false;
      } else {
        this.couponList = Object.entries(res.resp.prizecoupons);
        this.loading = false;
      }
    });
  }

  buyCoupon(coupon) {
    this.roomService.burnCoupon(coupon).subscribe((res: any) => {
      if (res.success) {
        this.couponPopUp = false;
        this.roomService.setCoins(res.coins);
        coupon.redeemed = !coupon.redeemed;
        setTimeout(() => {
          this.successPopUp = true;
        }, 1000);
      }
    });
  }

  buyCouponConfirmation(coupon) {
    this.couponDetail = coupon;
    this.couponPopUp = true;
    this.couponCoins = this.couponDetail[1].coins;
    this.couponDescription = this.couponDetail[2];
  }

  claimCoupon() {
    this.couponPopUp = false;
  }

  closeSucessPopUp() {
    this.successPopUp = false;
    this.redeemed = true;
  }

  ngOnInit() {
    this.getEarnBurnCouponList();
  }

}
