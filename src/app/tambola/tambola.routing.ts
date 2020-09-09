import { Routes, RouterModule } from '@angular/router';

import { TambolaComponent } from './tambola.component';

import * as fromComponents from './components';
import { RouteGuard } from '../core';

const routes: Routes = [
  {
    path: '',
    component: TambolaComponent,
    children: [
      {
        path: 'events',
        component: fromComponents.EventsComponent,
        data: { showFooter: true, backTo: '/splash' },
        canActivate: []
      },
      {
        path: 'events/:eventId/quiz',
        component: fromComponents.QuizComponent,
        data: { showFooter: false, backTo: '/tambola' },
        canActivate: []
      },
      {
        path: 'events/:eventId/game',
        component: fromComponents.GameComponent,
        data: { showFooter: false, backTo: '/tambola' },
        canActivate: []
        // canDeactivate: [RouteGuard]
      },
      {
        path: 'events/:eventId/results',
        component: fromComponents.GameResultsComponent,
        data: { showFooter: true, backTo: '/tambola' },
        canActivate: []
      },
      {
        path: 'prizes',
        component: fromComponents.PrizesComponent,
        data: { showFooter: true },
        canActivate: []
      },
      {
        path: 'room',
        component: fromComponents.RoomComponent,
        data: { showFooter: false },
        canActivate: []
      },
      {
        path: 'room/create',
        component: fromComponents.CreateRoomComponent,
        data: { showFooter: false },
        canActivate: []
      },
      {
        path: 'room/:roomId/status',
        component: fromComponents.RoomStatusComponent,
        data: { showFooter: false, backTo: '/tambola' },
        canActivate: []
      },
      {
        path: 'room/:roomId/manage',
        component: fromComponents.ManageRoomComponent,
        data: { showFooter: false, backTo: '/tambola' },
        canActivate: []
        // canDeactivate: [RouteGuard]
      },
      {
        path: 'settings',
        component: fromComponents.SettingsComponent,
        data: { showFooter: true },
        canActivate: []
      },
      {
        path: 'events/:eventId/friends-result',
        component: fromComponents.FriendsWinnerComponent,
        data: { showFooter: true },
        canActivate: []
      },
      {
        path: 'profile',
        component: fromComponents.ProfileComponent,
        data: { showFooter: false },
        canActivate: []
      },
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full'
      }
    ]
  }
];

export const TambolaRoutes = RouterModule.forChild(routes);
