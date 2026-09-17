import { ARTWORK } from './artwork-manifest.js';

/** Load off-screen first. A rejected decode() must not reject a valid loaded image. */
export function loadImage(src, { signal, timeout = 6000, ImageClass = Image } = {}) {
  return new Promise((resolve, reject) => {
    const image = new ImageClass();
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener('abort', abort);
      if (error) reject(error);
      else resolve(image);
    };
    const abort = () => finish(new DOMException('Image request cancelled', 'AbortError'));
    const timer = setTimeout(() => finish(new Error('Image request timed out')), timeout);
    image.onload = () => image.naturalWidth > 0 ? finish() : finish(new Error('Empty image'));
    image.onerror = () => finish(new Error('Image unavailable'));
    if (signal?.aborted) { abort(); return; }
    signal?.addEventListener('abort', abort, { once: true });
    image.src = src;
    if (image.complete && image.naturalWidth > 0) finish();
  });
}

// Seven fingerprinted bundles avoid repeated per-image delivery failures.
// Shared downloads are cached; failed downloads are removed so retry is real.
const bundles = new Map();
async function fetchBundle(path) {
  if (bundles.has(path)) return bundles.get(path);
  const request = (async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(path, {
          signal: controller.signal,
          cache: attempt ? 'reload' : 'default',
          credentials: 'same-origin',
        });
        if (!response.ok) throw new Error('Artwork bundle unavailable');
        const data = await response.json();
        for (const [id, expected] of Object.entries(ARTWORK)) {
          if (expected === path && !data[id]?.startsWith('data:image/webp;base64,')) {
            throw new Error('Incomplete artwork bundle');
          }
        }
        return data;
      } catch (error) {
        if (attempt) throw error;
      } finally { clearTimeout(timer); }
    }
  })();
  bundles.set(path, request);
  try { return await request; }
  catch (error) { bundles.delete(path); throw error; }
}

export async function loadSceneImage(src, options = {}) {
  const page = Number(src.match(/(\d{2})\.(?:webp|jpg)(?:\?|$)/)?.[1]);
  try {
    const readBundle = options.readBundle || fetchBundle;
    const data = await readBundle(ARTWORK[page]);
    if (options.signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
    if (!data?.[page]) throw new Error('Scene missing from bundle');
    return await loadImage(data[page], options);
  } catch (error) {
    if (error.name === 'AbortError' && options.signal?.aborted) throw error;
    return loadImage(src.replace(/\.webp$/, '.jpg'), { ...options, timeout: 12000 });
  }
}

/** Two low-priority downloads at a time, without decoding all 51 images at once. */
export function prepareArtwork() {
  const paths = [...new Set(Object.values(ARTWORK))];
  let next = 0;
  async function worker() {
    while (next < paths.length) {
      const path = paths[next++];
      try { await fetchBundle(path); } catch { /* Navigation can retry this bundle. */ }
    }
  }
  void worker();
  void worker();
}
