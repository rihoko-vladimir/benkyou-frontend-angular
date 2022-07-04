import {NgModule} from "@angular/core";
import {HubComponent} from "../Hub/hub.component";
import {AppRoutingModule} from "./routing.module";
import {MaterialModule} from "./material.module";
import {HomePageComponent} from "../Hub/Pages/Home/home-page.component";
import {MySetsComponent} from "../Hub/Pages/MySets/my-sets.component";
import {AllSetsComponent} from "../Hub/Pages/AllSets/all-sets.component";
import {AccountComponent} from "../Hub/Pages/Account/account.component";
import {AccountInfoListItemComponent} from "../Hub/Components/AccountInfoListItem/account-info-list-item.component";

@NgModule({
  declarations: [
    HubComponent,
    HomePageComponent,
    MySetsComponent,
    AllSetsComponent,
    AccountComponent,
    AccountInfoListItemComponent
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
  ]
})

export class HubModule {}
