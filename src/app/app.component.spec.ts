import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app.component';
import { ThemeService } from './Services/theme.service';
import { setStudyReducer } from './Redux/Reducers/set-study.reducer';
import { allSetsReducer } from './Redux/Reducers/all-sets.reducer';
import { mySetsReducer } from './Redux/Reducers/my-sets.reducer';
import { accountReducer } from './Redux/Reducers/account.reducer';
import { snackbarReducer } from './Redux/Reducers/snackbar.reducer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        // Real store mirroring main.ts (without the hydration meta-reducer):
        // AppComponent subscribes to ThemeService, which reads the account slice.
        provideStore({
          setStudy: setStudyReducer,
          allSets: allSetsReducer,
          mySets: mySetsReducer,
          account: accountReducer,
          snackbar: snackbarReducer
        }),
        ThemeService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});