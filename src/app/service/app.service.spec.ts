import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { IFormValue } from '../app.types';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AppService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve available cars based on the search request', (done) => {
    const startDate = new Date().toISOString();
    const endDate = new Date().toISOString();
    const searchRequest: IFormValue = {
      make: 'Toyota',
      model: 'Camry',
      startDate,
      endDate,
    };

    service.getAvailableCars(searchRequest).subscribe(() => done());

    const req = httpMock.expectOne(
      `${service['apiUrl']}/available-cars?make=Toyota&model=Camry&startDate=${startDate}&endDate=${endDate}`
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
