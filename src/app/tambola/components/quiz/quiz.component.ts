import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { retry } from 'rxjs/operators';

import {
  TambolaService,
  LoggerService,
  RoomService,
  GameService,
  AnalyticsService
} from 'src/app/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quiz: any = {};
  quizSponsorImg;
  eventId;
  loading = true;
  roomId;
  questionId;
  currentEventSponsor;
  showNoCoins = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tambolaService: TambolaService,
    private logger: LoggerService,
    private roomService: RoomService,
    private gameService: GameService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    // this.showNoCoins = this.router.url.includes('/game');
    this.tambolaService.setShowCoins(this.showNoCoins);
    const isSponsoredRoom =
      this.tambolaService.getCurrentSponsor() &&
      this.tambolaService.getCurrentSponsor().type;
    if (isSponsoredRoom) {
      this.analyticsService.pageLoad(
        null,
        'Jio Tambola 2| Quiz Page'
      );
      this.currentEventSponsor = this.tambolaService.getCurrentSponsor();
    } else {
      this.analyticsService.pageLoad(
        null,
        'Jio Tambola 2| Quiz PWF Page'
      );
      this.currentEventSponsor = this.tambolaService.getPlayerInfo();
    }
    this.activatedRoute.params.subscribe(params => {
      this.eventId = params.eventId;
      // if (
      //   this.tambolaService.getCurrentEvent().type === 'private' ||
      //   this.tambolaService.getPlayerInfo().type === 'private'
      // ) {
      //   this.getPrivateRoomQuiz();
      // } else {
      //   this.getQuiz();
      // }
    });
    this.roomId = this.tambolaService.getCurrentEvent().roomId;
    const gameConfig = this.tambolaService.getGameConfig();
    if (gameConfig && gameConfig.quiz && this.currentEventSponsor.type === 'golden') {
      this.getQuiz();
      this.quizSponsorImg = gameConfig.quiz;
    } else {
      this.quizSponsorImg = 'assets/images/quiz-sponsors/default.png';
      this.getPrivateRoomQuiz();
    }
  }

  getPrivateRoomQuiz() {
    this.roomService
      .privateRoomQuiz(this.eventId)
      .pipe(retry(1))
      .subscribe(
        res => {
          if (res.success) {
            this.router.navigate(['../game'], {
              relativeTo: this.activatedRoute
            });
            return;
          }
          if (res[0] && res[0].success) {
            this.router.navigate(['../game'], {
              relativeTo: this.activatedRoute
            });
          } else {
            if (res[0].quiz && res[0].quiz[0]) {
              this.quiz = res[0].quiz[0];
              this.questionId = res[0]._id;
            } else {
              this.logger.error('No Quiz');
            }
          }
          this.loading = false;
        },
        err =>
          this.router.navigate(['../../'], {
            relativeTo: this.activatedRoute
          })
      );
  }

  getQuiz() {
    this.tambolaService
      .getQuiz(this.eventId)
      .pipe(retry(1))
      .subscribe(
        res => {
          if (res.success) {
            this.router.navigate(['../game'], {
              relativeTo: this.activatedRoute
            });
          } else {
            if (res.quiz && res.quiz[0]) {
              this.quiz = res.quiz[0];
            } else {
              this.logger.error('No Quiz');
            }
          }
          this.loading = false;
        },
        err =>
          this.router.navigate(['../../'], {
            relativeTo: this.activatedRoute
          })
      );
  }

  answerQuiz(option) {
    option.selected = true;
    this.quiz.locked = true;
    this.tambolaService
      .answerQuiz(this.eventId, option.id)
      .subscribe((res: any) => {
        if (!res.success) {
          this.quiz.result = 'incorrect';
          setTimeout(() => {
            this.quiz.result = '';
            this.quiz.locked = false;
            option.selected = false;
          }, 2000);
        } else {
          this.quiz.result = 'correct';
          setTimeout(() => {
            this.router.navigate(['../game'], {
              relativeTo: this.activatedRoute
            });
          }, 3000);
        }
      });
  }

  answerPrivateRoomQuiz(option) {
    option.selected = true;
    this.quiz.locked = true;
    this.roomService
      .answerPrivateQuiz(this.eventId, option.id, this.questionId)
      .subscribe((res: any) => {
        if (!res.success) {
          this.quiz.result = 'incorrect';
          setTimeout(() => {
            this.quiz.result = '';
            this.quiz.locked = false;
            option.selected = false;
          }, 2000);
        } else {
          this.quiz.result = 'correct';
          setTimeout(() => {
            this.router.navigate(['../game'], {
              relativeTo: this.activatedRoute
            });
          }, 3000);
        }
      });
  }

  handleQuizAnswer(option) {
    if (
      this.currentEventSponsor.type === 'golden'
    ) {
      this.analyticsService.clickTrack(
        'Answer Selected | Quiz Page',
        'Jio Tambola 2 | Quiz Page'
      );
      this.answerQuiz(option);
    } else {
      this.analyticsService.clickTrack(
        'Answer Selected | Quiz PWF',
        'Jio Tambola 2 | Quiz PWF'
      );
      this.answerPrivateRoomQuiz(option);
    }
  }
}
