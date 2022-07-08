import {Component, EventEmitter, Input, Output} from "@angular/core";
import Set from "../../../../Models/Set"

@Component({
  selector: "set-grid",
  templateUrl: "set-grid.component.html",
  styleUrls: ["set-grid.component.css"]
})
export class SetGridComponent{
  @Input() sets!: Set[]
  @Output() setsChange = new EventEmitter<Set[]>()

  onSetChange(index : number, set : Set) {
    console.log(set)
    console.log(index)
    let changedSets = [...this.sets]
    changedSets[index] = set
    this.setsChange.emit(changedSets)
  }

  onSetRemove(id: string) {
    console.log(id)
    let changedSets = [...this.sets]
    changedSets = changedSets.filter(value => value.id != id)
    this.setsChange.emit(changedSets)
  }
}
