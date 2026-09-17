/** Download only the public keepsake, never the player's written answers. */
import { keepsake } from './choices.js';

function wrapLine(context, text, width) {
  const segments = typeof Intl.Segmenter === 'function'
    ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map(s => s.segment)
    : [...text];
  const lines = [];
  let line = '';
  for (const segment of segments) {
    if (line && context.measureText(line + segment).width > width) {
      lines.push(line.trim());
      line = segment;
    } else line += segment;
  }
  if (line) lines.push(line.trim());
  return lines;
}

export async function saveKeepsake(answers) {
  await document.fonts.ready;
  const image = new Image();
  image.src = 'assets/images/50.webp';
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = 841;
  canvas.height = 1870;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas unavailable');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  context.fillStyle = '#344653';
  context.textAlign = 'center';
  context.font = '36px "Noto Serif Thai", Tahoma, sans-serif';
  const lines = keepsake(answers).split('\n').flatMap(line => wrapLine(context, line, 585));
  const start = 900 - (lines.length - 1) * 38;
  lines.forEach((line, index) => context.fillText(line, 420.5, start + index * 76));
  context.font = '24px "Noto Sans Thai", Tahoma, sans-serif';
  context.fillStyle = '#7b6752';
  context.fillText('ก่อนที่เราจะตื่น', 420.5, 1240);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Image export failed');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'before-we-wake-keepsake.png';
  document.body.append(link);
  link.click();
  link.remove();
  // Retain the URL briefly for browsers that finish downloads asynchronously.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  return url;
}

export async function shareStory() {
  const url = new URL(location.href);
  url.hash = '';
  url.search = '';
  const data = { title: 'ก่อนที่เราจะตื่น', text: 'คืนนี้ ลองเดินเข้าไปในความฝันด้วยกัน', url: url.href };
  if (navigator.share) {
    await navigator.share(data);
    return 'shared';
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url.href);
    return 'copied';
  }
  return url.href;
}
