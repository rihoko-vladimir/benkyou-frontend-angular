import {Component, Input} from "@angular/core";
import Set from "../../../../Models/Set"

@Component({
  selector:"set",
  templateUrl:"set.component.html",
  styleUrls:["set.component.css"]
})

export class SetComponent{
  @Input() set!: Set
}
