/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';

import { ErrorInterceptor } from './error.interceptor';

describe('Service: ErrorInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorInterceptor]
    });
  });

  it('should ...', inject([ErrorInterceptor], (service: ErrorInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
