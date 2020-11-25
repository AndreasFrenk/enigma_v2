import { TestBed } from '@angular/core/testing';

import { PlugboardService } from './plugboard.service';

describe('PlugboardService', () => {
  let service: PlugboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlugboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
