import { TestBed, inject } from '@angular/core/testing';

import { EventLogsService } from './event-logs.service';

describe('EventLogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventLogsService]
    });
  });

  it('should be created', inject([EventLogsService], (service: EventLogsService) => {
    expect(service).toBeTruthy();
  }));
});
