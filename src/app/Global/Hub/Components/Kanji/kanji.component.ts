import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';

@Component({
  selector: 'kanji',
  templateUrl: 'kanji.component.html',
  styleUrls: ['kanji.component.scss']
})
export class KanjiComponent {
  @Input() kanji!: Kanji;
}
