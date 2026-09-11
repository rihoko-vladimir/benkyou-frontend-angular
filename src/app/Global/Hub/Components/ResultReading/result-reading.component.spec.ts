import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultReadingComponent } from './result-reading.component';

describe('ResultReadingComponent', () => {
  let component: ResultReadingComponent;
  let fixture: ComponentFixture<ResultReadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResultReadingComponent] });
    fixture = TestBed.createComponent(ResultReadingComponent);
    component = fixture.componentInstance;
  });

  it('creates with default inputs', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.reading).toBe('');
    expect(component.type).toBe('incorrect');
  });

  it('renders the reading text', () => {
    component.reading = 'いち';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('いち');
  });

  it('applies the correct class when type is correct', () => {
    component.type = 'correct';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('.reading');
    expect(div.classList.contains('correct')).toBe(true);
    expect(div.classList.contains('required')).toBe(false);
    expect(div.classList.contains('incorrect')).toBe(false);
  });

  it('applies the required class when type is required', () => {
    component.type = 'required';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('.reading');
    expect(div.classList.contains('required')).toBe(true);
  });

  it('applies the incorrect class when type is incorrect', () => {
    component.type = 'incorrect';
    fixture.detectChanges();
    const div = fixture.nativeElement.querySelector('.reading');
    expect(div.classList.contains('incorrect')).toBe(true);
  });
});
