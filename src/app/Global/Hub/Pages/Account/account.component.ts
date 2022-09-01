import {Component} from "@angular/core";

@Component({
  selector: "account-page",
  templateUrl: "account.component.html",
  styleUrls: ["account.component.css"]
})

export class AccountComponent {
  currentTab : number = 0

  onTabChanged(index: number) {
    this.currentTab = index
  }
}
