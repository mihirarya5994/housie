/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TambolaService } from './tambola.service';

describe('Service: Tambola', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TambolaService]
    });
  });

  it('should ...', inject([TambolaService], (service: TambolaService) => {
    expect(service).toBeTruthy();
  }));
});
