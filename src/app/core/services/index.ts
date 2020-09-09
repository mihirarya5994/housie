import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';
import { AppService } from './app.service';
import { EventEmitterService } from './event-emitter.service';
import { ExternalInterfaceService } from './external-interface.service';
import { LoggerService } from './logger.service';
import { ProfileService } from './profile.service';
import { RestService } from './rest.service';
import { UtilService } from './util.service';
import { RouterService } from './router.service';
import { SocketService } from './socket.service';
import { CountdownService } from './countdown.service';
// import { TrackerService } from './tracker.service';
import { GameService } from './game.service';
import { ValidatorService } from './validator.service';
import { TambolaService } from './tambola.service';
import { AudioService } from './audio.service';
import { RoomService } from './room.service';
import { AnalyticsService } from './analytics.service';

export * from './app.service';
export * from './auth.service';
export * from './event-emitter.service';
export * from './external-interface.service';
export * from './logger.service';
export * from './profile.service';
export * from './rest.service';
export * from './util.service';
export * from './local-storage.service';
export * from './router.service';
export * from './socket.service';
export * from './countdown.service';
// export * from './tracker.service';
export * from './game.service';
export * from './validator.service';
export * from './tambola.service';
// export * from './tracker.service';
export * from './audio.service';
export * from './room.service';
export * from './analytics.service';

export const services = [
  AppService,
  AuthService,
  EventEmitterService,
  ExternalInterfaceService,
  LoggerService,
  ProfileService,
  RestService,
  UtilService,
  LocalStorageService,
  RouterService,
  SocketService,
  CountdownService,
  GameService,
  ValidatorService,
  TambolaService,
  AudioService,
  RoomService,
  AnalyticsService
];
