import {Component, Input} from "@angular/core";

@Component({
  selector: "result-reading",
  templateUrl: "result-reading.component.html",
  styleUrls: ["result-reading.component.css"]
})

export class ResultReadingComponent{
  @Input() reading : string = ""
  @Input() type : string = ReadingType.incorrect
}

export enum ReadingType{
  correct = "correct",
  required = "required",
  incorrect = "incorrect"
}
