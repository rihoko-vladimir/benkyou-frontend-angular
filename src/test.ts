// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// The app build is zoneless (see src/polyfills.ts), so the zone.js runtime
// must be loaded here for the zoned test harness before the testing bridge.
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
