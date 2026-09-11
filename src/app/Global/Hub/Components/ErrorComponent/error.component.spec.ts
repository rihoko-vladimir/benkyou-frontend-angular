import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ErrorComponent] });
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
  });

  it('creates with default componentName', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.componentName).toBe('');
  });

  it('renders the componentName in the message', () => {
    component.componentName = 'Kanji List';
    fixture.detectChanges();
    const p = fixture.nativeElement.querySelector('p');
    expect(p.textContent).toContain('Kanji List');
  });

  it('emits retry when the button is clicked', () => {
    const spy = vi.fn();
    component.retry.subscribe(spy);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
