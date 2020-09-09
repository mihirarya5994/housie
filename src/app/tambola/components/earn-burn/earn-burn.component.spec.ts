import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnBurnComponent } from './earn-burn.component';

describe('EarnBurnComponent', () => {
  let component: EarnBurnComponent;
  let fixture: ComponentFixture<EarnBurnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarnBurnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnBurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
