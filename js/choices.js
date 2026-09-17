/**
 * Interactive pages and conditional dialogue.
 * Edit wording here; page numbers always match the image filenames.
 * All answers remain in memory and are never sent to a server.
 */
export const QUESTIONS = {
  14: {
    key: 'person', prompt: 'ถ้าคืนนี้ได้พบใครสักคน\nอยากเจอใคร?',
    options: ['ครอบครัว', 'เพื่อน', 'คนรัก', 'คนที่จากไปแล้ว', 'ใครบางคน', 'ยังไม่แน่ใจ'],
    writeFor: ['ใครบางคน'], label: 'เขาเป็นใครสำหรับคุณ?', limit: 80,
    secondaryFor: 'ยังไม่แน่ใจ',
    secondary: ['มีคนหนึ่งผุดขึ้นมาในใจ แต่ยังไม่อยากบอก', 'ยังไม่มีใคร', 'ข้ามคำถามนี้'],
  },
  20: { key: 'missing', prompt: '“พี่คิดถึงเขามากเลยเหรอ?”', options: ['มาก', 'คิดถึงบ้าง', 'ไม่รู้เหมือนกัน', 'อธิบายไม่ถูก'] },
  21: { key: 'contact', prompt: '“ตอนนี้พี่ยังได้เจอเขาอยู่ไหม?”', options: ['ยังได้เจอกัน', 'อยู่ห่างกัน', 'ไม่ได้ติดต่อกันแล้ว', 'จากไปแล้ว', 'ไม่อยากตอบ'] },
  22: { key: 'tell', prompt: '“พี่อยากเล่าเรื่องเขาให้หนูฟังไหม?”', options: ['อยากเล่า', 'มีเรื่องอยากเล่า แต่ไม่รู้จะเริ่มยังไง', 'ไม่อยากเล่า'] },
  23: {
    key: 'memory', prompt: 'เล่าเรื่องหนึ่งเกี่ยวกับเขา\nที่คุณยังจำได้',
    options: ['เรื่องที่ทำให้ยิ้ม', 'เรื่องที่ยังเจ็บอยู่', 'คำพูดที่ยังจำได้', 'เรื่องธรรมดาที่ไม่น่าลืม', 'ไม่รู้จะเล่าอะไร'],
    alwaysWrite: true, label: 'เขียนเท่าที่อยากเล่า', limit: 800,
  },
  24: { key: 'phrase', prompt: '“มีคำไหนที่เขาชอบพูด\nแล้วพี่ยังจำได้อยู่ไหม?”', alwaysWrite: true, label: 'คำหรือประโยคที่คุณยังจำได้', limit: 200 },
  26: {
    key: 'dream', prompt: '“แล้วตอนตัวเท่าหนู\nพี่อยากโตไปเป็นอะไรหรอ?”',
    options: ['สิ่งที่เคยฝันไว้', 'อยากมีงานที่ชอบ', 'อยากมีครอบครัว', 'ไม่เคยคิดไว้', 'จำไม่ได้', 'พิมพ์เอง'],
    writeFor: ['สิ่งที่เคยฝันไว้', 'พิมพ์เอง'], label: 'ตอนเด็ก ๆ คุณเคยอยากโตไปเป็นอะไร?', limit: 300,
  },
  27: { key: 'dreamNow', prompt: 'ถ้าอยากตอบ ค่อย ๆ เขียนก็ได้', alwaysWrite: true, label: 'ตอนนี้ยังอยากเป็นอยู่ไหม?', limit: 300 },
  28: {
    key: 'grown', prompt: '“โตแล้วเป็นยังไงบ้าง?”',
    options: ['เหนื่อย', 'ก็โอเค', 'ไม่รู้เหมือนกัน', 'ดีกว่าที่คิด', 'ไม่เหมือนที่เคยคิดไว้', 'พิมพ์เอง'],
    writeFor: ['พิมพ์เอง'], label: 'สำหรับคุณ การโตขึ้นเป็นอย่างไร?', limit: 300,
  },
  31: {
    key: 'unsaid', prompt: '“พี่มีอะไรอยากพูด\nแต่ยังไม่ได้พูดกับใครไหม?”',
    options: ['เหนื่อย', 'คิดถึง', 'ขอโทษ', 'ขอบคุณ', 'ยังไม่พร้อม', 'ไม่เป็นไรแล้ว', 'เขียนเอง'],
    writeFor: ['เขียนเอง'], label: 'สิ่งที่ยังไม่ได้พูด', limit: 500,
  },
  37: {
    key: 'message', prompt: 'ถ้าตอนนี้เขายืนอยู่ตรงหน้า\nคุณอยากบอกอะไรกับเขา?',
    options: ['คิดถึงนะ', 'ขอบคุณนะ', 'ขอโทษนะ', 'อยากอยู่ด้วยกันอีกหน่อย', 'แค่อยากเจอ', 'ไม่อยากพูดอะไร', 'เขียนเอง'],
    writeFor: ['เขียนเอง'], label: 'คำที่อยากบอก', limit: 600,
  },
  40: {
    key: 'action', prompt: 'ตรงนี้ ไม่ต้องรีบก็ได้',
    options: ['เดินเข้าไปหา', 'ยืนมอง', 'นั่งอยู่ข้าง ๆ', 'กอด', 'พูดสิ่งที่เขียนไว้', 'อยู่เงียบ ๆ'],
  },
};

