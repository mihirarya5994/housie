import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import * as fromComponents from './components';
import * as fromPipes from './pipes';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [...fromComponents.components, ...fromPipes.pipes],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...fromComponents.components,
    ...fromPipes.pipes
  ]
})
export class SharedModule {}
