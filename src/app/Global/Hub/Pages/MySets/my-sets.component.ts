import {Component} from "@angular/core";
import Set from "../../../../Models/Set"
import Kanji from "../../../../Models/Kanji";
import {MatDialog} from "@angular/material/dialog";
import {OpenMode, SetDialogComponent} from "../../Components/SetDialog/set-dialog.component";

@Component({
  selector: "my-sets-page",
  templateUrl: "my-sets.component.html",
  styleUrls: ["my-sets.component.css"]
})

export class MySetsComponent {
  dummySets : Set[]
  constructor(private dialog: MatDialog) {
    this.dummySets = [
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
                    ["f","h"]),
          new Kanji("K",
            ["g","m"],
            ["f","h"]),
          new Kanji("K",
            ["g","m"],
            ["f","h"]),
          new Kanji("K",
            ["g","m"],
            ["f","h"]),
          new Kanji("K",
            ["g","m"],
            ["f","h"]),
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("1",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),

    ]
  }
  onCreateNewSetClicked() {
    let dialogRef = this.dialog.open(SetDialogComponent).componentInstance
    dialogRef.mode = OpenMode.create
    dialogRef.set = new Set()
  }
}
