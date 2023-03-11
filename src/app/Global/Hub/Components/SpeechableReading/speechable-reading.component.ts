import {Component, Input} from "@angular/core";

@Component({
  selector: "speechable-reading",
  templateUrl: "speechable-reading.component.html",
  styleUrls: ["speechable-reading.component.css"]
})

export class SpeechableReadingComponent {
  @Input("reading") reading: string = "話す"

  private tts = new SpeechSynthesisUtterance();

  constructor() {
    this.tts.rate = 0.88
    this.tts.lang = "ja-JA"
  }

  badgeClicked() {
    speechSynthesis.cancel()
    this.tts.text = this.reading;
    speechSynthesis.speak(this.tts)
  }
}
