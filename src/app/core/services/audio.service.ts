import { Injectable } from '@angular/core';

import { Howl, Howler } from 'howler';

import { ExternalInterfaceService } from './external-interface.service';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  constructor(
    private profileService: ProfileService,
    private externalInterfaceService: ExternalInterfaceService
  ) {}

  playWithHowler(src, loop = false) {
    if (['true', true].includes(this.profileService.getProfileSync().sound)) {
      const sound = new Howl({
        src,
        loop
      });
      sound.play();
      return sound;
    }
  }

  play(name, loop = false) {
    if (['true', true].includes(this.profileService.getProfileSync().sound)) {
      this.externalInterfaceService.playSound({ path: 'NA', name, loop });
    }
  }

  mute() {
    Howler.mute(true);
    this.externalInterfaceService.stopSound();
  }

  unmute() {
    Howler.mute(false);
  }
}
