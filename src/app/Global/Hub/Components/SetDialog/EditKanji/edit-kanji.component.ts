import {Component, Input} from "@angular/core";
import Kanji from "../../../../../Models/Kanji";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipEvent, MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: "edit-kanji",
  templateUrl: "edit-kanji.component.html",
  styleUrls: ["edit-kanji.component.css"]
})

export class EditKanjiComponent {
  @Input() kanji!: Kanji
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  removeKunyomi(kunyomiString: string) {
    let index = this.kanji.kunyomi.indexOf(kunyomiString)
    if (index >= 0) {
      this.kanji.kunyomi.splice(index, 1);
    }
  }

  addKunyomi(kunyomiEvent: MatChipInputEvent) {
    let kunyomiString = (kunyomiEvent.value || '').trim()
    if (kunyomiString && this.kanji.kunyomi.indexOf(kunyomiString) < 0) {
      this.kanji.kunyomi.push(kunyomiString)
    }

    kunyomiEvent.chipInput.clear()
  }

  removeOnyomi(onyomiString: string) {
    let index = this.kanji.onyomi.indexOf(onyomiString)
    if (index >= 0) {
      this.kanji.onyomi.splice(index, 1);
    }
  }

  addOnyomi(onyomiEvent: MatChipInputEvent) {
    let onyomiString = (onyomiEvent.value || '').trim()
    if (onyomiString && this.kanji.kunyomi.indexOf(onyomiString) < 0) {
      this.kanji.onyomi.push(onyomiString)
    }

    onyomiEvent.chipInput.clear()
  }
}
