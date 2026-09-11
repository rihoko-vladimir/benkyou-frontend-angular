import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SpeechableReadingComponent } from '../SpeechableReading/speechable-reading.component';

@Component({
  selector: 'app-readings-container',
  templateUrl: 'readings-container.component.html',
  styleUrls: ['readings-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpeechableReadingComponent]
})
export class ReadingsContainerComponent {
  @Input() readings: string[] = [];
}
