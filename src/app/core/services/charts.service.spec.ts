import { TestBed } from '@angular/core/testing';
import { ChartsService } from './charts.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ChartData } from '../models/charts.model';

describe('ChartsService', () => {
  let service: ChartsService;
  let httpMock: HttpTestingController;
  const mockData: ChartData[] = [
    { timestamp: '2021-01-01T00:00:00Z', stock: 100 },
    { timestamp: '2021-01-02T00:00:00Z', stock: 200 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChartsService],
    });
    service = TestBed.inject(ChartsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return random data', () => {
    service.getRandomData(20).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${service['endpoint']}random-data?numEntries=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle errors', () => {
    service.getRandomData(20).subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const req = httpMock.expectOne(`${service['endpoint']}random-data?numEntries=20`);
    req.flush('Something went wrong', { status: 500, statusText: 'Internal Server Error' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});