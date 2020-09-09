/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NativeBackComponent } from './native-back.component';

describe('NativeBackComponent', () => {
  let component: NativeBackComponent;
  let fixture: ComponentFixture<NativeBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
