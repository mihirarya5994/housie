// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  ENV: 'dev',
  production: false,
  APP_NAME: 'bingo-client',
  API_HOST: 'https://bingodev.jiokhelo.com/bingoapi',
  PROFILE_API_HOST: 'https://uatapi.jiokhelo.com/api',
  CMS_API_HOST: 'https://couponadminsit.jiokhelo.com/coupon/api',
  SOCKET_CLUSTER_HOST: 'bingodev.jiokhelo.com',
  SOCKET_CLUSTER_PORT: 443,
  SOCKET_PRIVATE_ROOM_PATH: '/socketcluster/bingo',
  GAME_BROADCAST_CHANNEL_NAME: 'gameplay',
  SPLASH_TIMEOUT: 1000,
  TNC_URL: 'https://jiobb.jiokhelo.com/tambola/terms-and-conditions.html',
  HOW_TO_PLAY_URL: 'https://jiobb.jiokhelo.com/tambola/index.html',
  FAQ_URL: 'https://jiobb.jiokhelo.com/tambola/faq.html',
  SHARE_MESSAGE:
    'You never know how lucky you are! Play Tambola everyday on MyJio and Win Exciting Prizes. http://t.jio/tambola #MyJio #Tambola #JioEngage',
  LANGUAGES: [
    {
      title: 'ENGLISH',
      value: 'eng'
    },
    {
      title: 'HINDI',
      value: 'hin'
    }
  ],
  PRIVATE_ROOM_API_HOST: 'https://bingodev.jiokhelo.com/bingoprivate/bingoapi',
  SHARE_CODE_MESSAGE: 'Hi, I have organized a Tambola Party. Please join to have fun. Click on this link to Join http://t.jio/tambola',
  // DEEP_LINK: 'Click on this link to Join http://t.jio/tambola',
  BANNERS: [
    {
      imgUrl: 'assets/images/banners/free-ticket.png',
      // isFreeTicket: true
    },
    {
      imgUrl: 'assets/images/banners/maaza.png'
    },
    {
      imgUrl: 'assets/images/banners/bms.png'
    }],
  CONFETTI_DURATION: 3000,
  BALL_PROGRESS_BAR_TIME_IN_SECS: 8,
  TOPICS_API:
    'https://bingodata.jiokhelo.com/api/topics-f09c7e76-77cf-4243-b705-c5cbd913babf/messages',
  BIG_BOSS: 'https://jioplayalong3.akamaized.net/app10/index.html?jwt=',
  CHAT_THRESHOLD: 50,
  SPLASH_DURATION: 3000,
  LOGIN_UAT: 'https://uatapi.jiokhelo.com/api'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
