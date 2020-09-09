import { Injectable } from '@angular/core';

import isEmail from 'validator/lib/isEmail';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  constructor() { }

  isEmail(email) {
    return isEmail(email);
  }

  isValidNickName(nickName) {
    return /^[a-zA-Z0-9]*[^\s]/.test(nickName);
  }
}
