import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClipboardModule } from 'ngx-clipboard';

import { SharedModule } from '../shared/shared.module';

import { TambolaComponent } from './tambola.component';
import { TambolaRoutes } from './tambola.routing';

import * as fromComponents from './components';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [CommonModule, ClipboardModule, SharedModule, TambolaRoutes, NgOtpInputModule],
  declarations: [TambolaComponent, ...fromComponents.components]
})
export class TambolaModule { }
