import { GameState, WinPatterns } from '../core/models';

export const TEST_GAME_STATE: GameState = {
  participantsCount: 2395722,
  currentBall: 41,
  drawn: [78, 1, 22, 41, 34, 46],
  winPatterns: WinPatterns,
  socketAuthenticated: true,
  ticketId: 'ABC1234',
  ticketMatrix: [
    [1, 0, 0, 34, 46, 0, 61, 0, 81],
    [0, 13, 22, 0, 41, 0, 63, 0, 89],
    [8, 16, 0, 39, 0, 55, 0, 78, 0]
  ],
  daubed: [],
  winnings: [],
  isBogie: false,
  missedClaim: false,
  successfulClaim: false,
  missedNumbers: [],
  secretReward: 0,
  secretRewardNumber: -1,
  wonSecretReward: false,
  nextevent: null,
  eventstatus: null,
  ad: false
};
