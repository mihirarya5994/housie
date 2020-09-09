import { AuthGuard } from './auth.guard';
import { RouteGuard } from './route.guard';
// import { GameGuard } from './game.guard';

export * from './auth.guard';
export * from './route.guard';
// export * from './game.guard';

export const guards = [AuthGuard, RouteGuard];
