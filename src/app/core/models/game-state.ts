export interface WinPattern {
  type: string;
  name: string;
  total: number;
  available: number;
  validating: boolean;
  prizeImage: any;
  claimed: boolean;
  points: number;
  pointsWon: number;
}

export const WinPatterns: WinPattern[] = [
  {
    type: 'first5',
    name: 'Early 5',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  },
  {
    type: 'row1',
    name: 'Top Line',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  },
  {
    type: 'row2',
    name: 'Middle Line',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  },
  {
    type: 'row3',
    name: 'Bottom Line',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  },
  {
    type: 'corners',
    name: 'Corners',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  },
  {
    type: 'fullhouse',
    name: 'Full house',
    total: 0,
    available: 0,
    validating: false,
    prizeImage: null,
    claimed: false,
    points: 0,
    pointsWon: 0
  }
];

export class GameState {
  // socket authenticated
  socketAuthenticated = false;
  // game participants
  participantsCount = 0;
  // game current state
  currentBall: number = null;
  // balls drawn
  drawn: number[] = [];
  // win patterns
  winPatterns: WinPattern[] = [];
  // ticket id
  ticketId = null;
  // ticket matrix
  ticketMatrix: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  // daubed numbers
  daubed: any[];
  // user wins
  winnings = [];
  // bogie user
  isBogie = false;
  //  missed claim
  missedClaim = false;
  // successful claim
  successfulClaim = false;
  // missed daubing
  missedNumbers = [];
  // secret reward
  secretReward = 0;
  // secret reward number
  secretRewardNumber = -1;
  // secret reward won
  wonSecretReward = false;
  // next game time
  nextevent = null;
  // event status
  eventstatus = null;
  // are ads running
  ad = false;
}

export class DefaultGameState extends GameState {
  constructor() {
    super();
    this.currentBall = null;
    this.drawn = [];
    this.winPatterns = JSON.parse(JSON.stringify(WinPatterns));
    this.ticketId = null;
    this.ticketMatrix = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.daubed = [];
    this.winnings = [];
    this.isBogie = false;
    this.missedClaim = false;
    this.successfulClaim = false;
    this.missedNumbers = [];
    this.secretReward = 0;
    this.secretRewardNumber = -1;
    this.wonSecretReward = false;
    this.nextevent = null;
    this.eventstatus = null;
    this.ad = false;
  }
}
