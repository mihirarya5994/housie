/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyWinningsComponent } from './my-winnings.component';

describe('MyWinningsComponent', () => {
  let component: MyWinningsComponent;
  let fixture: ComponentFixture<MyWinningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyWinningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWinningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
