import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { EventEmitterService, EventData, GameService, ProfileService, AnalyticsService } from 'src/app/core';
import { APP_EVENTS } from './../../../constants';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  chatOverlay = false;
  messageToSend;
  profileNickName;
  private subscriptions: Subscription[] = [];
  messages = [];
  @ViewChild('chatWindow', { static: false }) chatWindow: ElementRef;
  @ViewChild('box', { static: false }) inputBox: ElementRef;
  timeoutIds = [];
  messagesArray = [];
  isKeyBoardPresent = false;
  lastName;
  sameName = false;
  changedName = false;
  firstSet = true;

  constructor(
    private eventEmitterService: EventEmitterService,
    private gameService: GameService,
    private profileService: ProfileService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.analyticsService.pageLoad(
      null,
      'Jio Tambola 2| Chat Screen'
    );
    this.eventEmitterService.subscribe((event: EventData) => {
      if (event.type === APP_EVENTS.CHAT_OVERLAY) {
        this.chatOverlay = event.data;
        this.scrollIntoView();
      }
    });
    this.profileService.getServerProfile().subscribe((res) => {
      this.profileNickName = res.nickName || 'Player';
    });
    this.gameService.refreshChats();
    this.gameService.getChats();
    this.subscriptions.push(
      this.gameService.getChatEventsStream().subscribe(chatEvent => {
        setTimeout(() => this.handleChatEvents(chatEvent), 0);
      })
    );
  }

  sendMessage(event: KeyboardEvent, message) {
    this.analyticsService.clickTrack(
      'Send | Chat Screen',
      'Jio Tambola 2 | Game Screen'
    );
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
    if (message.trim().length) {
      this.gameService.sendMessageChat(message, this.profileNickName);
    }
    this.messageToSend = '';
  }

  handleChatEvents(event) {
    if (Array.isArray(event)) {
      if (event && event.length && event.length > -1) {
        this.messagesArray = event;
        if (this.firstSet) {
          this.scrollIntoView();
          this.firstSet = !this.firstSet;
        } else {
          this.scrollIntoView();
        }
        const newMessages = [];
        this.messagesArray.forEach(element => {
          const obj = { message: element };
          newMessages.push(obj);
        });
        this.messages = [...newMessages, ...this.messages];
      }
    } else {
      this.messages.push(event.data);
      if (this.firstSet) {
        this.scrollIntoView();
        this.firstSet = !this.firstSet;
      } else {
        this.scrollIntoView();
      }
      const newMessages = [];
      this.messages = [...newMessages, ...this.messages];
      this.scrollIntoView();
    }
  }

  closeChatOverlay() {
    this.eventEmitterService.emit({
      type: APP_EVENTS.CHAT_OVERLAY,
      data: false,
    });
    // this.chatOverlay = !this.chatOverlay;
  }

  scrollIntoView() {
    this.timeoutIds.push(
      setTimeout(() => {
        if (this.chatWindow) {
          this.chatWindow.nativeElement.scrollTo(
            0,
            this.chatWindow.nativeElement.scrollHeight
          );
        }
      }, 10)
    );
  }

  scrollTillView() {
    setTimeout(() => {
      if (this.chatWindow) {
        this.chatWindow.nativeElement.scrollTo(
          0, (this.messagesArray.length) * 40
        );
      }
    }, 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    event.target.innerWidth;
    this.isKeyBoardPresent = !this.isKeyBoardPresent;
    if (this.isKeyBoardPresent) {
      this.scrollIntoView();
    }
  }

  checkForNameRepeat(message, i) {
    if (
      this.messages[i - 1] &&
      this.messages[i - 1].message.name === message.message.name
    ) {
      this.sameName = true;
      return true;
    }
    return false;
  }

  handleScroll(event) {
    if (event.target.scrollTop === 0) {
      this.gameService.getChats();
    }
  }

  ngAfterViewInit(): void {
    this.inputBox.nativeElement.focus();
  }
}
