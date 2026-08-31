import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog';
import Kanji from '../../../../Models/Kanji';
import { MatButton } from '@angular/material/button';
import { KanjiListComponent } from '../KanjiList/kanji-list.component';

export class DialogData {
  kanjiList: Kanji[];
  constructor(kanjiList: Kanji[]) {
    this.kanjiList = [...kanjiList];
  }
}
@Component({
  selector: 'app-set-preview-dialog',
  templateUrl: 'set-preview-dialog.component.html',
  styleUrls: ['set-preview-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogTitle, MatDialogContent, KanjiListComponent, MatDialogActions, MatButton, MatDialogClose]
})
export class SetPreviewDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);
}
