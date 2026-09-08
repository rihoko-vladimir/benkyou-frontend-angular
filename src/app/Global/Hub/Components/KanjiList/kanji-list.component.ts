import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import Kanji from '../../../../Models/Kanji';
import { KanjiPreviewComponent } from '../KanjiPreview/kanji-preview.component';

@Component({
  selector: 'app-kanji-list',
  templateUrl: 'kanji-list.component.html',
  styleUrls: ['kanji-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanjiPreviewComponent]
})
export class KanjiListComponent {
  @Input() kanjiList!: Kanji[];
}
