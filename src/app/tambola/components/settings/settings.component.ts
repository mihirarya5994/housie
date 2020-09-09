import { Component, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';

import {
  ValidatorService,
  ExternalInterfaceService,
  AppService,
  EventEmitterService,
  ProfileService, AnalyticsService
} from 'src/app/core/';

import { APP_EVENTS } from './../../../constants';

import { AGE_GROUPS, GENDERS, STATE_LIST } from 'src/app/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  submitted = false;
  dropdownPopupConfig: any = {};
  showDropdownPopup;
  centralProfile: any = {};
  gameProfile: any = {};
  errors: any = {};
  submitting = false;
  isFormDirty = false;
  isKeyBoardPresent = false;

  constructor(
    private ngZone: NgZone,
    private appService: AppService,
    private profileService: ProfileService,
    private validatorService: ValidatorService,
    private externalInterfaceService: ExternalInterfaceService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private analyticsService: AnalyticsService

  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2|Setting Screen'
    );
    this.getServerProfile();
    this.getProfile();
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
    this.eventEmitterService.emit({
      type: APP_EVENTS.KEYBOARD_PRESENT,
      data: this.isKeyBoardPresent
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
    this.centralProfile[this.dropdownPopupConfig.key] = value;
    this.toggleDropdownPopup();
  }

  validate() {
    this.errors = {};
    if (
      !this.validatorService.isValidNickName(
        (this.centralProfile.nickName || '').trim()
      )
    ) {
      this.errors.nickName = 'Please enter a valid nick name.';
      return false;
    }
    if ((this.centralProfile.nickName || '').trim().length < 2) {
      this.errors.nickName = 'Nick name should at least be 2 characters long.';
      return false;
    }
    if (!this.centralProfile.ageGroup || '') {
      this.errors.ageGroup = 'Please select an age.';
      return false;
    }
    if (!this.centralProfile.state || '') {
      this.errors.state = 'Please select a state. ';
      return false;
    }
    if (!this.centralProfile.gender || '') {
      this.errors.gender = 'Please select gender.';
      return false;
    }
    if (this.centralProfile.emailId) {
      if (!this.validatorService.isEmail(
        (this.centralProfile.emailId || ''))) {
        this.errors.emailId = 'Please enter a valid email.';
        return false;
      }
    } else {
      return true;
    }
    return true;
  }

  getServerProfile() {
    this.profileService.getServerProfile().subscribe(res => {
      this.centralProfile = res;
      const self = this;
      const proxyHandler: ProxyHandler<any> = {
        set(target, key, value) {
          target[key] = value;
          self.ngZone.run(() => (self.isFormDirty = true));
          return true;
        }
      };
      this.centralProfile = new Proxy(this.centralProfile, proxyHandler);
    });
  }

  getProfile() {
    this.profileService.getProfile().subscribe(res => {
      this.gameProfile = res;
    });
  }

  toggleSound() {
    this.gameProfile.sound = !this.gameProfile.sound;
    this.profileService
      .updateProfile({ sound: this.gameProfile.sound })
      .subscribe();
    this.appService.setIsSoundEnabled(this.gameProfile.sound);
  }

  submitProfile() {
    this.submitted = true;
    if (!this.validate()) {
      return;
    }
    this.submitting = true;
    if (this.centralProfile) {
      this.profileService
        .updateServerProfile({
          nickName: this.centralProfile.nickName,
          ageGroup: this.centralProfile.ageGroup,
          gender: this.centralProfile.gender,
          state: this.centralProfile.state,
          sound: this.centralProfile.sound,
          language: this.centralProfile.language,
          emailId: this.centralProfile.emailId
        })
        .subscribe(
          () => {
            this.submitting = false;
            this.isFormDirty = false;
            this.router.navigate(['tambola/events']);
            this.eventEmitterService.emit({
              type: APP_EVENTS.KEYBOARD_PRESENT,
              data: false
            });
          },
          err => (this.submitting = false)
        );
    }
  }

  launchUrl(type) {
    switch (type) {
      case 'how-to-play':
        this.externalInterfaceService.launchBrowser(
          this.appService.getEnvVariable('HOW_TO_PLAY_URL')
        );
        break;
      case 'faq':
        this.externalInterfaceService.launchBrowser(
          this.appService.getEnvVariable('FAQ_URL')
        );
        break;
      case 'tnc':
        this.externalInterfaceService.launchBrowser(
          this.appService.getEnvVariable('TNC_URL')
        );
        break;
      case 'invite':
        this.externalInterfaceService.share(
          this.appService.getEnvVariable('SHARE_MESSAGE')
        );
        break;
    }
  }

  ngOnDestroy() {
    this.eventEmitterService.emit({
      type: APP_EVENTS.SHOW_FOOTER,
      data: true
    });
  }
}