export const CARDS = {
  tired: 'ยังไม่ต้องจัดการทุกอย่างให้ได้ในคืนนี้\nพักก่อน แล้วค่อยว่ากันใหม่',
  missing: 'คิดถึงใครสักคนได้\nโดยไม่จำเป็นต้องรีบหาคำตอบว่า\nความคิดถึงนั้นต้องพาเราไปไหน',
  sorry: 'บางคำอาจพูดช้าไป\nแต่ไม่ได้แปลว่าความรู้สึกนั้น\nไม่มีความหมาย',
  thanks: 'บางคนอาจไม่ได้อยู่ตรงนี้แล้ว\nแต่สิ่งที่เขาเคยให้เรา\nยังอยู่ในเราได้เสมอ',
  unready: 'ไม่เป็นไรถ้ายังไม่มีคำตอบ\nบางเรื่องไม่จำเป็นต้องตอบในคืนนี้',
  default: 'คืนนี้ ยังไม่ต้องมีคำตอบก็ได้\nให้ตัวเองได้พักสักหน่อย',
};

export function answerValue(answers, key) {
  const answer = answers[key];
  return answer?.text?.trim() || answer?.choice || '';
}

export function keepsake(answers) {
  const unsaid = answers.unsaid?.choice;
  const message = answers.message?.choice;
  if (unsaid === 'ยังไม่พร้อม' || message === 'ไม่อยากพูดอะไร') return CARDS.unready;
  if (unsaid === 'ขอโทษ' || message === 'ขอโทษนะ') return CARDS.sorry;
  if (unsaid === 'ขอบคุณ' || message === 'ขอบคุณนะ') return CARDS.thanks;
  if (unsaid === 'คิดถึง' || message === 'คิดถึงนะ') return CARDS.missing;
  if (unsaid === 'เหนื่อย' || answers.grown?.choice === 'เหนื่อย') return CARDS.tired;
  return CARDS.default;
}

const n = (text) => ({ kind: 'narration', text });
const s = (text) => ({ kind: 'speech', text });
const question = (page) => ({ kind: 'question', question: QUESTIONS[page] });
const silent = (answers) => !answers.tell?.choice || answers.tell.choice === 'ไม่อยากเล่า';

/** Combine short paragraphs into readable beats without changing their wording. */
export function paginate(blocks, limit = 190) {
  const frames = [];
  let current = [];
  let length = 0;
  for (const block of blocks) {
    if (length && (length + block.text.length > limit || current.length >= 4)) {
      frames.push({ kind: 'text', blocks: current });
      current = [];
      length = 0;
    }
    current.push(block);
    length += block.text.length;
  }
  if (current.length) frames.push({ kind: 'text', blocks: current });
  return frames;
}

