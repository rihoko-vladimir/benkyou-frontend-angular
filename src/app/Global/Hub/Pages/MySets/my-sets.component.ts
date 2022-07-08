import {Component} from "@angular/core";
import Set from "../../../../Models/Set"
import Kanji from "../../../../Models/Kanji";
import {MatDialog} from "@angular/material/dialog";
import {DialogProperties, OpenMode, SetDialogComponent} from "../../Components/SetDialog/set-dialog.component";

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
      new Set("2",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("3",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("4",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("5",
        "Test",
        "Test test test",
        "Vladimir",
        "1",
        [
          new Kanji("K",
            ["g","m"],
            ["f","h"])
        ]),
      new Set("6",
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
    this.dialog.open(SetDialogComponent, {
      data: new DialogProperties(OpenMode.create, new Set())
    }).afterClosed().subscribe((set) => this.onSetCreated(set))
  }

  onSetCreated(set : Set | undefined){
    if (set !== undefined){
      //TODO SEND TO API
      //TODO add response set to redux
      set.id = Math.random().toString()
      this.dummySets.push(set)
    }else{
      console.log("Set wasn't created")
    }
  }
}
