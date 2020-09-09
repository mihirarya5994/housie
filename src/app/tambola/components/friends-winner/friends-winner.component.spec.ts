import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsWinnerComponent } from './friends-winner.component';

describe('FriendsWinnerComponent', () => {
  let component: FriendsWinnerComponent;
  let fixture: ComponentFixture<FriendsWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendsWinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
