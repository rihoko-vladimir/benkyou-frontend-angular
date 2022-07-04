import {NgModule} from "@angular/core";
import {HubComponent} from "../Global/Hub/hub.component";
import {AppRoutingModule} from "./routing.module";
import {MaterialModule} from "./material.module";
import {HomePageComponent} from "../Global/Hub/Pages/Home/home-page.component";
import {MySetsComponent} from "../Global/Hub/Pages/MySets/my-sets.component";
import {AllSetsComponent} from "../Global/Hub/Pages/AllSets/all-sets.component";
import {AccountComponent} from "../Global/Hub/Pages/Account/account.component";
import {AccountInfoListItemComponent} from "../Global/Hub/Components/AccountInfoListItem/account-info-list-item.component";
import {SetGridComponent} from "../Global/Hub/Components/SetGrid/set-grid.component";
import {SetComponent} from "../Global/Hub/Components/Set/set.component";

@NgModule({
  declarations: [
    HubComponent,
    HomePageComponent,
    MySetsComponent,
    AllSetsComponent,
    AccountComponent,
    AccountInfoListItemComponent,
    SetGridComponent,
    SetComponent
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
  ]
})

export class HubModule {}
