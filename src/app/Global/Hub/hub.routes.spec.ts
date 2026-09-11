import { hubRoutes } from './hub.routes';
import { HubComponent } from './hub.component';
import { HomePageComponent } from './Pages/Home/home-page.component';
import { MySetsComponent } from './Pages/MySets/my-sets.component';
import { AllSetsComponent } from './Pages/AllSets/all-sets.component';
import { AccountComponent } from './Pages/Account/account.component';
import { StudyPageComponent } from './Pages/StudyPage/study-page.component';

describe('hubRoutes', () => {
  it('defines a single top-level route with five child pages', () => {
    expect(hubRoutes.length).toBe(1);

    const children = hubRoutes[0].children ?? [];
    const paths = children.map(c => c.path);

    expect(paths).toEqual(['', 'my-sets', 'all-sets', 'account', 'study']);
  });

  it('tags each child route with its animation name', () => {
    const children = hubRoutes[0].children ?? [];
    const animations = children.map(c => c.data?.['animation']);

    expect(animations).toEqual(['Home', 'MySets', 'AllSets', 'Account', 'Study']);
  });

  it('wires the hub shell and each child path to its page component', () => {
    expect(hubRoutes[0].component).toBe(HubComponent);

    const children = hubRoutes[0].children ?? [];
    expect(children.map(c => c.component)).toEqual([
      HomePageComponent,
      MySetsComponent,
      AllSetsComponent,
      AccountComponent,
      StudyPageComponent
    ]);
  });
});
