import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "hub-component",
  styleUrls: ["hub.component.css"],
  templateUrl: "hub.component.html"
})

export class HubComponent {
  constructor(private router: Router) {

  }
}
