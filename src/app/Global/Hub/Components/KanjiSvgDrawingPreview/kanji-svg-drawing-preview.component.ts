import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";

@Component({
  selector: "kanji-svg-drawing-preview",
  templateUrl: "kanji-svg-drawing-preview.component.html",
  styleUrls: ["kanji-svg-drawing-preview.component.css"]
})

export class KanjiSvgDrawingPreviewComponent implements OnInit, OnChanges {
  @ViewChild("svgBox") svgBox: ElementRef | undefined;
  @Input("kanji") kanji: string = "本";
  @Input("width") width: string = '150px';
  @Input("height") height: string = '150px';

  private tts = new SpeechSynthesisUtterance();

  constructor() {
    this.tts.rate = 0.88
    this.tts.lang = "ja-JA"
  }

  async ngOnInit() {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`)
    const text = await response.text();
    if (this.svgBox) {
      this.svgBox.nativeElement.innerHTML = text
    }
  }

  listenReading() {
    speechSynthesis.cancel()
    this.tts.text = this.kanji;
    speechSynthesis.speak(this.tts)
  }

  restartAnimation() {
    if (this.svgBox)
      this.svgBox.nativeElement.innerHTML += ""
  }

  async ngOnChanges(changes: SimpleChanges) {
    const response = await fetch(`assets/kanji/${this.kanji.codePointAt(0)}.svg`)
    const text = await response.text();
    if (this.svgBox) {
      this.svgBox.nativeElement.innerHTML = text
    }
  }
}
