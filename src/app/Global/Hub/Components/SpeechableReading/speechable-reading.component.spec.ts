import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SpeechableReadingComponent } from './speechable-reading.component';

describe('SpeechableReadingComponent', () => {
  let component: SpeechableReadingComponent;
  let fixture: ComponentFixture<SpeechableReadingComponent>;
  let cancelSpy: ReturnType<typeof vi.fn>;
  let speakSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    cancelSpy = vi.fn();
    speakSpy = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel: cancelSpy, speak: speakSpy });
    // SpeechSynthesisUtterance is provided by src/test-setup.ts (global setup).

    TestBed.configureTestingModule({ imports: [SpeechableReadingComponent] });
    fixture = TestBed.createComponent(SpeechableReadingComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates with the default reading', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.reading).toBe('話す');
  });

  it('cancels current speech and speaks the reading when clicked', () => {
    component.reading = 'よむ';
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('#listen');
    span.click();

    expect(cancelSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledWith(expect.objectContaining({ text: 'よむ' }));
  });

  it('calls badgeClicked directly and sets the utterance text', () => {
    component.reading = 'かく';
    component.badgeClicked();
    expect(cancelSpy).toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledWith(expect.objectContaining({ text: 'かく' }));
  });
});
