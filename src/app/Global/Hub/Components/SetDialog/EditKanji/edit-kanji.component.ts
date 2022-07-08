import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import Kanji from "../../../../../Models/Kanji";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipEvent, MatChipInputEvent, MatChipList} from "@angular/material/chips";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: "edit-kanji",
  templateUrl: "edit-kanji.component.html",
  styleUrls: ["edit-kanji.component.css"]
})

export class EditKanjiComponent implements OnInit {
  @Input() kanji!: Kanji
  @Input() myIndex!: number
  @Input() isRemoveAvailable: boolean = false
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>()
  @Output() kanjiChange = new EventEmitter<{ kanji: Kanji, index: number }>();
  @ViewChild("onyomi") onyomi!: MatChipList
  @ViewChild("kunyomi") kunyomi!: MatChipList
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  kanjiControl

  kunyomiControl

  onyomiControl

  constructor() {
    this.kanjiControl = new FormControl("", [
      Validators.required,
      Validators.maxLength(1),
      Validators.pattern(`[一-龯]`)
    ])

    this.kunyomiControl = new FormControl("", [
      Validators.pattern(`[ぁ-ん]`),
      Validators.maxLength(10)
    ])

    this.onyomiControl = new FormControl("", [
      Validators.pattern(`[ァ-ン]`),
      Validators.maxLength(10)
    ])
  }

  ngOnInit(): void {
    this.kanjiControl.setValue(this.kanji.kanji)
  }

  removeKunyomi(kunyomiString: string) {
    let index = this.kanji.kunyomi.indexOf(kunyomiString)
    if (index >= 0) {
      this.kanji.kunyomi.splice(index, 1);
      this.kunyomi.errorState = false
      this.emitKanjiChange(this.kanji)
    }
  }

  addKunyomi(kunyomiEvent: MatChipInputEvent) {
    if (this.kunyomiControl.invalid) {
      this.kunyomi.errorState = true
      return
    }
    let kunyomiString = kunyomiEvent.value
    if (kunyomiString && this.kanji.kunyomi.indexOf(kunyomiString) < 0) {
      this.kanji.kunyomi.push(kunyomiString)
      this.kunyomi.errorState = false
      this.emitKanjiChange(this.kanji)
    }

    kunyomiEvent.chipInput.clear()
  }

  removeOnyomi(onyomiString: string) {
    let index = this.kanji.onyomi.indexOf(onyomiString)
    if (index >= 0) {
      this.kanji.onyomi.splice(index, 1);
      this.onyomi.errorState = false
      this.emitKanjiChange(this.kanji)
    }
  }

  addOnyomi(onyomiEvent: MatChipInputEvent) {
    if (this.onyomiControl.invalid) {
      this.onyomi.errorState = true
      return
    }
    let onyomiString = onyomiEvent.value
    if (onyomiString && this.kanji.kunyomi.indexOf(onyomiString) < 0) {
      this.kanji.onyomi.push(onyomiString)
      this.onyomi.errorState = false
      this.emitKanjiChange(this.kanji)
    }

    onyomiEvent.chipInput.clear()
  }

  onRemoveClicked() {
    this.onRemove.emit(this.myIndex)
  }

  getFieldError(type: string) {
    switch (type) {
      case ReadingType.kunyomi:
        return "Only hiragana chars with size less than 10 can be inputed"
      case ReadingType.onyomi:
        return "Only katakana chars with size less than 10 can be inputed"
      default:
        return "Unknown error"
    }
  }

  removeError(type: string) {
    switch (type) {
      case ReadingType.kunyomi:
        this.kunyomi.errorState = false
        break
      case ReadingType.onyomi:
        this.onyomi.errorState = false
        break
    }
  }

  emitKanjiChange(kanji: Kanji) {
    this.kanjiChange.emit({
      kanji,
      index: this.myIndex
    })
  }

  getKanjiError() {
    if (this.kanjiControl.hasError(Validators.required.name))
      return "Required"
    if (this.kanjiControl.hasError("maxlength"))
      return "Max length is 1 char"
    if (this.kanjiControl.hasError(Validators.pattern.name))
      return "Kanji only"
    return "Unknown error"
  }

  onKanjiCharChanged() {
    if (this.kanjiControl.valid) {
      this.kanji.kanji = this.kanjiControl.value!
      this.emitKanjiChange(this.kanji)
    }
  }
}

enum ReadingType {
  kunyomi = "kunyomi",
  onyomi = "onyomi"
}
