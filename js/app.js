/**
 * Story player controller.
 * Content: story.js / choices.js. Style: css/styles.css.
 * No framework, build step, analytics, cookies, or answer uploads.
 */
import { STORY } from './story.js';
import { getFrames, moodFor, QUESTIONS, keepsake } from './choices.js?v=20260917b';
import { Ambience } from './audio.js';
import { loadSceneImage, prepareArtwork } from './image-loader.js?v=20260917b';
import { saveKeepsake, shareStory } from './keepsake.js';

const $ = (id) => document.getElementById(id);
const ui = {
  stage: $('stage'), content: $('content'), next: $('next'), back: $('back'),
  navigation: $('navigation'), sound: $('sound'), start: $('start'),
  cover: $('cover-action'), number: $('scene-number'), position: $('reading-position'),
  progress: $('progress'), notice: $('notice'), images: [$('image-a'), $('image-b')],
};
const state = { page: 1, beat: 0, answers: {}, history: [], busy: false };
const ambience = new Ambience();
let currentImage = 0;
let imagePage = 1;
let imageRequest;

let draft = {};
let noticeTimer;
let soundChosen = false;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function frames() { return getFrames(STORY[state.page - 1], state.answers); }
function currentFrame() { return frames()[state.beat]; }

function notify(message, link) {
  clearTimeout(noticeTimer);
  ui.notice.replaceChildren(document.createTextNode(message));
  if (link) {
    const anchor = element('a', ' เปิดภาพ');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    ui.notice.append(anchor);
  }
  ui.notice.hidden = false;
  noticeTimer = setTimeout(() => { ui.notice.hidden = true; }, link ? 30000 : 6000);
}

/** Prepare the exact illustration before changing either the page or its text. */
async function prepareScene(page) {
  if (imagePage === page) return null;
  imageRequest?.abort();
  const request = imageRequest = new AbortController();
  ui.stage.classList.add('is-loading-image');
  try {
    return await loadSceneImage(STORY[page - 1].image, { signal: request.signal });
  } finally {
    if (imageRequest === request) ui.stage.classList.remove('is-loading-image');
  }
}

function displayScene(page, loaded) {
  if (!loaded) return;
  const nextIndex = 1 - currentImage;
  ui.images[nextIndex].src = loaded.src;
  ui.images[currentImage].classList.remove('is-visible');
  ui.images[nextIndex].classList.add('is-visible');
  currentImage = nextIndex;
  imagePage = page;
  ui.stage.dataset.imagePage = String(page);
}

function updateSoundButton() {
  ui.sound.textContent = ambience.enabled ? 'เสียง · เปิด' : 'เสียง · ปิด';
  ui.sound.setAttribute('aria-pressed', String(ambience.enabled));
}

function addParagraphs(blocks) {
  for (const block of blocks || []) ui.content.append(element('p', block.text, block.kind));
}

function renderChoices(options, selected, onSelect) {
  const group = element('div', undefined, 'choices');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'เลือกคำตอบ');
  for (const option of options) {
    const button = element('button', option, 'choice');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(option === selected));
    button.addEventListener('click', () => {
      for (const sibling of group.children) sibling.setAttribute('aria-pressed', String(sibling === button));
      onSelect(option);
    });
    group.append(button);
  }
  return group;
}

function renderQuestion(question) {
  draft = { ...(state.answers[question.key] || {}) };
  ui.content.append(element('p', question.prompt, 'speech'));
  const details = element('div');
  const updateDetails = () => {
    details.replaceChildren();
    if (question.secondary && question.secondaryFor === draft.choice) {
      const secondary = element('div', undefined, 'secondary-options');
      secondary.append(renderChoices(question.secondary, draft.secondary, value => { draft.secondary = value; }));
      details.append(secondary);
    }
    if (question.alwaysWrite || question.writeFor?.includes(draft.choice)) {
      const label = element('label', question.label, 'field-label');
      label.htmlFor = 'answer';
      const textarea = element('textarea');
      textarea.id = 'answer';
      textarea.maxLength = question.limit || 500;
      textarea.rows = 3;
      textarea.value = draft.text || '';
      textarea.setAttribute('aria-describedby', 'answer-hint');
      textarea.addEventListener('input', () => { draft.text = textarea.value; });
      const hint = element('p', 'ไม่ต้องตอบก็ได้ · คำตอบอยู่เฉพาะในหน้านี้ และจะหายเมื่อรีเฟรช', 'field-hint');
      hint.id = 'answer-hint';
      details.append(label, textarea, hint);
    }
  };
  if (question.options) {
    ui.content.append(renderChoices(question.options, draft.choice, choice => {
      draft.choice = choice;
      draft.text = '';
      draft.secondary = '';
      updateDetails();
    }));
  }
  ui.content.append(details);
  updateDetails();
  const skip = element('button', 'ข้ามได้เลย', 'skip-button');
  skip.type = 'button';
  skip.addEventListener('click', () => advance(true));
  ui.content.append(skip);
}

