import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import Kanji from '../../../../Models/Kanji';
import { ReadingsContainerComponent } from '../ReadingsContainer/readings-container.component';
import { KanjiSvgDrawingPreviewComponent } from '../KanjiSvgDrawingPreview/kanji-svg-drawing-preview.component';

@Component({
  selector: 'app-kanji-preview',
  templateUrl: 'kanji-preview.component.html',
  styleUrls: ['kanji-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [KanjiSvgDrawingPreviewComponent, ReadingsContainerComponent]
})
export class KanjiPreviewComponent {
  @Input() kanji: Kanji = new Kanji('本', [',', ','], [',', ',']);
}
