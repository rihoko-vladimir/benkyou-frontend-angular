import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadingsContainerComponent } from './readings-container.component';

describe('ReadingsContainerComponent', () => {
  let component: ReadingsContainerComponent;
  let fixture: ComponentFixture<ReadingsContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ReadingsContainerComponent] });
    fixture = TestBed.createComponent(ReadingsContainerComponent);
    component = fixture.componentInstance;
  });

  it('creates with an empty default readings list', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.readings).toEqual([]);
  });

  it('renders one speechable-reading per reading', () => {
    component.readings = ['あ', 'い', 'う'];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-speechable-reading').length).toBe(3);
  });

  it('renders nothing for an empty list', () => {
    component.readings = [];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-speechable-reading').length).toBe(0);
  });
});
