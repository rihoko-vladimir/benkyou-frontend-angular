import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';
import { KanjiPreviewComponent } from '../KanjiPreview/kanji-preview.component';

@Component({
  selector: 'kanji-list',
  templateUrl: 'kanji-list.component.html',
  styleUrls: ['kanji-list.component.scss'],
  imports: [KanjiPreviewComponent]
})
export class KanjiListComponent {
  @Input() kanjiList!: Kanji[];
}
