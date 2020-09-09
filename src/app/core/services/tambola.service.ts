import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { AppService } from './app.service';
import { RestService } from './rest.service';
import { LoggerService } from './logger.service';

import { GameConfig } from './../models/game-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { __importDefault } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class TambolaService {
  currentEvent;
  gameConfig: GameConfig = new GameConfig();
  sponsor;
  show;
  private showSubject = new BehaviorSubject<any>({});

  private playerInfo: any = {};

  constructor(
    private appService: AppService,
    private restService: RestService,
    private logger: LoggerService
  ) { }


  setShowCoins(show) {
    this.showSubject.next({ showCoin: show });
  }
  getShowCoins(): Observable<any> {
    return this.showSubject.asObservable();
  }

  getEvents() {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/events?current=true`
    );
  }

  getEventById(eventId) {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/events?eventId=${eventId}`
    );
  }

  buyFreeTicket(eventId) {
    return this.restService.post(
      `${this.appService.getEnvVariable('API_HOST')}/ticket/buy/free`,
      {
        eventId
      }
    );
  }
  setCurrentEventSponsor(sponsor) {
    this.sponsor = sponsor;
  }

  getCurrentSponsor() {
    return this.sponsor;
  }

  getQuiz(eventId) {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/quiz/${eventId}`
    );
  }

  answerQuiz(eventId, answerId) {
    return this.restService.post(
      `${this.appService.getEnvVariable('API_HOST')}/quiz/answer/${eventId}`,
      {
        answers: [answerId]
      }
    );
  }

  getConfiguration() {
    return this.restService
      .get(`${this.appService.getEnvVariable('API_HOST')}/config`)
      .pipe(tap(config => this.processConfig(config)));
  }

  getParticipantsCount() {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/count`
    );
  }

  getGameResults(eventId) {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/results/grand/${eventId}`
    );
  }

  getMyWinnings() {
    return this.restService.get(
      `${this.appService.getEnvVariable(
        'CMS_API_HOST'
      )}/winnerDetails?programName=bingo2`
    );
  }

  getPastEventsForWinnings() {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/results/events`
    );
  }

  getWinnersForEvent(eventId) {
    return this.restService.get(
      `${this.appService.getEnvVariable('API_HOST')}/results/events/${eventId}`
    );
  }

  setCurrentEvent(event) {
    this.currentEvent = event;
  }

  getCurrentEvent() {
    return this.currentEvent;
  }

  getGameConfig(): GameConfig {
    return this.gameConfig;
  }

  setPlayerInfo(info) {
    this.playerInfo = info;
  }

  getPlayerInfo() {
    return this.playerInfo;
  }

  apiStats(data) {
    return this.restService.post(
      `${this.appService.getEnvVariable('API_HOST')}/stats`,
      {
        url: data.url,
        httpstatus: data.httpstatus,
        method: data.method,
        responseTime: data.responseTime,
        startTime: data.startTime,
        endTime: data.endTime,
        activity: data.activity
      }
    );
  }

  private processConfig(config) {
    if (config.ads) {
      this.gameConfig.ads = config.ads;
    }
    if (config.prizecoupons) {
      this.gameConfig.prizeCoupons = config.prizecoupons;
    }
    if (config.numberimage) {
      Object.keys(config.numberimage).forEach(
        key => (config.numberimage[key] = config.url + config.numberimage[key])
      );
      this.gameConfig.ballToBrandMap = config.numberimage;
    }
    if (config.numbersound) {
      Object.keys(config.numbersound).forEach(
        key => (config.numbersound[key] = config.url + config.numbersound[key])
      );
      this.gameConfig.ballToSoundMap = config.numbersound;
    }
    if (config.prizeimg) {
      this.gameConfig.grandPrizeWinnerImage = config.url + config.prizeimg['1'];
    }
    if (config.presenters) {
      Object.keys(config.presenters).forEach(
        key => (config.presenters[key] = config.url + config.presenters[key])
      );
      this.gameConfig.presenters = Object.values(config.presenters);
    }
    if (config.sponsorLogo) {
      Object.keys(config.sponsorLogo).forEach(
        key => (config.sponsorLogo[key] = config.url + config.sponsorLogo[key])
      );
      this.gameConfig.sponsors = Object.values(config.sponsorLogo);
    }
    if (config.splash) {
      this.gameConfig.splash = config.url + config.splash['1'];
    }
    if (config.quiz) {
      this.gameConfig.quiz = config.url + config.quiz['1'];
    }
    if (config.theme) {
      this.gameConfig.theme = config.url + config.theme['1'];
    }
    this.logger.log(this.gameConfig);
  }
}
