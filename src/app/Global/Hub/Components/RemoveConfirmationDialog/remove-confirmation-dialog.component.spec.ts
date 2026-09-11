import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { vi } from 'vitest';
import { RemoveConfirmationDialogComponent } from './remove-confirmation-dialog.component';

describe('RemoveConfirmationDialogComponent', () => {
  let component: RemoveConfirmationDialogComponent;
  let fixture: ComponentFixture<RemoveConfirmationDialogComponent>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dialogRef = { close: vi.fn() };

    TestBed.configureTestingModule({
      imports: [RemoveConfirmationDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: dialogRef }]
    });

    fixture = TestBed.createComponent(RemoveConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('closes with false on cancel', () => {
    (fixture.nativeElement.querySelectorAll('button')[0] as HTMLElement).click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('closes with true on confirm', () => {
    (fixture.nativeElement.querySelectorAll('button')[1] as HTMLElement).click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
