import {Component, Input} from "@angular/core";
import Kanji from "../../../../../Models/Kanji";

@Component({
  selector: "edit-kanji-list",
  templateUrl: "edit-kanji-list.component.html",
  styleUrls: ["edit-kanji-list.component.css"]
})

export class EditKanjiListComponent{
  @Input() kanjiList! : Kanji[]
}
