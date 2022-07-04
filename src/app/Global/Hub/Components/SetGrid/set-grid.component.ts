import {Component, Input} from "@angular/core";
import Set from "../../../../Models/Set"

@Component({
  selector: "set-grid",
  templateUrl: "set-grid.component.html",
  styleUrls: ["set-grid.component.css"]
})
export class SetGridComponent{
  @Input() sets!: Set[]

}