/** Response beats appear after choices, never alongside the question. */
function response(page, answers) {
  const choice = answers[QUESTIONS[page]?.key]?.choice;
  switch (page) {
    case 20:
      return [n('เด็กพยักหน้าเบา ๆ\nไม่ได้ถามต่อทันที\nเหมือนแค่รับคำตอบนั้นไว้'), n('จากนั้นจึงถามขึ้นมาอีกครั้ง'), s('“ตอนนี้พี่ยังได้เจอเขาอยู่ไหม?”')];
    case 21:
      return {
        'ยังได้เจอกัน': [n('เด็กยิ้มเล็กน้อย'), s('“งั้นก็ดีสิ”')],
        'อยู่ห่างกัน': [n('เด็กมองไปทางปลายทาง'), s('“บางทีอยู่ไกลก็ไม่ได้แปลว่าลืมกันเนอะ”')],
        'ไม่ได้ติดต่อกันแล้ว': [n('เด็กมองเราอยู่ครู่หนึ่ง'), s('“แล้วพี่ยังคิดถึงเขาอยู่ไหม?”')],
        'จากไปแล้ว': [n('เด็กเงียบลงเล็กน้อย'), s('“ถ้าได้เจอกันอีกครั้ง…\nพี่อยากพูดอะไรกับเขาไหม?”')],
      }[choice] || [n('เด็กพยักหน้าเบา ๆ'), s('“ไม่เป็นไร ยังไม่ต้องตอบก็ได้”')];
    case 22:
      return choice === 'ไม่อยากเล่า' || !choice
        ? [n('เด็กพยักหน้า'), s('“ไม่เป็นไร”'), n('แล้วขยับตัวให้นั่งสบายขึ้น'), s('“งั้นนั่งเฉย ๆ ก็ได้”')]
        : [n('เด็กหันมาฟัง\nโดยไม่ได้เร่งให้เราเริ่มเล่า')];
    case 23:
      if (!answerValue(answers, 'memory')) return [n('เด็กนั่งอยู่ข้าง ๆ\nโดยไม่ขอให้เราอธิบายอะไรเพิ่ม')];
      return choice === 'เรื่องธรรมดาที่ไม่น่าลืม'
        ? [s('“เรื่องธรรมดาแบบนี้แหละ\nที่หนูว่าจำยากที่สุด”')]
        : [n('เด็กตั้งใจฟัง\nก่อนจะพยักหน้าเบา ๆ')];
    case 28:
      return choice === 'เหนื่อย'
        ? [n('เด็กมองเราอยู่ครู่หนึ่ง'), s('“งั้นพักก่อนก็ได้นะ”'), n('เขาขยับตัวลงนั่ง\nไม่ได้ถามว่าเหนื่อยจากอะไร')]
        : [n('เด็กฟังจนจบ\nก่อนขยับตัวลงนั่งข้าง ๆ')];
    case 31:
      return [s({
        'เหนื่อย': '“งั้นพักตรงนี้อีกหน่อยก็ได้”',
        'คิดถึง': '“คิดถึงมากจนอยากเจอเลยเหรอ?”',
        'ขอโทษ': '“บางเรื่องก็คงพูดยากจริง ๆ”',
        'ขอบคุณ': '“ถ้ามีโอกาส ก็น่าจะบอกเขานะ”',
        'ยังไม่พร้อม': '“งั้นยังไม่ต้องพูดก็ได้”',
      }[choice] || '“อื้อ หนูฟังอยู่”')];
    case 40:
      return {
        'เดินเข้าไปหา': [n('เราค่อย ๆ เดินเข้าไปใกล้\nโดยยังไม่ต้องพูดอะไร')],
        'ยืนมอง': [n('เราเลือกยืนอยู่ตรงนี้\nในระยะที่รู้สึกสบายใจ')],
        'นั่งอยู่ข้าง ๆ': [n('เรานั่งลงข้าง ๆ\nปล่อยให้ความเงียบอยู่ระหว่างเรา')],
        'กอด': [n('เราขยับเข้าไปใกล้\nแล้วกอดเขาไว้ในความฝัน')],
        'พูดสิ่งที่เขียนไว้': [n('เราค่อย ๆ รวบรวมคำที่อยากบอก')],
      }[choice] || [n('เราอยู่เงียบ ๆ ตรงนี้\nไม่จำเป็นต้องเข้าใกล้กว่านี้ก็ได้')];
    default: return [];
  }
}

