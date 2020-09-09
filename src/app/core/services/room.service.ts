import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { RestService } from './rest.service';

import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private coinsSubject = new BehaviorSubject<any>({});

  constructor(
    private appService: AppService,
    private restService: RestService
  ) { }

  // SUBJECTS

  getCoinsEvent(): Observable<any> {
    return this.coinsSubject.asObservable();
  }
  setCoins(count) {
    this.coinsSubject.next({ coins: count });
  }

  // API CALLS

  getRoom(roomId) {
    return this.restService.get(
      `${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/${roomId}`
    );
  }

  joinRoomWithCode(code) {
    return this.restService.post(
      `${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/join`,
      {
        shareCode: code
      }
    );
  }

  createRoom(roomInfo) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/create`,
      {
        name: roomInfo.name,
        ticketPrice: roomInfo.ticketPrice
      }
    );
  }
  createPlayer() {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/player/create`,
      {}
    );
  }
  getCoins() {
    return this.restService.get(
      `${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/player/coins`
    );
  }
  buyRoomTicket(room_id) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/buy`,
      {
        roomId: room_id
      }
    );
  }
  leaveGame(room_id) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/leave`, {
      roomId: room_id
    });
  }
  getKittyPrize() {
    return this.restService.get(
      `${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/getKitty`
    );
  }
  privateRoomQuiz(room_id) {
    return this.restService.get(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/private/quiz/${room_id}`);
  }

  answerPrivateQuiz(room_id, answerId, quesId) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/private/quiz/answer/${room_id}`,
      {
        qId: quesId,
        answer: [answerId]
      });
  }

  earnReward(coins, roomId) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/player/reward`, {
      reward: coins,
      roomId: roomId,
      poa: 'WatchVideo'
    });
  }

  startRoom(room_id) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/start`, {
      roomId: room_id
    });
  }

  startGameEvent(room_id) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/socket/start`, {
      roomId: room_id
    });
  }

  kickOutPlayer(playerInfo) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/kick`,
      {
        roomId: playerInfo.roomId,
        player: playerInfo.phone
      }
    );
  }

  getCoinsDistribution(room_id) {
    return this.restService.get(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/prize/${room_id}`);
  }

  earnBurnCoupons() {
    return this.restService.get(
      `${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/earnburn`
    );
  }

  burnCoupon(coupon) {
    return this.restService.post(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/player/burn`,
      {
        coins: coupon[1].coins,
        poa: 'earnburn',
        coupon: coupon[0]
      }
    );
  }

  getWinners(room_id) {
    return this.restService.get(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/results/rooms/${room_id}`);
  }

  playerCount(room_id) {
    return this.restService.get(`${this.appService.getEnvVariable('PRIVATE_ROOM_API_HOST')}/room/playerCount/${room_id}`);
  }
}
