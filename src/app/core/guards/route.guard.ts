import { APP_EVENTS } from './../../constants/app-events';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEmitterService } from './../services';

export interface ComponentCanDeactivate {
  canDeactivate: () => any | Observable<any>;
}

@Injectable({
  providedIn: 'root'
})

export class RouteGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(
    private eventEmitterService: EventEmitterService
  ) { }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    const result = component.canDeactivate();
    if (typeof result.show === 'boolean') {
      if (result.show) {
        // this.eventEmitterService.emit({
        //   type: APP_EVENTS.SHOW_POP_UP,
        //   data: null
        // });
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