export function getFrames(page, answers) {
  const id = page.id;
  let blocks = page.blocks;
  if (id === 1) return [{ kind: 'cover' }];
  if (id === 14) return [question(id)];
  if (id === 15 && (!answerValue(answers, 'person') || answers.person.secondary === 'ยังไม่มีใคร')) {
    return paginate([n('เราค่อย ๆ เดินต่อ\nโดยยังไม่ต้องนึกถึงใครให้ได้ในคืนนี้'), n('บางที…\nแค่เดินไปเรื่อย ๆ ก็พอ')]);
  }
  if (id === 19) {
    const who = answerValue(answers, 'person');
    const person = who && who !== 'ยังไม่แน่ใจ' ? who : 'ใครบางคนที่ยังไม่ต้องมีชื่อ';
    return paginate([s('“ถ้ามีใครมานั่งตรงนี้ด้วยได้อีกคน”'), s('“พี่อยากให้เป็นใคร?”'), n(person), n('ความคิดในหัวกลับเด้งขึ้นมาเป็นคำตอบนั้น'), ...page.blocks.filter(b => b.kind === 'narration')]);
  }
  if ((id === 23 || id === 24) && silent(answers)) {
    return paginate([n(id === 23 ? 'เรานั่งอยู่ตรงนั้นด้วยกัน\nโดยไม่จำเป็นต้องเล่าเรื่องอะไร' : 'ลมพัดผ่านไปเบา ๆ\nเด็กไม่ได้ถามอะไรต่อ')]);
  }
  if (id === 25 && silent(answers)) blocks = [n('เด็กเงียบไปพักหนึ่ง\nแล้วอยู่ ๆ ก็ถามขึ้นมา\nเหมือนเพิ่งนึกอะไรได้'), s('“แล้วพี่ล่ะ?”')];
  if (id === 33) blocks = [n('เด็กหันมามอง\nเหมือนกำลังเลือกว่าจะตอบยังไง'), ...blocks];
  if (id === 39 && answers.phrase?.text) {
    blocks = [...blocks, { kind: 'personal-quote', text: answers.phrase.text }, n('คำที่เราจำได้\nค่อย ๆ กลับมาในความทรงจำ')];
  }
  if (id === 40) return [...paginate([n('เราได้เห็นเขาอีกครั้ง\nคำพูดทั้งหมดที่เตรียมไว้กลับหายไป'), n('ไม่ต้องรีบตัดสินใจว่าจะทำอะไร')]), question(id), ...paginate(response(id, answers))];
  if (id === 41) {
    const message = answerValue(answers, 'message');
    const speaking = answers.action?.choice === 'พูดสิ่งที่เขียนไว้' && message && message !== 'ไม่อยากพูดอะไร';
    return speaking
      ? [...paginate([{ kind: 'personal-quote', text: message }]), ...paginate(page.blocks)]
      : paginate([n('เราไม่ได้พูดอะไร\nเพียงอยู่กับช่วงเวลานี้อีกสักพัก')]);
  }
  if (id === 50) return [{ kind: 'keepsake', blocks: [n(keepsake(answers))] }];
  if (id === 51) return [...paginate(blocks), { kind: 'ending', blocks: [n('ขอบคุณที่อยู่กับเรื่องนี้จนถึงตรงนี้'), n('คืนนี้พักได้')] }];
  if (QUESTIONS[id]) {
    const before = id === 27 ? paginate(blocks) : [];
    return [...before, question(id), ...paginate(response(id, answers))];
  }
  return paginate(blocks);
}

export function moodFor(page) {
  if (page <= 6 || page >= 48) return 'rain';
  if (page <= 10) return 'night';
  if (page >= 38 && page <= 42) return 'meeting';
  if (page >= 43) return 'farewell';
  return 'dream';
}
