import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AccountOverviewComponent } from './account-overview.component';
import { AccountService } from '../../../../Services/account.service';
import { accountInitialState, IAccountState } from '../../../../Redux/Reducers/account.reducer';
import { accountInfoSuccess, accountError } from '../../../../Redux/Actions/account.actions';
import { mapUserResponseToAccountState } from '../../../../Services/Helpers/converters';

describe('AccountOverviewComponent', () => {
  let component: AccountOverviewComponent;
  let fixture: ComponentFixture<AccountOverviewComponent>;
  let store: { select: () => BehaviorSubject<IAccountState>; dispatch: ReturnType<typeof vi.fn> };
  let accountService: { uploadNewAvatar: ReturnType<typeof vi.fn> };
  let accountState$: BehaviorSubject<IAccountState>;

  const userInfo = {
    id: '1',
    firstName: 'Jane',
    lastName: 'Doe',
    userName: 'jd',
    userRole: 'user',
    isTermsAccepted: true,
    isAccountPublic: false,
    birthDay: '',
    about: '',
    avatarUrl: 'url'
  };

  beforeEach(() => {
    accountState$ = new BehaviorSubject<IAccountState>({ ...accountInitialState, firstName: 'Jane', lastName: 'Doe' });
    store = { select: () => accountState$, dispatch: vi.fn() };
    accountService = { uploadNewAvatar: vi.fn() };

    TestBed.configureTestingModule({
      imports: [AccountOverviewComponent],
      providers: [
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: AccountService, useValue: accountService }
      ]
    });

    fixture = TestBed.createComponent(AccountOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates and exposes account fields as computed signals', () => {
    expect(component).toBeTruthy();
    expect(component.firstName()).toBe('Jane');
    expect(component.lastName()).toBe('Doe');
  });

  it('renders the avatar image once the account has an avatarUrl', () => {
    accountState$.next({ ...accountInitialState, avatarUrl: 'https://example.com/avatar.png' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img.avatarClass')).toBeTruthy();
  });

  it('resets file selection when fileInput is undefined', () => {
    component.selectedFile.set(new File([''], 'a.png'));
    component.fileImage.set(new ArrayBuffer(1));

    component.resetFileSelection();

    expect(component.selectedFile()).toBeUndefined();
    expect(component.fileImage()).toBeUndefined();
  });

  it('resets file selection and clears the file input when present', () => {
    const nativeElement = { value: 'something' };
    component.fileInput = { nativeElement } as unknown as ElementRef;
    component.selectedFile.set(new File([''], 'a.png'));

    component.resetFileSelection();

    expect(nativeElement.value).toBe('');
    expect(component.selectedFile()).toBeUndefined();
  });

  it('sets the selected file and reads it as a data URL on onFileSelected', () => {
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile()).toBe(file);
  });

  it('leaves selectedFile undefined when no file is chosen', () => {
    const event = { target: { files: [] } } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile()).toBeUndefined();
  });

  it('resets file selection on ngOnChanges', () => {
    component.selectedFile.set(new File([''], 'a.png'));

    component.ngOnChanges();

    expect(component.selectedFile()).toBeUndefined();
  });

  it('dispatches accountInfoSuccess on successful avatar upload', () => {
    accountService.uploadNewAvatar.mockReturnValue(of(userInfo));
    component.selectedFile.set(new File([''], 'a.png'));

    component.onChange();

    expect(store.dispatch).toHaveBeenCalledWith(accountInfoSuccess(mapUserResponseToAccountState(userInfo)));
  });

  it('dispatches accountError on failed avatar upload', () => {
    accountService.uploadNewAvatar.mockReturnValue(throwError(() => ({ error: 'boom' })));
    component.selectedFile.set(new File([''], 'a.png'));

    component.onChange();

    expect(store.dispatch).toHaveBeenCalledWith(accountError({ errorMessage: 'boom' }));
  });

  it('resets file selection on onDiscard', () => {
    component.selectedFile.set(new File([''], 'a.png'));

    component.onDiscard();

    expect(component.selectedFile()).toBeUndefined();
  });

  it('shows the upload button on the account tab and opens the file picker when clicked', () => {
    // setInput marks the OnPush view dirty; a plain property write leaves this
    // animated @if block unrendered on the update path.
    fixture.componentRef.setInput('currentTab', 1);
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector('#file') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    (fixture.nativeElement.querySelector('button.changeAvatar') as HTMLElement).click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('resets the selection when the discard button is clicked', () => {
    component.currentTab = 1;
    component.selectedFile.set(new File([''], 'a.png'));
    component.fileImage.set(new ArrayBuffer(1));
    fixture.detectChanges();

    (fixture.nativeElement.querySelectorAll('.discardConfirm button')[0] as HTMLElement).click();

    expect(component.selectedFile()).toBeUndefined();
    expect(component.fileImage()).toBeUndefined();
  });

  it('uploads the selection when the confirm button is clicked', () => {
    accountService.uploadNewAvatar.mockReturnValue(of(userInfo));
    component.currentTab = 1;
    component.selectedFile.set(new File([''], 'a.png'));
    component.fileImage.set(new ArrayBuffer(1));
    fixture.detectChanges();

    (fixture.nativeElement.querySelectorAll('.discardConfirm button')[1] as HTMLElement).click();

    expect(accountService.uploadNewAvatar).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(accountInfoSuccess(mapUserResponseToAccountState(userInfo)));
  });

  it('reads the selected file as a data URL once the FileReader loads', async () => {
    const file = new File(['content'], 'avatar.png', { type: 'image/png' });
    const fileInput = fixture.nativeElement.querySelector('#file') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });

    fileInput.dispatchEvent(new Event('change'));

    await vi.waitFor(() => expect(component.fileImage()).toBeDefined());
  });
});
