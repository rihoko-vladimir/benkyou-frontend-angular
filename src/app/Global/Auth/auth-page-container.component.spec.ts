import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AuthPageContainerComponent } from './auth-page-container.component';

@Component({ template: '' })
class TestRouteComponent {}

describe('AuthPageContainerComponent', () => {
  let component: AuthPageContainerComponent;
  let fixture: ComponentFixture<AuthPageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthPageContainerComponent],
      providers: [
        provideRouter([{ path: '', component: TestRouteComponent, data: { animation: 'authPage' } }]),
        provideNoopAnimations()
      ]
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

  it('returns the animation data of the active child route', async () => {
    fixture.detectChanges();

    await TestBed.inject(Router).navigateByUrl('/');
    fixture.detectChanges();

    expect(component.getAuthRoutingAnimations()).toBe('authPage');
  });
});
