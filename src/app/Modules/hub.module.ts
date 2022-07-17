import {NgModule} from "@angular/core";
import {HubComponent} from "../Global/Hub/hub.component";
import {AppRoutingModule} from "./routing.module";
import {MaterialModule} from "./material.module";
import {HomePageComponent} from "../Global/Hub/Pages/Home/home-page.component";
import {MySetsComponent} from "../Global/Hub/Pages/MySets/my-sets.component";
import {AllSetsComponent} from "../Global/Hub/Pages/AllSets/all-sets.component";
import {AccountComponent} from "../Global/Hub/Pages/Account/account.component";
import {
  AccountInfoListItemComponent
} from "../Global/Hub/Components/AccountInfoListItem/account-info-list-item.component";
import {SetGridComponent} from "../Global/Hub/Components/SetGrid/set-grid.component";
import {SetComponent} from "../Global/Hub/Components/Set/set.component";
import {CommonModule} from "@angular/common";
import {KanjiListComponent} from "../Global/Hub/Components/KanjiList/kanji-list.component";
import {KanjiComponent} from "../Global/Hub/Components/Kanji/kanji.component";
import {SetDialogComponent} from "../Global/Hub/Components/SetDialog/set-dialog.component";
import {EditKanjiListComponent} from "../Global/Hub/Components/SetDialog/EditKanjiList/edit-kanji-list.component";
import {EditKanjiComponent} from "../Global/Hub/Components/SetDialog/EditKanji/edit-kanji.component";
import {ReactiveFormsModule} from "@angular/forms";
import {StudyPageComponent} from "../Global/Hub/Pages/StudyPage/study-page.component";
import {ResultsComponent} from "../Global/Hub/Components/ResultsComponent/results.component";
import {ResultComponent} from "../Global/Hub/Components/Result/result.component";
import {ResultReadingComponent} from "../Global/Hub/Components/ResultReading/result-reading.component";
import {AllSetsService} from "../Services/all-sets.service";
import {MySetsService} from "../Services/my-sets.service";
import {AccountOverviewComponent} from "../Global/Hub/Components/AccountOverview/account-overview.component";
import {
  RemoveConfirmationDialogComponent
} from "../Global/Hub/Components/RemoveConfirmationDialog/remove-confirmation-dialog.component";
import {AccountInformationComponent} from "../Global/Hub/Components/AccountInformation/account-information.component";
import {GeneralTabComponent} from "../Global/Hub/Components/Tabs/GeneralTab/general-tab.component";
import {PersonalTabComponent} from "../Global/Hub/Components/Tabs/PersonalTab/personal-tab.component";
import {AccountService} from "../Services/account.service";
import {ErrorComponent} from "../Global/Hub/Components/ErrorComponent/error.component";

@NgModule({
  declarations: [
    HubComponent,
    HomePageComponent,
    MySetsComponent,
    AllSetsComponent,
    AccountComponent,
    AccountInfoListItemComponent,
    SetGridComponent,
    SetComponent,
    KanjiListComponent,
    KanjiComponent,
    SetDialogComponent,
    RemoveConfirmationDialogComponent,
    EditKanjiListComponent,
    EditKanjiComponent,
    StudyPageComponent,
    ResultsComponent,
    ResultComponent,
    ResultReadingComponent,
    AccountOverviewComponent,
    AccountInformationComponent,
    GeneralTabComponent,
    PersonalTabComponent,
    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    AllSetsService,
    MySetsService,
    AccountService
  ],
})

export class HubModule {
}
