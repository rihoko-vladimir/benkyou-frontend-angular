import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import Kanji from '../../../../Models/Kanji';

@Component({
  selector: 'app-kanji',
  templateUrl: 'kanji.component.html',
  styleUrls: ['kanji.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanjiComponent {
  @Input() kanji!: Kanji;
}
