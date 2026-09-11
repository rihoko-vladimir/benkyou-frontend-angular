/**
 * Global test environment setup, loaded before every spec via the
 * "setupFiles" option of the test target in angular.json.
 *
 * The unit tests run in a happy-dom environment, which does not implement the
 * Web Speech API. Specs that render speech-enabled components
 * (SpeechableReadingComponent, KanjiSvgDrawingPreviewComponent) need these
 * globals to exist before the components are constructed.
 */

class SpeechSynthesisUtteranceMock {
  text: string;
  lang = '';
  pitch = 1;
  rate = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;

  constructor(text = '') {
    this.text = text;
  }
}

const testGlobals = globalThis as unknown as Record<string, unknown>;

testGlobals['SpeechSynthesisUtterance'] = SpeechSynthesisUtteranceMock;
testGlobals['speechSynthesis'] = {
  cancel: () => undefined,
  speak: () => undefined,
  pause: () => undefined,
  resume: () => undefined,
  getVoices: () => []
};
