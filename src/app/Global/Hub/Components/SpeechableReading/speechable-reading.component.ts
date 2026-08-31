import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatBadge } from '@angular/material/badge';

@Component({
  selector: 'app-speechable-reading',
  templateUrl: 'speechable-reading.component.html',
  styleUrls: ['speechable-reading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatBadge]
})
export class SpeechableReadingComponent {
  @Input() reading = '話す';

  private tts = new SpeechSynthesisUtterance();

  constructor() {
    this.tts.rate = 0.88;
    this.tts.lang = 'ja-JA';
  }

  badgeClicked() {
    speechSynthesis.cancel();
    this.tts.text = this.reading;
    speechSynthesis.speak(this.tts);
  }
}
