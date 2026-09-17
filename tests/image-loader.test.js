import test from 'node:test';
import assert from 'node:assert/strict';
import { loadImage, loadSceneImage } from '../js/image-loader.js';

function mockImage(fail = () => false) {
  return class {
    naturalWidth = 0;
    complete = false;
    set src(value) {
      this.url = value;
      queueMicrotask(() => {
        this.complete = true;
        if (fail(value)) this.onerror?.();
        else { this.naturalWidth = 841; this.onload?.(); }
      });
    }
    get src() { return this.url; }
    decode() { throw new Error('decode is unsupported or rejects'); }
  };
}

test('valid image loads even when decode is unusable', async () => {
  assert.equal((await loadImage('15.webp', { ImageClass: mockImage() })).naturalWidth, 841);
});
test('failed page 15 WebP recovers using JPEG', async () => {
  const image = await loadSceneImage('assets/images/15.webp', { ImageClass: mockImage(src => src.endsWith('.webp')) });
  assert.equal(image.src, 'assets/images/15.jpg');
});
test('unavailable formats report failure without leaving a pending promise', async () => {
  await assert.rejects(loadSceneImage('15.webp', { ImageClass: mockImage(() => true) }), /unavailable/);
});
test('stale requests abort instead of overwriting a newer scene', async () => {
  const controller = new AbortController();
  const promise = loadSceneImage('15.webp', { ImageClass: mockImage(), signal: controller.signal });
  controller.abort();
  await assert.rejects(promise, { name: 'AbortError' });
});
test('requests have a bounded timeout', async () => {
  await assert.rejects(loadImage('15.webp', { ImageClass: class {}, timeout: 5 }), /timed out/);
});
