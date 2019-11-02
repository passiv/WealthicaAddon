import { TestBed } from '@angular/core/testing';

import { PassivService } from './passiv.service';

describe('PassivService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassivService = TestBed.get(PassivService);
    expect(service).toBeTruthy();
  });
});
