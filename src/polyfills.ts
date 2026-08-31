/***************************************************************************************************
 * Zone JS
 *
 * Zoneless change detection (provideZonelessChangeDetection in main.ts) means
 * the BUILD no longer loads zone.js. The unit-test harness (Karma) still runs
 * zone-based — `zone.js/testing` is imported in src/test.ts and zone.js stays
 * a devDependency for that reason. When the test stack moves to Vitest
 * (Angular 22 hop), zone.js can be dropped entirely.
 */

/***************************************************************************************************
 * APPLICATION IMPORTS
 */
