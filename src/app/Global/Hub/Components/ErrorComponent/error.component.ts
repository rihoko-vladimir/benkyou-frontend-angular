import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector : "error",
  templateUrl: "error.component.html",
  styleUrls : ["error.component.css"]
})

export class ErrorComponent{
  @Input() componentName : string = ""
  @Output() onRetry = new EventEmitter()
}
