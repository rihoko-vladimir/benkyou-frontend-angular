import {Component, EventEmitter, Output} from "@angular/core";
import {MatLegacyTabChangeEvent as MatTabChangeEvent} from "@angular/material/legacy-tabs";

@Component({
  selector : "account-information",
  templateUrl : "account-information.component.html",
  styleUrls : ["account-information.component.css"]
})

export class AccountInformationComponent {
  @Output() tabIndexChange = new EventEmitter<number>()


  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndexChange.emit(event.index)
  }
}
