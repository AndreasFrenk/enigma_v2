import { TestBed } from '@angular/core/testing';

import { PlugPointsService } from './plug-points.service';

describe('PlugPointsService', () => {
  let service: PlugPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlugPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
