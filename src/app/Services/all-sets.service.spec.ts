import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AllSetsService } from './all-sets.service';
import { SetsApiService } from './sets-api.service';
import { IPagedSets } from './Interfaces/paged-sets';

describe('AllSetsService', () => {
  let service: AllSetsService;
  let setsApi: { getAllSets: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    setsApi = { getAllSets: vi.fn() };

    TestBed.configureTestingModule({
      providers: [AllSetsService, { provide: SetsApiService, useValue: setsApi }]
    });

    service = TestBed.inject(AllSetsService);
  });

  it('delegates getAllSets to SetsApiService with the same arguments', () => {
    const paged: IPagedSets = { sets: [], pagesCount: 1, currentPage: 1 };
    setsApi.getAllSets.mockReturnValue(of(paged));

    let result: IPagedSets | undefined;
    service.getAllSets(1, 10, 'query').subscribe(r => (result = r));

    expect(setsApi.getAllSets).toHaveBeenCalledWith(1, 10, 'query');
    expect(result).toBe(paged);
  });

  it('delegates getAllSets without a searchQuery', () => {
    const paged: IPagedSets = { sets: [], pagesCount: 1, currentPage: 1 };
    setsApi.getAllSets.mockReturnValue(of(paged));

    service.getAllSets(2, 5).subscribe();

    expect(setsApi.getAllSets).toHaveBeenCalledWith(2, 5, undefined);
  });
});