function renderEnding() {
  const group = element('div', undefined, 'end-actions');
  const save = element('button', 'บันทึกภาพความทรงจำ', 'primary-button');
  save.type = 'button';
  save.addEventListener('click', async () => {
    save.disabled = true;
    try {
      const url = await saveKeepsake(state.answers);
      notify('หากภาพยังไม่บันทึก ให้เปิดภาพแล้วแตะค้างเพื่อบันทึกค่ะ', url);
    } catch { notify('บันทึกภาพไม่สำเร็จ ลองกดอีกครั้งเมื่อภาพโหลดครบค่ะ'); }
    finally { save.disabled = false; }
  });
  const share = element('button', 'แชร์เรื่องนี้', 'quiet-button');
  share.type = 'button';
  share.addEventListener('click', async () => {
    try {
      const result = await shareStory();
      if (result === 'copied') notify('คัดลอกลิงก์แล้ว โดยไม่แนบคำตอบส่วนตัว');
      else if (result !== 'shared') notify('คัดลอกลิงก์จากแถบที่อยู่เพื่อแชร์เรื่องนี้ได้เลย');
    } catch (error) {
      if (error.name !== 'AbortError') notify('แชร์ไม่สำเร็จ คัดลอกลิงก์จากแถบที่อยู่แทนได้ค่ะ');
    }
  });
  const restart = element('button', 'เริ่มใหม่', 'quiet-button');
  restart.type = 'button';
  restart.addEventListener('click', async () => {
    await navigate(1, 0);
    if (state.page === 1) { state.answers = {}; state.history = []; render(); }
  });
  group.append(save, share, restart);
  ui.content.append(group);
}

function render() {
  const list = frames();
  state.beat = Math.min(state.beat, list.length - 1);
  const frame = list[state.beat];
  const cover = frame.kind === 'cover';
  ui.stage.classList.toggle('is-cover', cover);
  ui.stage.classList.toggle('has-question', frame.kind === 'question');
  ui.stage.classList.toggle('is-keepsake', frame.kind === 'keepsake');
  ui.stage.classList.toggle('is-ending', frame.kind === 'ending');
  ui.stage.dataset.mood = moodFor(state.page);
  ambience.setMood(moodFor(state.page));
  ui.cover.hidden = !cover;
  ui.back.hidden = !state.history.length || cover;
  ui.navigation.hidden = cover || frame.kind === 'ending';
  ui.number.textContent = cover ? '' : `${String(state.page).padStart(2, '0')} / 51`;
  ui.position.textContent = list.length > 1 ? `${state.beat + 1} / ${list.length}` : 'ค่อย ๆ อ่าน';
  ui.progress.style.width = `${(state.page - 1) / 50 * 100}%`;
  ui.next.textContent = frame.kind === 'question' ? 'ไปต่อ →' : state.page === 2 && state.beat === list.length - 1 ? 'เริ่มเรื่อง →' : 'อ่านต่อ →';
  ui.content.replaceChildren();
  if (state.beat === 0 && [3, 6, 48].includes(state.page)) {
    const clock = element('time', { 3: '18:32', 6: '23:07', 48: '02:17' }[state.page], 'clock');
    ui.content.append(clock);
  }
  if (frame.kind === 'question') renderQuestion(frame.question);
  else if (frame.kind === 'keepsake') {
    ui.content.append(element('p', 'สิ่งที่เก็บกลับไป', 'eyebrow'));
    addParagraphs(frame.blocks);
  } else {
    addParagraphs(frame.blocks);
    if (frame.kind === 'ending') renderEnding();
  }
  ui.content.scrollTop = 0;
  ui.content.classList.remove('is-entering');
  void ui.content.offsetWidth;
  ui.content.classList.add('is-entering');
  if (!cover) ui.content.focus({ preventScroll: true });
}

async function navigate(page, beat, remember = false) {
  if (state.busy) return false;
  state.busy = true;
  ui.next.disabled = true;
  ui.start.disabled = true;
  const previous = { page: state.page, beat: state.beat };
  let rendering = false;
  try {
    const nextFrames = getFrames(STORY[page - 1], state.answers);
    if (!nextFrames[beat]) throw new Error('Invalid story position');
    const loaded = await prepareScene(page);
    rendering = true;
    state.page = page;
    state.beat = beat;
    if (remember) state.history.push(previous);
    render();
    displayScene(page, loaded);
    ui.notice.hidden = true;
    return true;
  } catch (error) {
    state.page = previous.page;
    state.beat = previous.beat;
    if (remember && state.history.at(-1) === previous) state.history.pop();
    console.error('Story navigation failed:', error);
    notify(rendering
      ? 'เปิดข้อความถัดไปไม่สำเร็จ ลองกดอีกครั้งได้ค่ะ'
      : 'ยังเปิดภาพถัดไปไม่ได้ กรุณาตรวจการเชื่อมต่อแล้วลองอีกครั้ง');
    const retry = element('button', 'ลองเปิดฉากอีกครั้ง', 'retry-image');
    retry.type = 'button';
    retry.addEventListener('click', () => navigate(page, beat, remember));
    ui.notice.append(retry);
    return false;
  } finally {
    state.busy = false;
    ui.next.disabled = false;
    ui.start.disabled = false;
  }
}

