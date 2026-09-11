import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import Answer from '../../../../Models/Answer';
import Kanji from '../../../../Models/Kanji';
import { finishStudying } from '../../../../Redux/Actions/set-study.actions';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let store: { dispatch: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    store = { dispatch: vi.fn() };
    router = { navigate: vi.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        { provide: Store, useValue: store },
        { provide: Router, useValue: router }
      ]
    });
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it('renders a result entry for every answer', () => {
    component.results = [new Answer(new Kanji('一')), new Answer(new Kanji('二'))];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-result').length).toBe(2);
  });

  it('navigates to my-sets and dispatches finishStudying on Finish click', async () => {
    component.results = [];
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['hub', 'my-sets']);
    expect(store.dispatch).toHaveBeenCalledWith(finishStudying());
  });

  it('onFinishClicked navigates then dispatches in order', async () => {
    component.results = [];
    await component.onFinishClicked();

    expect(router.navigate).toHaveBeenCalledWith(['hub', 'my-sets']);
    expect(store.dispatch).toHaveBeenCalledWith(finishStudying());
    expect(router.navigate.mock.invocationCallOrder[0]).toBeLessThan(store.dispatch.mock.invocationCallOrder[0]);
  });
});
