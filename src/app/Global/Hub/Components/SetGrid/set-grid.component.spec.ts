import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import Set from '../../../../Models/Set';
import { MySetsService } from '../../../../Services/my-sets.service';
import { SetComponent } from '../Set/set.component';
import { SetGridComponent } from './set-grid.component';

describe('SetGridComponent', () => {
  let component: SetGridComponent;
  let fixture: ComponentFixture<SetGridComponent>;
  let sets: Set[];

  beforeEach(() => {
    sets = [new Set('1', 'Set One'), new Set('2', 'Set Two')];

    TestBed.configureTestingModule({
      imports: [SetGridComponent],
      providers: [
        provideNoopAnimations(),
        { provide: Router, useValue: { navigate: vi.fn().mockResolvedValue(true) } },
        { provide: Store, useValue: { dispatch: vi.fn() } },
        { provide: MySetsService, useValue: { addSet: vi.fn().mockReturnValue(of(sets[0])) } }
      ]
    });

    fixture = TestBed.createComponent(SetGridComponent);
    component = fixture.componentInstance;
    component.sets = sets;
    component.mode = 'owner';
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders one set component per set', () => {
    expect(fixture.debugElement.queryAll(By.directive(SetComponent)).length).toBe(2);
  });

  it('emits setChange and setsChange on onSetChange', () => {
    const setChangeSpy = vi.fn();
    const setsChangeSpy = vi.fn();
    component.setChange.subscribe(setChangeSpy);
    component.setsChange.subscribe(setsChangeSpy);

    const newSet = new Set('1', 'Updated Set One');
    component.onSetChange(0, newSet);

    expect(setChangeSpy).toHaveBeenCalledWith({ set: newSet, originalSet: sets[0] });
    expect(setsChangeSpy).toHaveBeenCalledWith([newSet, sets[1]]);
  });

  it('emits setsRemove and filtered setsChange on onSetRemove', () => {
    const setsRemoveSpy = vi.fn();
    const setsChangeSpy = vi.fn();
    component.setsRemove.subscribe(setsRemoveSpy);
    component.setsChange.subscribe(setsChangeSpy);

    component.onSetRemove('1');

    expect(setsRemoveSpy).toHaveBeenCalledWith('1');
    expect(setsChangeSpy).toHaveBeenCalledWith([sets[1]]);
  });

  it('relays child setChange and remove events to the grid outputs', () => {
    const setChangeSpy = vi.fn();
    const setsRemoveSpy = vi.fn();
    component.setChange.subscribe(setChangeSpy);
    component.setsRemove.subscribe(setsRemoveSpy);
    const child = fixture.debugElement.queryAll(By.directive(SetComponent))[0].componentInstance as SetComponent;
    const updatedSet = new Set('1', 'Renamed');

    child.setChange.emit(updatedSet);
    child.remove.emit('1');

    expect(setChangeSpy).toHaveBeenCalledWith({ set: updatedSet, originalSet: sets[0] });
    expect(setsRemoveSpy).toHaveBeenCalledWith('1');
  });
});