function saveAnswer(question, skip) {
  const answer = skip ? {} : {
    choice: question.options?.includes(draft.choice) ? draft.choice : '',
    text: String(draft.text || '').trim().slice(0, question.limit || 500),
    secondary: question.secondary?.includes(draft.secondary) ? draft.secondary : '',
  };
  // Changing an earlier answer invalidates only the later answers it influenced.
  if (JSON.stringify(state.answers[question.key]) !== JSON.stringify(answer)) {
    for (const [page, later] of Object.entries(QUESTIONS)) {
      if (Number(page) > state.page) delete state.answers[later.key];
    }
  }
  state.answers[question.key] = answer;
}

async function advance(skip = false) {
  if (state.busy || state.page === 1 || currentFrame().kind === 'ending') return false;
  const frame = currentFrame();
  if (frame.kind === 'question') saveAnswer(frame.question, skip);
  const list = frames();
  if (state.beat + 1 < list.length) return navigate(state.page, state.beat + 1, true);
  if (state.page < 51) return navigate(state.page + 1, 0, true);
  return false;
}

ui.start.addEventListener('click', async () => {
  if (!soundChosen) {
    try { await ambience.enable(); } catch { ambience.disable(); }
    updateSoundButton();
  }
  await navigate(2, 0, true);
});
ui.next.addEventListener('click', () => advance());
ui.back.addEventListener('click', async () => {
  const previous = state.history.at(-1);
  if (previous && await navigate(previous.page, previous.beat)) {
    state.history.pop();
    ui.back.hidden = !state.history.length || state.page === 1;
  }
});
ui.sound.addEventListener('click', async () => {
  soundChosen = true;
  try {
    if (ambience.enabled) ambience.disable();
    else if (!await ambience.enable()) notify('เบราว์เซอร์นี้ยังเปิดเสียงไม่ได้ แต่เล่นเรื่องต่อได้ค่ะ');
  } catch { notify('แตะปุ่มเสียงอีกครั้งเพื่อเปิดเสียงค่ะ'); }
  updateSoundButton();
});
document.addEventListener('visibilitychange', () => ambience.setVisibility(document.hidden));
document.addEventListener('keydown', (event) => {
  if (event.target.matches('textarea, input, button, a')) return;
  if (event.key === 'ArrowRight' && !ui.navigation.hidden) { event.preventDefault(); advance(); }
  if (event.key === 'ArrowLeft' && !ui.back.hidden) { event.preventDefault(); ui.back.click(); }
});

/** Optional standard WebMCP bridge: same actions and validations as the UI. */
function registerStoryTool() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  const tool = {
    name: 'advance_story',
    title: 'อ่านเรื่องต่อ',
    description: 'Advance one reading beat. For an optional question, submit an exact visible choice and/or text, or skip. Does not start audio or disclose prior personal answers.',
    inputSchema: {
      type: 'object', additionalProperties: false,
      properties: { choice: { type: 'string' }, text: { type: 'string' }, secondary: { type: 'string' }, skip: { type: 'boolean' } },
    },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    async execute(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object');
      if (Object.keys(input).some(key => !['choice', 'text', 'secondary', 'skip'].includes(key))) throw new Error('Unknown field');
      for (const key of ['choice', 'text', 'secondary']) if (input[key] !== undefined && typeof input[key] !== 'string') throw new Error('Expected text');
      if (input.skip !== undefined && typeof input.skip !== 'boolean') throw new Error('Expected boolean');
      if (state.busy) throw new Error('Scene is loading');
      const frame = currentFrame();
      if (frame.kind !== 'question' && Object.keys(input).length) throw new Error('No active question');
      if (frame.kind === 'question') {
        const q = frame.question;
        if (input.choice && !q.options?.includes(input.choice)) throw new Error('Invalid choice');
        if (input.secondary && (input.choice !== q.secondaryFor || !q.secondary?.includes(input.secondary))) throw new Error('Invalid secondary choice');
        if (input.text && (!q.alwaysWrite && !q.writeFor?.includes(input.choice))) throw new Error('Writing is not active');
        if ((input.text?.length || 0) > (q.limit || 500)) throw new Error('Answer is too long');
        draft = { choice: input.choice || '', text: input.text || '', secondary: input.secondary || '' };
      }
      const moved = state.page === 1 ? await navigate(2, 0, true) : await advance(Boolean(input.skip));
      if (!moved) throw new Error('Could not advance');
      return { page: state.page, beat: state.beat + 1, title: STORY[state.page - 1].title };
    },
  };
  try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* Optional API. */ }
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
}

render();
prepareArtwork();
registerStoryTool();
