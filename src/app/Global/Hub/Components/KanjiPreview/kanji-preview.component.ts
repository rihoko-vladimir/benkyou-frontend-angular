import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';

@Component({
  selector: 'kanji-preview',
  templateUrl: 'kanji-preview.component.html',
  styleUrls: ['kanji-preview.component.css']
})
export class KanjiPreviewComponent {
  @Input() kanji: Kanji = new Kanji('本', [',', ','], [',', ',']);
}
