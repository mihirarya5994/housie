import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { AppService } from './app.service';
import { SocketService } from './socket.service';
import { LoggerService } from './logger.service';
import { EventEmitterService } from './event-emitter.service';

import { SOCKET_EVENTS, APP_EVENTS } from './../../constants';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  isGameEvent;
  private gameEvents$: Subject<any> = new Subject();
  private chatEvents$: Subject<any[]> = new Subject();
  private socket;
  private gameChannel;
  private eventId = null;
  private chatOffset = 0;

  constructor(
    private appService: AppService,
    private socketService: SocketService,
    private logger: LoggerService,
    private eventEmitterService: EventEmitterService,
    private roomService: RoomService
  ) { }

  initialize(eventId, isPrivateRoom = false, isGameEvent = false) {
    this.eventId = eventId;
    this.connect();
    this.isGameEvent = isGameEvent;
    if (isGameEvent) {
      this.roomService.startGameEvent(this.eventId).subscribe((data: any) => {
      });
    }
  }

  private connect() {
    this.socket = this.socketService
      .getSocket()
      .on('unsubscribe', this.socketUnsubscriptionHandler.bind(this))
      .on('connect', this.socketConnectHandler.bind(this))
      .on('error', this.socketErrorHandler.bind(this));
  }

  private socketUnsubscriptionHandler(channelName) {
    this.logger.warn('UNSUBSCRIBED FROM ', channelName);
  }

  private socketConnectHandler() {
    this.logger.warn('SOCKET CONNECTED');
    this.doSocketLogin();
  }

  private socketErrorHandler(error) {
    this.logger.error('SOCKET ERROR > ', error);
    this.socketService.unsubscribe(this.socket, this.gameChannel);
  }

  private doSocketLogin() {
    this.socketService.emit(this.socket, SOCKET_EVENTS.LOGIN, this.eventId, {}, (err) => {
      if (!err) {
        this.gameEvents$.next({
          eventName: SOCKET_EVENTS.SOCKET_AUTHENTICATED,
          data: { authenticated: true }
        });
        // if (this.isGameEvent) {
        //   this.getCurrentGameStateOnSocket();
        //   this.registerGameEventsListener();
        //   this.getCurrentUserStateOnSocket();
        // }
        this.getCurrentGameStateOnSocket();
        this.registerGameEventsListener();
        this.getCurrentUserStateOnSocket();
        this.getPlayerStatusOnSocket();
        this.registerChatEvents();
      } else {
        this.logger.error('socket login error ', err);
      }
    });
  }

  private getPlayerStatusOnSocket() {
    this.socketService.emit(this.socket, SOCKET_EVENTS.PLAYERS_STATUS, this.eventId, {}, (err, res) => {
      if (!err) {
        this.gameEvents$.next({ eventName: SOCKET_EVENTS.PLAYERS_STATUS, data: res });
      } else {
        this.logger.error('Error fetching current player status state > ', err);
      }
    });
  }
  private getCurrentGameStateOnSocket() {
    this.socketService.emit(this.socket, SOCKET_EVENTS.GAME_STATE, this.eventId, {}, (err, res) => {
      if (!err) {
        this.gameEvents$.next({ eventName: SOCKET_EVENTS.GAME_STATE, data: res });
      } else {
        this.logger.error('Error fetching current game state > ', err);
      }
    });
  }

  private getCurrentUserStateOnSocket() {
    this.socketService.emit(this.socket, SOCKET_EVENTS.USER_GAME_STATE, this.eventId, {}, (err, res) => {
      if (!err) {
        this.gameEvents$.next({ eventName: SOCKET_EVENTS.USER_GAME_STATE, data: res });
      } else {
        this.logger.error('Error fetching current user state > ', err);
      }
    });
  }

  private registerGameEventsListener() {
    this.gameChannel = this.socketService.subscribe(
      `${this.appService.getEnvVariable('GAME_BROADCAST_CHANNEL_NAME')}-${this.eventId}`,
      (event) => this.handleGameEvent(event)
    );
  }

  private handleGameEvent(event) {
    this.logger.log(new Date(), event);
    this.gameEvents$.next(event);
  }

  getParticipantsCountOnSocket() {
    this.socketService.emit(
      this.socket,
      SOCKET_EVENTS.PARTICIPANTS_COUNT, this.eventId, {}, (err, res) => {
        this.eventEmitterService.emit({ type: APP_EVENTS.REFRESH_PARTICIPANTS_COUNT, data: { count: res.count } });
      });
  }

  daubNumber(number) {
    return new Observable((observer) => {
      this.socketService.emit(
        this.socket,
        SOCKET_EVENTS.DAUB_NUMBER,
        this.eventId,
        { number, event: 'cross' },
        (err, res) => {
          if (!err) {
            observer.next({ success: true });
            observer.complete();
            this.logger.log(`Daubed ${number}`);
          } else {
            observer.next({ success: false });
            observer.complete();
            this.logger.error('Error daubing ${number}');
          }
        }
      );
    });
  }

  undaubNumber(number) {
    return new Observable((observer) => {
      this.socketService.emit(
        this.socket,
        SOCKET_EVENTS.DAUB_NUMBER,
        this.eventId,
        { number, event: 'uncross' },
        (err, res) => {
          if (!err) {
            observer.next({ success: true });
            observer.complete();
            this.logger.log(`Undaubed ${number}`);
          } else {
            observer.next({ success: false });
            observer.complete();
            this.logger.error('Error undaubing ${number}');
          }
        }
      );
    });
  }

  claimSecretReward() {
    return new Observable((observer) => {
      this.socketService.emit(
        this.socket,
        SOCKET_EVENTS.CLAIM_WIN,
        this.eventId,
        { claimPrize: 'secretreward' },
        (err, res) => {
          if (!err) {
            observer.next(res);
            observer.complete();
          } else {
            this.logger.log('Error claiming prize > ', err);
            observer.next({ error: true });
            observer.complete();
          }
        }
      );
    });
  }

  claimWin(claimPrize, type) {
    return new Observable((observer) => {
      this.socketService.emit(this.socket, SOCKET_EVENTS.CLAIM_WIN, this.eventId, { claimPrize, type }, (err, res) => {
        if (!err) {
          observer.next(res);
          observer.complete();
        } else {
          this.logger.log('Error claiming prize > ', err);
          observer.next({ error: true });
          observer.complete();
        }
      });
    });
  }

  getGameEvents() {
    return this.gameEvents$;
  }

  sendMessageChat(message, userName) {
    this.socketService.emit(this.socket, SOCKET_EVENTS.CHAT, this.eventId, {
      chat: {
        text: message,
        name: userName,
      },
    }, (err, res) => {
      if (err) {
        this.logger.error('error getting chat event', err);
      }
    });
  }

  /**
   * get Chats
   * @param value number of chats to show from - 52 (for 52 to 100)
   */
  getChats() {
    this.socketService.emit(
      this.socket,
      SOCKET_EVENTS.GET_CHAT,
      this.eventId, { offset: this.chatOffset },
      (err, res) => {
        if (!err && res) {
          if (res && res.length && res.length === 0) {
            return;
          } else {
            this.chatOffset += 51;
            this.triggerChatEvent(res);
          }
        }
      }
    );
  }

  refreshChats() {
    this.chatOffset = 0;
  }

  triggerChatEvent(chats) {
    this.chatEvents$.next(chats);
  }

  getChatEventsStream() {
    return this.chatEvents$;
  }

  private registerChatEvents() {
    this.gameChannel = this.socketService.subscribe(
      `${this.appService.getEnvVariable('GAME_BROADCAST_CHANNEL_NAME')}-${this.eventId}`,
      (event) => {
        if (event && event.eventName === SOCKET_EVENTS.LAST_CHAT) {
          this.triggerChatEvent(event);
          this.eventEmitterService.emit({
            type: APP_EVENTS.NOTIFY,
            data: event
          });
        }
      }
    );
  }

  dispose() {
    if (this.socket) {
      this.socketService.unsubscribe(this.socket, this.gameChannel);
      this.socketService.destroySocket();
      this.socket = null;
      this.gameChannel = null;
    }
  }
}
