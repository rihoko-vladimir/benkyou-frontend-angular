import {Component, EventEmitter, Input, Output} from "@angular/core";
import Kanji from "../../../../../Models/Kanji";

@Component({
  selector: "edit-kanji-list",
  templateUrl: "edit-kanji-list.component.html",
  styleUrls: ["edit-kanji-list.component.css"]
})

export class EditKanjiListComponent{
  @Input() kanjiList! : Kanji[]
  @Output() kanjiListChange = new EventEmitter<Kanji[]>()

  onAddNewKanjiClicked() {
    this.kanjiList.push(new Kanji())
  }

  onRemoveKanji(index: number){
    this.kanjiList.splice(index,1)
  }

  onKanjiChanged(object: {kanji : Kanji, index : number}) {
    this.kanjiList[object.index] = object.kanji
    this.kanjiListChange.emit(this.kanjiList)
  }
}
