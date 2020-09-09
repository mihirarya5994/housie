import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCaptureComponent } from './profile-capture.component';

describe('ProfileCaptureComponent', () => {
  let component: ProfileCaptureComponent;
  let fixture: ComponentFixture<ProfileCaptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCaptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
