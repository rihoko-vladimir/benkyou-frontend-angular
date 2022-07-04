import {Component} from "@angular/core";

@Component({
  selector: "my-sets-page",
  templateUrl: "my-sets.component.html",
  styleUrls: ["my-sets.component.css"]
})

export class MySetsComponent {

  onCreateNewSetClicked() {
    console.log("I'll create new set sometime")
  }
}
