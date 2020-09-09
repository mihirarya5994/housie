import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowWatchVideoToEarnComponent } from './show-watch-video-to-earn.component';

describe('ShowWatchVideoToEarnComponent', () => {
  let component: ShowWatchVideoToEarnComponent;
  let fixture: ComponentFixture<ShowWatchVideoToEarnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowWatchVideoToEarnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowWatchVideoToEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
