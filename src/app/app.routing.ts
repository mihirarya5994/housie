import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

import * as fromComponents from './components';

const routes: Routes = [
  {
    path: 'tambola',
    loadChildren: () => import('./tambola/tambola.module').then((m) => m.TambolaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'splash',
    pathMatch: 'full',
    component: fromComponents.SplashComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-capture',
    pathMatch: 'full',
    component: fromComponents.ProfileCaptureComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'index.html',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  }
];

export const AppRoutes = RouterModule.forRoot(routes);
