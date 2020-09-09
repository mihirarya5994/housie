import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

import { environment } from 'src/environments/environment';

@Injectable()
export class AppService {
  private timeOffset = 0;
  private selectedLanguage = 'eng';
  private soundEnabled = true;
  private hasGameStartSoundBeenPlayed = false;
  private hasGameEndSoundBeenPlayed = false;
  private hasWelcomeSoundBeenPlayed = false;
  userPhoneNo;

  constructor(private localStorageService: LocalStorageService) { }

  getIsSoundEnabled() {
    return (
      this.soundEnabled ||
      (typeof this.localStorageService.getItem('sound') !== 'undefined'
        ? this.localStorageService.getItem('sound')
        : true)
    );
  }

  setIsSoundEnabled(val) {
    this.soundEnabled = val;
    this.localStorageService.addItem('sound', val);
  }

  getEnvVariable(param) {
    return environment[param];
  }

  setCurrentTimeOffset(offset) {
    this.timeOffset = offset;
  }

  getCurrentTimeOffset() {
    return this.timeOffset;
  }

  setAppLanguage(langCode) {
    langCode = langCode || 'eng';
    this.selectedLanguage = langCode;
    this.localStorageService.addItem('language', langCode);
  }

  setUserPhoneNo(phoneNo) {
    this.userPhoneNo = phoneNo;
  }
  getUserPhoneNo() {
    return this.userPhoneNo;
  }

  getAppLanguage() {
    return (
      this.selectedLanguage || this.localStorageService.getItem('language')
    );
  }

  getOS() {
    if (navigator.userAgent.match(/Android/i)) {
      return 'android';
    }
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return 'ios';
    }
    return 'others';
  }

  setHasGameStartSoundBeenPlayed(bool) {
    this.hasGameStartSoundBeenPlayed = bool;
  }

  getHasGameStartSoundBeenPlayed() {
    return this.hasGameStartSoundBeenPlayed;
  }

  setHasGameEndSoundBeenPlayed(bool) {
    this.hasGameEndSoundBeenPlayed = bool;
  }

  getHasGameEndSoundBeenPlayed() {
    return this.hasGameEndSoundBeenPlayed;
  }

  setHasWelcomeSoundBeenPlayed(bool) {
    this.hasWelcomeSoundBeenPlayed = bool;
  }

  getHasWelcomeSoundBeenPlayed() {
    return this.hasWelcomeSoundBeenPlayed;
  }
}
