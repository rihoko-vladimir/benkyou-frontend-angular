import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { AccountInformationComponent } from './account-information.component';
import { AccountService } from '../../../../Services/account.service';
import { accountInitialState } from '../../../../Redux/Reducers/account.reducer';

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(() => {
    // The tab children are rendered real: overriding them would make TestBed
    // recompile this component and skip its instrumented AOT template.
    TestBed.configureTestingModule({
      imports: [AccountInformationComponent],
      providers: [
        { provide: Store, useValue: { select: () => new BehaviorSubject(accountInitialState), dispatch: vi.fn() } },
        { provide: AccountService, useValue: { updateUserAccount: vi.fn() } }
      ]
    });

    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('emits the selected tab index on onTabChanged', async () => {
    const emitSpy = vi.fn();
    component.tabIndexChange.subscribe(emitSpy);

    const tabGroup = fixture.debugElement.query(By.directive(MatTabGroup)).componentInstance as MatTabGroup;
    // selectedTabChange is an async EventEmitter, delivery lands on a later task.
    tabGroup.selectedTabChange.emit({ index: 1 } as MatTabChangeEvent);

    await vi.waitFor(() => expect(emitSpy).toHaveBeenCalledWith(1));
  });
});
