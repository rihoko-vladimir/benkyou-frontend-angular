import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanjiComponent } from './kanji.component';
import Kanji from '../../../../Models/Kanji';

describe('KanjiComponent', () => {
  let component: KanjiComponent;
  let fixture: ComponentFixture<KanjiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [KanjiComponent] });
    fixture = TestBed.createComponent(KanjiComponent);
    component = fixture.componentInstance;
  });

  it('creates and renders kanji info', () => {
    component.kanji = new Kanji('本', ['もと'], ['ホン']);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('本');
    expect(text).toContain('もと');
    expect(text).toContain('ホン');
  });

  it('joins multiple readings with a comma', () => {
    component.kanji = new Kanji('一', ['ひと', 'いち'], ['イチ', 'イツ']);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('ひと, いち');
    expect(text).toContain('イチ, イツ');
  });
});
