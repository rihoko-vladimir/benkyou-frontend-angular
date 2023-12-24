import {Component, Inject} from "@angular/core";
import Kanji from "../../../../Models/Kanji";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


export class DialogData{
  kanjiList: Kanji[]
  constructor(kanjiList: Kanji[]) {
    this.kanjiList = [...kanjiList]
  }
}
@Component({
  selector: "set-preview-dialog",
  templateUrl: "set-preview-dialog.component.html",
  styleUrls: ["set-preview-dialog.component.css"]
})

export class SetPreviewDialogComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
