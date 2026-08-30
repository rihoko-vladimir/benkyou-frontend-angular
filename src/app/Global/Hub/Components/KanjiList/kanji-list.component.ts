import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';
import { KanjiPreviewComponent } from '../KanjiPreview/kanji-preview.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'kanji-list',
  templateUrl: 'kanji-list.component.html',
  styleUrls: ['kanji-list.component.scss'],
  standalone: true,
  imports: [NgFor, KanjiPreviewComponent]
})
export class KanjiListComponent {
  @Input() kanjiList!: Kanji[];
}
