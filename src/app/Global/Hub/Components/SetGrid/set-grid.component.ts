import {Component, EventEmitter, Input, Output} from "@angular/core";
import Set from "../../../../Models/Set"

@Component({
  selector: "set-grid",
  templateUrl: "set-grid.component.html",
  styleUrls: ["set-grid.component.css"]
})
export class SetGridComponent{
  @Input() sets!: Set[]
  @Input() mode! : string
  @Output() setsChange = new EventEmitter<Set[]>()
  @Output() setsRemove = new EventEmitter<string>()

  onSetChange(index : number, set : Set) {
    console.log(set)
    console.log(index)
    let changedSets = [...this.sets]
    changedSets[index] = set
    this.setsChange.emit(changedSets)
  }

  onSetRemove(id: string) {
    this.setsRemove.emit(id)
    let changedSets = [...this.sets]
    changedSets = changedSets.filter(value => value.id != id)
    this.setsChange.emit(changedSets)
  }
}


