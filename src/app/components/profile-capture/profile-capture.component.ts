import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  ProfileService,
  ValidatorService
} from 'src/app/core/';

import { AGE_GROUPS, GENDERS, STATE_LIST } from 'src/app/constants';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile-capture',
  templateUrl: './profile-capture.component.html',
  styleUrls: ['./profile-capture.component.scss']
})
export class ProfileCaptureComponent implements OnInit {
  dropdownPopupConfig: any = {};
  showDropdownPopup = false;
  profile = {
    nickName: '',
    ageGroup: '',
    gender: '',
    state: '',
    emailId: ''
  };
  showThankYouContent = false;
  submitting = false;
  errors: any = {};
  isKeyBoardPresent = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit() {
    this.profileService.getServerProfile().subscribe(profile => {
      this.profile.nickName = profile.nickName;
      this.profile.ageGroup = profile.ageGroup;
      this.profile.gender = profile.gender;
      this.profile.state = profile.state;
      this.profile.emailId = profile.emailId;
    });
  }

  handleSelectClick(event: MouseEvent, type) {
    event.preventDefault();
    event.stopImmediatePropagation();

    this.toggleDropdownPopup();
    if (type === 'ageGroup') {
      this.dropdownPopupConfig.title = 'Age';
      this.dropdownPopupConfig.key = 'ageGroup';
      this.dropdownPopupConfig.values = AGE_GROUPS;
    }
    if (type === 'gender') {
      this.dropdownPopupConfig.title = 'Gender';
      this.dropdownPopupConfig.key = 'gender';
      this.dropdownPopupConfig.values = GENDERS;
    }
    if (type === 'state') {
      this.dropdownPopupConfig.title = 'State';
      this.dropdownPopupConfig.key = 'state';
      this.dropdownPopupConfig.values = STATE_LIST;
    }
  }

  toggleDropdownPopup() {
    this.showDropdownPopup = !this.showDropdownPopup;
  }

  handleSelectValue(value) {
    this.profile[this.dropdownPopupConfig.key] = value;
    this.toggleDropdownPopup();
  }

  validate() {
    this.errors = {};
    if (
      !this.validatorService.isValidNickName(
        (this.profile.nickName || '').trim()
      )
    ) {
      this.errors.nickName = 'Please enter a valid nick name.';
      return false;
    }
    if ((this.profile.nickName || '').length < 2) {
      this.errors.nickName = 'Nick name should at least be 2 characters long.';
      return false;
    }
    if (!this.profile.ageGroup || '') {
      this.errors.ageGroup = 'Please select your age.';
      return false;
    }
    if (!this.profile.state || '') {
      this.errors.state = 'Please select your state. ';
      return false;
    }
    if (!this.profile.gender || '') {
      this.errors.gender = 'Please select gender.';
      return false;
    }
    if (this.profile.emailId) {
      if (!this.validatorService.isEmail(
        (this.profile.emailId || ''))) {
        this.errors.emailId = 'Please enter a valid email.';
        return false;
      }
    } else {
      return true;
    }

    return true;
  }

  skip() {
    this.router.navigate(['/tambola'], {
      relativeTo: this.activatedRoute
    });
  }

  submitProfile() {
    if (this.submitting || !this.validate()) {
      return;
    }

    this.submitting = true;
    if (this.profile) {
      forkJoin([
        this.profileService.updateServerProfile(this.profile)
      ]).subscribe(
        () => {
          this.showThankYouContent = true;
          setTimeout(() => {
            this.router.navigate(['/tambola'], {
              relativeTo: this.activatedRoute
            });
            this.showThankYouContent = false;
            this.submitting = false;
          }, 3000);
        },
        err => (this.errors.global = err)
      );
    }
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
  }
}
