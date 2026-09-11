import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi } from 'vitest';
import Kanji from '../../../../Models/Kanji';
import { KanjiListComponent } from '../KanjiList/kanji-list.component';
import { DialogData, SetPreviewDialogComponent } from './set-preview-dialog.component';

describe('SetPreviewDialogComponent', () => {
  let fixture: ComponentFixture<SetPreviewDialogComponent>;
  const kanjiList = [new Kanji('一', ['いち'], ['イチ'])];

  beforeEach(() => {
    // The rendered kanji preview fetches its SVG asset; happy-dom's real fetch
    // would leak a NetworkError into the whole (non-isolated) run.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ text: () => Promise.resolve('<svg data-mock="stroke-order"></svg>') })
    );

    TestBed.configureTestingModule({
      imports: [SetPreviewDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: new DialogData(kanjiList) }]
    });

    fixture = TestBed.createComponent(SetPreviewDialogComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the injected kanji list in the preview dialog', () => {
    const kanjiListComponent = fixture.debugElement.query(By.directive(KanjiListComponent))
      .componentInstance as KanjiListComponent;

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Set preview');
    expect(kanjiListComponent.kanjiList).toEqual(kanjiList);
  });
});

describe('DialogData', () => {
  it('clones the provided kanji list', () => {
    const list = [new Kanji('一', ['いち'], ['イチ'])];
    const data = new DialogData(list);

    expect(data.kanjiList).toEqual(list);
    expect(data.kanjiList).not.toBe(list);
  });
});
