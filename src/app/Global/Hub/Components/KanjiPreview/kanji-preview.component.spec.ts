import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import Kanji from '../../../../Models/Kanji';
import { KanjiPreviewComponent } from './kanji-preview.component';

describe('KanjiPreviewComponent', () => {
  let component: KanjiPreviewComponent;
  let fixture: ComponentFixture<KanjiPreviewComponent>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Real children render real DOM here; the SVG child fetches, so stub fetch
    // or the request leaks out of the test run.
    fetchMock = vi.fn().mockResolvedValue({ text: () => Promise.resolve('<svg></svg>') });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak: vi.fn() });

    TestBed.configureTestingModule({ imports: [KanjiPreviewComponent] });
    fixture = TestBed.createComponent(KanjiPreviewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates with the default kanji', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.kanji.kanji).toBe('本');
  });

  it('passes the kanji char and readings down to children', () => {
    component.kanji = new Kanji('母', ['はは'], ['ボ']);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-kanji-svg-drawing-preview')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-readings-container').length).toBe(2);
    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'母'.codePointAt(0)}.svg`);
  });
});
