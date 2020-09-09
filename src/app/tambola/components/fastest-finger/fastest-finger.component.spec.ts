import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastestFingerComponent } from './fastest-finger.component';

describe('FastestFingerComponent', () => {
  let component: FastestFingerComponent;
  let fixture: ComponentFixture<FastestFingerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastestFingerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastestFingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
