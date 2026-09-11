import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SetsApiService } from './sets-api.service';
import { AppConfiguration } from '../Constants/AppConfiguration';
import { PagedSetsResponse } from '../Models/Responses/PagedSetsResponse';
import { SetResponse } from '../Models/Responses/SetResponse';
import Set from '../Models/Set';
import Kanji from '../Models/Kanji';
import { IPagedSets } from './Interfaces/paged-sets';

describe('SetsApiService', () => {
  let service: SetsApiService;
  let httpMock: HttpTestingController;
  const apiEndpoint = 'http://test-api';

  const pagedResponse: PagedSetsResponse = {
    sets: [
      {
        id: 'set-1',
        authorId: 'user-1',
        name: 'Kanji set',
        description: 'desc',
        kanjiList: [{ kanjiChar: '一', kunyomiReadings: [{ reading: 'いち' }], onyomiReadings: [] }]
      }
    ],
    pagesCount: 3,
    setsCount: 1,
    currentPage: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SetsApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfiguration, useValue: { apiEndpoint } }
      ]
    });

    service = TestBed.inject(SetsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getMySets requests the my-sets endpoint and maps the response', () => {
    let result: IPagedSets | undefined;
    service.getMySets(1, 10).subscribe(r => (result = r));

    const req = httpMock.expectOne(`${apiEndpoint}/sets/my-sets?pageNumber=1&pageSize=10`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(pagedResponse);

    expect(result?.pagesCount).toBe(3);
    expect(result?.sets.length).toBe(1);
    expect(result?.sets[0].id).toBe('set-1');
  });

  it('getAllSets requests the all-sets endpoint with an encoded search query', () => {
    let result: IPagedSets | undefined;
    service.getAllSets(2, 5, 'a b&c').subscribe(r => (result = r));

    const req = httpMock.expectOne(
      `${apiEndpoint}/sets/all-sets?pageNumber=2&pageSize=5&searchQuery=${encodeURIComponent('a b&c')}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(pagedResponse);

    expect(result?.sets.length).toBe(1);
  });

  it('getAllSets defaults searchQuery to an empty string when omitted', () => {
    service.getAllSets(1, 10).subscribe();

    const req = httpMock.expectOne(`${apiEndpoint}/sets/all-sets?pageNumber=1&pageSize=10&searchQuery=`);
    req.flush(pagedResponse);
  });

  it('createSet posts the mapped SetRequest and maps the response back to a Set', () => {
    const set = new Set('', 'New set', 'desc', '', '', [new Kanji('一', ['いち'], [])]);
    const setResponse: SetResponse = {
      id: 'set-2',
      authorId: 'user-1',
      name: 'New set',
      description: 'desc',
      kanjiList: [{ kanjiChar: '一', kunyomiReadings: [{ reading: 'いち' }], onyomiReadings: [] }]
    };

    let result: Set | undefined;
    service.createSet(set).subscribe(r => (result = r));

    const req = httpMock.expectOne(`${apiEndpoint}/sets/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual({
      name: 'New set',
      description: 'desc',
      kanjiList: [{ kanjiChar: '一', kunyomiReadings: [{ reading: 'いち' }], onyomiReadings: [] }]
    });
    req.flush(setResponse);

    expect(result?.id).toBe('set-2');
  });
});
