import { Component, Input } from '@angular/core';
import Kanji from '../../../../Models/Kanji';

@Component({
  selector: 'app-kanji',
  templateUrl: 'kanji.component.html',
  styleUrls: ['kanji.component.scss'],
  standalone: true
})
export class KanjiComponent {
  @Input() kanji!: Kanji;
}
