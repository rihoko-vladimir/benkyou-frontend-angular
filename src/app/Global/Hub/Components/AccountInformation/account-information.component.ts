import { Component, EventEmitter, Output } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { PersonalTabComponent } from '../Tabs/PersonalTab/personal-tab.component';
import { GeneralTabComponent } from '../Tabs/GeneralTab/general-tab.component';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'account-information',
  templateUrl: 'account-information.component.html',
  styleUrls: ['account-information.component.scss'],
  standalone: true,
  imports: [MatCard, MatTabGroup, MatTab, GeneralTabComponent, PersonalTabComponent]
})
export class AccountInformationComponent {
  @Output() tabIndexChange = new EventEmitter<number>();

  onTabChanged(event: MatTabChangeEvent) {
    this.tabIndexChange.emit(event.index);
  }
}
