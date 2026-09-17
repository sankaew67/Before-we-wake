import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ARTWORK } from '../js/artwork-manifest.js';
import { STORY } from '../js/story.js';
import { QUESTIONS, getFrames } from '../js/choices.js';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
test('all 51 bundled illustrations exactly match their original image bytes', () => {
  assert.equal(Object.keys(ARTWORK).length, 51);
  const bundles = new Map();
  for (const [id, path] of Object.entries(ARTWORK)) {
    if (!bundles.has(path)) bundles.set(path, JSON.parse(readFileSync(new URL('../' + path, import.meta.url))));
    const bytes = Buffer.from(bundles.get(path)[id].split(',')[1], 'base64');
    const file = String(id).padStart(2, '0') + '.webp';
    const original = [1,50].includes(Number(id)) ? '../assets/images/' : '../source-images/';
    assert.equal(sha(bytes), sha(readFileSync(new URL(original + file, import.meta.url))), 'Wrong artwork on page ' + id);
  }
});

test('page 19 places the requested sentence immediately after every relationship answer', () => {
  for (const choice of QUESTIONS[14].options) {
    const frames = getFrames(STORY[18], { person: { choice } });
    const blocks = frames.flatMap(frame => frame.blocks || []);
    const i = blocks.findIndex(b => b.text === 'ความคิดในหัวกลับเด้งขึ้นมาเป็นคำตอบนั้น');
    assert.equal(i, 3);
    assert.ok(blocks[i - 1].text.length);
  }
});
