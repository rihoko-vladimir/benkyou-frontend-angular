import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import Kanji from '../../../../Models/Kanji';
import { KanjiListComponent } from './kanji-list.component';

describe('KanjiListComponent', () => {
  let component: KanjiListComponent;
  let fixture: ComponentFixture<KanjiListComponent>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Real children render real DOM here; the SVG child fetches, so stub fetch
    // or the request leaks out of the test run.
    fetchMock = vi.fn().mockResolvedValue({ text: () => Promise.resolve('<svg></svg>') });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak: vi.fn() });

    TestBed.configureTestingModule({ imports: [KanjiListComponent] });
    fixture = TestBed.createComponent(KanjiListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders a kanji-preview for each kanji in the list', () => {
    component.kanjiList = [new Kanji('一'), new Kanji('二'), new Kanji('三')];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-kanji-preview').length).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'一'.codePointAt(0)}.svg`);
    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'二'.codePointAt(0)}.svg`);
    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'三'.codePointAt(0)}.svg`);
  });

  it('renders nothing when the list is empty', () => {
    component.kanjiList = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-kanji-preview').length).toBe(0);
  });
});
