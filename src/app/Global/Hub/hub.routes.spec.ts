import { hubRoutes } from './hub.routes';

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
});
