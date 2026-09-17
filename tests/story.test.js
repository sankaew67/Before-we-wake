import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { STORY } from '../js/story.js';
import { QUESTIONS, CARDS, getFrames, keepsake } from '../js/choices.js';

const page = (id) => STORY[id - 1];
const text = (frames) => frames.flatMap(f => f.blocks || []).map(b => b.text).join('\n');

test('all 51 pages have images and readable frames', () => {
  assert.equal(STORY.length, 51);
  STORY.forEach((p, index) => {
    assert.equal(p.id, index + 1);
    assert.ok(existsSync(new URL('../' + p.image, import.meta.url)));
    const frames = getFrames(p, {});
    assert.ok(frames.length > 0, `Page ${p.id} is empty`);
    for (const frame of frames) {
      assert.ok(['cover', 'text', 'question', 'keepsake', 'ending'].includes(frame.kind));
      for (const b of frame.blocks || []) assert.ok(b.text.trim());
    }
  });
});

test('declining or skipping a memory stops follow-up questions', () => {
  for (const answers of [{}, { tell: {} }, { tell: { choice: 'ไม่อยากเล่า' } }]) {
    for (const id of [23, 24]) assert.ok(getFrames(page(id), answers).every(f => f.kind !== 'question'));
  }
  assert.ok(getFrames(page(23), { tell: { choice: 'อยากเล่า' } }).some(f => f.kind === 'question'));
});

test('remembered phrase is delayed until the meeting', () => {
  const answers = { tell: { choice: 'อยากเล่า' }, phrase: { text: 'กินข้าวหรือยัง?' } };
  assert.ok(!text(getFrames(page(24), answers)).includes('กินข้าวหรือยัง?'));
  assert.ok(text(getFrames(page(39), answers)).includes('กินข้าวหรือยัง?'));
});

test('standing apart and silence never force speaking or hugging', () => {
  for (const choice of ['ยืนมอง', 'อยู่เงียบ ๆ']) {
    const answers = { action: { choice }, message: { text: 'ข้อความส่วนตัว' } };
    const forty = text(getFrames(page(40), answers));
    assert.ok(!forty.includes('แล้วกอด'));
    assert.ok(!text(getFrames(page(41), answers)).includes('ข้อความส่วนตัว'));
  }
  assert.ok(text(getFrames(page(41), { action: { choice: 'พูดสิ่งที่เขียนไว้' }, message: { text: 'ข้อความส่วนตัว' } })).includes('ข้อความส่วนตัว'));
});

test('every choice branch produces a complete reading sequence', () => {
  for (const [id, q] of Object.entries(QUESTIONS)) {
    for (const choice of q.options || ['']) {
      const answers = { tell: { choice: 'อยากเล่า' }, [q.key]: { choice } };
      assert.ok(getFrames(page(Number(id)), answers).length);
    }
  }
});

test('keepsakes reflect feelings but never reveal private free text', () => {
  assert.equal(keepsake({ grown: { choice: 'เหนื่อย' } }), CARDS.tired);
  assert.equal(keepsake({ unsaid: { choice: 'ขอโทษ' } }), CARDS.sorry);
  assert.equal(keepsake({ unsaid: { choice: 'ขอบคุณ' } }), CARDS.thanks);
  assert.equal(keepsake({ message: { choice: 'คิดถึงนะ' } }), CARDS.missing);
  assert.equal(keepsake({ unsaid: { choice: 'ยังไม่พร้อม' } }), CARDS.unready);
  assert.ok(!keepsake({ message: { text: 'SECRET' } }).includes('SECRET'));
});

test('shipping source uses safe text insertion and no answer persistence', () => {
  const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
  assert.ok(!source.includes('innerHTML'));
  assert.ok(!source.includes('localStorage'));
  assert.ok(!source.includes('fetch('));
});
