/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BrandSplashComponent } from './brand-splash.component';

describe('BrandSplashComponent', () => {
  let component: BrandSplashComponent;
  let fixture: ComponentFixture<BrandSplashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandSplashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSplashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
