import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthPageContainerComponent } from './auth-page-container.component';

describe('AuthPageContainerComponent', () => {
  let component: AuthPageContainerComponent;
  let fixture: ComponentFixture<AuthPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthPageContainerComponent],
      providers: [provideRouter([]), provideNoopAnimations()]
    });

    fixture = TestBed.createComponent(AuthPageContainerComponent);
    component = fixture.componentInstance;
  });

  it('creates', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('returns undefined animation data when there is no active route context', () => {
    fixture.detectChanges();
    expect(component.getAuthRoutingAnimations()).toBeUndefined();
  });
});
