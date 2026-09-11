import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { MySetsService } from './my-sets.service';
import { SetsApiService } from './sets-api.service';
import { AppConfiguration } from '../Constants/AppConfiguration';
import Set from '../Models/Set';
import Kanji from '../Models/Kanji';
import { IPagedSets } from './Interfaces/paged-sets';

describe('MySetsService', () => {
  let service: MySetsService;
  let httpMock: HttpTestingController;
  let setsApi: { createSet: ReturnType<typeof vi.fn>; getMySets: ReturnType<typeof vi.fn> };
  const apiEndpoint = 'http://test-api';

  beforeEach(() => {
    setsApi = { createSet: vi.fn(), getMySets: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        MySetsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfiguration, useValue: { apiEndpoint } },
        { provide: SetsApiService, useValue: setsApi }
      ]
    });

    service = TestBed.inject(MySetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('createSet delegates to SetsApiService.createSet', () => {
    const set = new Set();
    setsApi.createSet.mockReturnValue(of(set));

    let result: Set | undefined;
    service.createSet(set).subscribe(r => (result = r));

    expect(setsApi.createSet).toHaveBeenCalledWith(set);
    expect(result).toBe(set);
  });

  it('addSet also delegates to SetsApiService.createSet', () => {
    const set = new Set();
    setsApi.createSet.mockReturnValue(of(set));

    service.addSet(set).subscribe();

    expect(setsApi.createSet).toHaveBeenCalledWith(set);
  });

  it('getMySets delegates to SetsApiService.getMySets', () => {
    const paged: IPagedSets = { sets: [], pagesCount: 1, currentPage: 1 };
    setsApi.getMySets.mockReturnValue(of(paged));

    let result: IPagedSets | undefined;
    service.getMySets(1, 10).subscribe(r => (result = r));

    expect(setsApi.getMySets).toHaveBeenCalledWith(1, 10);
    expect(result).toBe(paged);
  });

  it('patchMySet sends a json-patch PATCH request diffing original and new set', () => {
    const originalSet = new Set('set-1', 'Original', 'desc', 'author', 'user-1', [new Kanji('一', ['いち'], [])]);
    const newSet = new Set('set-1', 'Updated', 'desc', 'author', 'user-1', [new Kanji('一', ['いち'], [])]);

    let done = false;
    service.patchMySet('set-1', newSet, originalSet).subscribe(() => (done = true));

    const req = httpMock.expectOne(`${apiEndpoint}/sets/modify?setId=set-1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual([{ op: 'replace', path: '/name', value: 'Updated' }]);
    req.flush(null);

    expect(done).toBe(true);
  });

  it('removeMySet sends a DELETE request for the given setId', () => {
    let done = false;
    service.removeMySet('set-1').subscribe(() => (done = true));

    const req = httpMock.expectOne(`${apiEndpoint}/sets/remove?setId=set-1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null);

    expect(done).toBe(true);
  });
});
