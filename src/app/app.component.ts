import { Component, OnInit, HostListener } from '@angular/core';

import {
  AppService,
  AuthService,
  LoggerService,
  UtilService,
  ExternalInterfaceService,
  RouterService,
  RestService,
  RoomService,
  TambolaService
} from './core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService,
    private logger: LoggerService,
    private util: UtilService,
    private externalInterfaceService: ExternalInterfaceService,
    private routerService: RouterService,
    public authService: AuthService,
    private restService: RestService,
    private roomService: RoomService,
    private tambolaService: TambolaService
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  keyEvent(eventKey: KeyboardEvent) {
    // this.roomService.leaveGame(this.tambolaService.getCurrentEvent().roomId).subscribe((res: any) => {
    // });
  }

  ngOnInit() {
    this.appService.setAppLanguage(
      this.appService.getAppLanguage()['language']
    );
    this.logger.setLogging(!environment.production);
    this.externalInterfaceService.requestAdParams();
    this.externalInterfaceService.sendLoadComplete();

    this.authService.setAppQuery({
      jwt: this.util.getParameterByName('jwt'),
      host: this.util.getParameterByName('host')
    });
    this.routerService.listen();
    this.externalInterfaceService.sendNativeBackControl(false);
    this.getServerTime();
  }

  getServerTime() {
    this.restService
      .get(`${this.appService.getEnvVariable('API_HOST')}/sync_time`)
      .subscribe(res => {
        const offset: any =
          new Date().valueOf() - new Date(res[0]).valueOf() || 0;
        this.appService.setCurrentTimeOffset(offset);
      });
  }
}
