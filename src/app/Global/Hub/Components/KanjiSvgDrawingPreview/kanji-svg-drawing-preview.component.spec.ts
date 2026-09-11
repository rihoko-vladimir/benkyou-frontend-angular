import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { KanjiSvgDrawingPreviewComponent } from './kanji-svg-drawing-preview.component';

describe('KanjiSvgDrawingPreviewComponent', () => {
  let component: KanjiSvgDrawingPreviewComponent;
  let fixture: ComponentFixture<KanjiSvgDrawingPreviewComponent>;
  let cancelSpy: ReturnType<typeof vi.fn>;
  let speakSpy: ReturnType<typeof vi.fn>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    cancelSpy = vi.fn();
    speakSpy = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel: cancelSpy, speak: speakSpy });
    // SpeechSynthesisUtterance is provided by src/test-setup.ts (global setup).
    fetchMock = vi.fn().mockResolvedValue({
      text: () => Promise.resolve('<svg data-mock="stroke-order"></svg>')
    });
    vi.stubGlobal('fetch', fetchMock);

    TestBed.configureTestingModule({ imports: [KanjiSvgDrawingPreviewComponent] });
    fixture = TestBed.createComponent(KanjiSvgDrawingPreviewComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates with default inputs', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.kanji).toBe('本');
    expect(component.width).toBe('150px');
    expect(component.height).toBe('150px');
  });

  it('fetches the SVG for the kanji code point on init and injects it into the svgBox', async () => {
    fixture.detectChanges();

    // ngOnInit resolves the mocked fetch over microtasks; waitFor lets those drain.
    await vi.waitFor(() => {
      expect(component.svgBox.nativeElement.innerHTML).toContain('data-mock="stroke-order"');
    });

    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'本'.codePointAt(0)}.svg`);
  });

  it('cancels and speaks the reading via listenReading', () => {
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.volume_up') as HTMLElement).click();

    expect(cancelSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledWith(expect.objectContaining({ text: '本' }));
  });

  it('restarts the animation by re-appending the innerHTML', async () => {
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(component.svgBox.nativeElement.innerHTML).toContain('data-mock="stroke-order"');
    });

    const before = component.svgBox.nativeElement.innerHTML;
    (fixture.nativeElement.querySelector('.reset') as HTMLElement).click();

    expect(component.svgBox.nativeElement.innerHTML).toBe(before + '');
  });

  it('re-fetches the SVG on ngOnChanges once the box is already rendered', async () => {
    fixture.detectChanges();

    await vi.waitFor(() => {
      expect(component.svgBox.nativeElement.innerHTML).toContain('data-mock="stroke-order"');
    });

    fetchMock.mockResolvedValueOnce({ text: () => Promise.resolve('<svg data-mock="changed"></svg>') });
    component.kanji = '母';
    await component.ngOnChanges();

    expect(fetchMock).toHaveBeenCalledWith(`assets/kanji/${'母'.codePointAt(0)}.svg`);
    expect(component.svgBox.nativeElement.innerHTML).toContain('data-mock="changed"');
  });

  it('ngOnChanges is a no-op on the DOM when svgBox is not yet set', async () => {
    // Before detectChanges, the @ViewChild is undefined; ngOnChanges guards on it.
    await expect(component.ngOnChanges()).resolves.toBeUndefined();
  });
});
