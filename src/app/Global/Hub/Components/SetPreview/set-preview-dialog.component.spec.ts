import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { vi } from 'vitest';
import Kanji from '../../../../Models/Kanji';
import { DialogData, SetPreviewDialogComponent } from './set-preview-dialog.component';

describe('SetPreviewDialogComponent', () => {
  let component: SetPreviewDialogComponent;
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates and exposes injected dialog data', () => {
    expect(component).toBeTruthy();
    expect(component.data.kanjiList).toEqual(kanjiList);
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
