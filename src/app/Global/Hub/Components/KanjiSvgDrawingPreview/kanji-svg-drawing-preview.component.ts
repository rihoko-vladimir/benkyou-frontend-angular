import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-kanji-svg-drawing-preview',
  templateUrl: 'kanji-svg-drawing-preview.component.html',
  styleUrls: ['kanji-svg-drawing-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class KanjiSvgDrawingPreviewComponent implements OnInit, OnChanges {
  @ViewChild('svgBox') svgBox!: ElementRef;
  @Input() kanji = '本';
  @Input() width = '150px';
  @Input() height = '150px';

  private tts = new SpeechSynthesisUtterance();

  constructor() {
    this.tts.rate = 0.9;
    this.tts.lang = 'ja-JA';
  }

  async ngOnInit() {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`);
    this.svgBox.nativeElement.innerHTML = await response.text();
  }

  listenReading() {
    speechSynthesis.cancel();
    this.tts.text = this.kanji;
    speechSynthesis.speak(this.tts);
  }

  restartAnimation() {
    this.svgBox.nativeElement.innerHTML += '';
  }

  async ngOnChanges() {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`);
    const text = await response.text();
    if (this.svgBox) {
      this.svgBox.nativeElement.innerHTML = text;
    }
  }
}
