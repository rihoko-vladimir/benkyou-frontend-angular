import {Component, OnInit} from "@angular/core";

@Component({
  selector : "auth-page-container",
  templateUrl: "auth-page-container.component.html",
  styleUrls: ["auth-page-container.component.css"]
})

export class AuthPageContainerComponent implements OnInit{
  ngOnInit(): void {
    console.log("auth page inits")
  }

}
