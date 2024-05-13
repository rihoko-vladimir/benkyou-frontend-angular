import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';

@Component({
  selector: 'kanji-list',
  templateUrl: 'kanji-list.component.html',
  styleUrls: ['kanji-list.component.scss']
})
export class KanjiListComponent {
  @Input() kanjiList!: Kanji[];
}
