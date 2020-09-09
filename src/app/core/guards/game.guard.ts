import { Injectable, EventEmitter } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EventEmitterService } from './../services';

@Injectable({
  providedIn: 'root'
})

export class GameGuard implements CanActivate {
  constructor(
  private router: Router,
  private eventEmitterService: EventEmitterService
  ) {}

canActivate(route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot): boolean | Observable<boolean> {
  alert('in game guard');
  return true;
  }
}
