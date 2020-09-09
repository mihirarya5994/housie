import { Injectable } from '@angular/core';

import * as SocketCluster from 'socketcluster-client';

import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import { TambolaService } from './tambola.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: any = null;

  constructor(
    private appService: AppService,
    private authService: AuthService,
    private tambolaService: TambolaService,
    private logger: LoggerService) { }

  getSocket(path?) {
    if (!this.socket) {
      const params = {
        hostname: this.appService.getEnvVariable('SOCKET_CLUSTER_HOST'),
        port: this.appService.getEnvVariable('SOCKET_CLUSTER_PORT'),
        secure: true
      };
      if (path) {
        Object.assign(params, { path });
      }
      this.socket = SocketCluster.connect(params);
    }
    return this.socket;
  }

  subscribe(channelName, watchFn) {
    console.info('MANUAL SUBSCRIPTION > ', channelName);
    const channel = this.socket.subscribe(channelName, {});
    channel.watch(watchFn);
    return channel;
  }

  emit(socket, eventName, eventId, data = {}, cb) {
    Object.assign(data, {
      token: this.authService.getAuthInfo().jwt,
      eventId
    });
    this.logger.log('SENDING > ', eventName, ' > data > ', data);
    socket.emit(eventName, data, cb);
  }

  unsubscribe(socket, channel) {
    try {
      this.logger.log('UNSUBSCRIBING FROM', channel.name);
      channel.unwatch();
      channel.unsubscribe();
      socket.unwatch(channel.name);
      socket.destroyChannel(channel.name);
    } catch (e) { }
  }

  destroySocket() {
    try {
      this.socket.off();
      this.socket.disconnect();
      this.socket = null;
    } catch (e) { }
  }
}
