import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'kanji-svg-drawing-preview',
  templateUrl: 'kanji-svg-drawing-preview.component.html',
  styleUrls: ['kanji-svg-drawing-preview.component.css']
})
export class KanjiSvgDrawingPreviewComponent implements OnInit, OnChanges {
  @ViewChild('svgBox') svgBox: ElementRef | undefined;
  @Input() kanji: string = '本';
  @Input() width: string = '150px';
  @Input() height: string = '150px';

  private tts = new SpeechSynthesisUtterance();

  constructor() {
    this.tts.rate = 0.88;
    this.tts.lang = 'ja-JA';
  }

  async ngOnInit() {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`);
    const text = await response.text();
    if (this.svgBox) {
      this.svgBox.nativeElement.innerHTML = text;
    }
  }

  listenReading() {
    speechSynthesis.cancel();
    this.tts.text = this.kanji;
    speechSynthesis.speak(this.tts);
  }

  restartAnimation() {
    if (this.svgBox) this.svgBox.nativeElement.innerHTML += '';
  }

  async ngOnChanges() {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`);
    const text = await response.text();
    if (this.svgBox) {
      this.svgBox.nativeElement.innerHTML = text;
    }
  }
}
