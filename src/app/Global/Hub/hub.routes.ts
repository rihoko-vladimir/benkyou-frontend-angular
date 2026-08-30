import { Routes } from '@angular/router';
import { HubComponent } from './hub.component';
import { HomePageComponent } from './Pages/Home/home-page.component';
import { MySetsComponent } from './Pages/MySets/my-sets.component';
import { AllSetsComponent } from './Pages/AllSets/all-sets.component';
import { AccountComponent } from './Pages/Account/account.component';
import { StudyPageComponent } from './Pages/StudyPage/study-page.component';

export const hubRoutes: Routes = [
  {
    path: '',
    component: HubComponent,
    children: [
      { path: '', component: HomePageComponent, data: { animation: 'Home' } },
      { path: 'my-sets', component: MySetsComponent, data: { animation: 'MySets' } },
      { path: 'all-sets', component: AllSetsComponent, data: { animation: 'AllSets' } },
      { path: 'account', component: AccountComponent, data: { animation: 'Account' } },
      { path: 'study', component: StudyPageComponent, data: { animation: 'Study' } }
    ],
    data: {
      animation: 'hub'
    }
  }
];
