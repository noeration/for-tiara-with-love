/**
 * Generate all local placeholder media so the site never ships broken images.
 * Run once (assets are committed):
 *   node scripts/generate-assets.mjs
 *
 * Placeholders are original abstract "dreamy orchid" gradients — no random
 * photos, no external downloads. Replace the files in public/images with the
 * real ones (same name, or update data/birthday.ts).
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

/* ---------------------------------- utils --------------------------------- */

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const crcTable = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // truecolor
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* --------------------------------- painter -------------------------------- */

function mix(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/**
 * Dreamy layered gradient with soft petal-like glows, sparkles and grain.
 */
function paint(width, height, seed, variant = 0) {
  const rand = mulberry32(seed);
  const px = Buffer.alloc(width * height * 3);

  const palettes = [
    [[26, 12, 43], [58, 29, 84], [201, 167, 255], [232, 213, 255], [244, 196, 232]],
    [[24, 10, 38], [71, 33, 92], [196, 158, 255], [255, 228, 246], [176, 132, 255]],
    [[30, 14, 48], [92, 48, 116], [212, 180, 255], [238, 224, 255], [255, 205, 233]],
    [[20, 10, 35], [48, 24, 78], [186, 156, 255], [226, 214, 255], [240, 190, 220]],
  ];
  const [top, bottom, glowA, glowB, glowC] = palettes[variant % palettes.length];

  const blobs = Array.from({ length: 7 }, (_, i) => ({
    x: rand(),
    y: 0.1 + rand() * 0.85,
    rx: 0.18 + rand() * 0.4,
    ry: 0.14 + rand() * 0.35,
    color: [glowA, glowB, glowC, glowA, glowB][i % 5],
    strength: 0.18 + rand() * 0.34,
  }));
  const sparkles = Array.from({ length: 90 }, () => ({
    x: rand(),
    y: rand(),
    r: 0.4 + rand() * 1.7,
    a: 0.15 + rand() * 0.7,
  }));
  const vignette = 1.15;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);

      // base vertical gradient with a gentle diagonal drift
      let c = mix(top, bottom, Math.min(1, v * 0.92 + u * 0.12));

      for (const b of blobs) {
        const dx = (u - b.x) / b.rx;
        const dy = (v - b.y) / b.ry;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          const falloff = (1 - d2) * (1 - d2);
          c = mix(c, b.color, falloff * b.strength);
        }
      }

      // soft central light for the "portrait" feel
      const cx = u - 0.5;
      const cy = v - 0.42;
      const halo = Math.max(0, 1 - (cx * cx * 3.2 + cy * cy * 4.2));
      c = mix(c, glowB, halo * 0.16);

      // vignette
      const edx = (u - 0.5) * 2;
      const edy = (v - 0.5) * 2;
      const edge = 1 - Math.min(1, (edx * edx + edy * edy) / 2.6) * 0.55;
      c = [c[0] * edge * vignette * 0.92, c[1] * edge * vignette * 0.92, c[2] * edge * vignette * 0.92];

      // fine grain to avoid banding
      const grain = (rand() - 0.5) * 5;
      c = [c[0] + grain, c[1] + grain, c[2] + grain];

      const o = (y * width + x) * 3;
      px[o] = Math.max(0, Math.min(255, Math.round(c[0])));
      px[o + 1] = Math.max(0, Math.min(255, Math.round(c[1])));
      px[o + 2] = Math.max(0, Math.min(255, Math.round(c[2])));
    }
  }

  // sparkles drawn on top
  for (const s of sparkles) {
    const sx = Math.floor(s.x * (width - 1));
    const sy = Math.floor(s.y * (height - 1));
    const radius = Math.ceil(s.r * 2);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = sx + dx;
        const y = sy + dy;
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, 1 - dist / (s.r * 2)) * s.a;
        if (alpha <= 0) continue;
        const o = (y * width + x) * 3;
        px[o] = Math.min(255, px[o] + 255 * alpha);
        px[o + 1] = Math.min(255, px[o + 1] + 248 * alpha);
        px[o + 2] = Math.min(255, px[o + 2] + 255 * alpha);
      }
    }
  }

  return encodePng(width, height, px);
}

/* ---------------------------------- audio --------------------------------- */

const SAMPLE_RATE = 22050;
const CHORDS = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [261.63, 329.63, 392.0], // C
  [196.0, 246.94, 293.66], // G
];
const BAR = 4; // seconds per chord
const ROUNDS = 2;

function generateMusicBox() {
  const duration = BAR * CHORDS.length * ROUNDS + 2;
  const total = Math.floor(SAMPLE_RATE * duration);
  const data = new Float32Array(total);

  const addTone = (startSec, freq, gain, decay = 2.2) => {
    const start = Math.floor(startSec * SAMPLE_RATE);
    const len = Math.floor(Math.min(2.8, duration - startSec) * SAMPLE_RATE);
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * decay) * (1 - Math.exp(-t * 90));
      const s =
        Math.sin(2 * Math.PI * freq * t) +
        0.35 * Math.sin(2 * Math.PI * freq * 2 * t) +
        0.12 * Math.sin(2 * Math.PI * freq * 3 * t);
      data[start + i] += s * env * gain;
    }
  };

  const order = [0, 2, 1, 3, 2, 1];
  let time = 0;
  for (let round = 0; round < ROUNDS; round++) {
    for (let bar = 0; bar < CHORDS.length; bar++) {
      const chord = CHORDS[bar];
      // gentle pad
      for (const f of chord) {
        const start = Math.floor(time * SAMPLE_RATE);
        const len = Math.floor(BAR * SAMPLE_RATE);
        for (let i = 0; i < len; i++) {
          const t = i / SAMPLE_RATE;
          const env = Math.sin((Math.PI * t) / BAR) ** 2;
          data[start + i] += Math.sin(2 * Math.PI * f * t) * env * 0.035;
        }
      }
      // music-box arpeggio
      const steps = 8;
      for (let s = 0; s < steps; s++) {
        const f = chord[order[s % order.length]];
        addTone(time + (s * BAR) / steps, f, 0.16);
        if (s === 4) addTone(time + (s * BAR) / steps, f * 2, 0.05, 3.2);
      }
      time += BAR;
    }
  }

  // normalize + fade
  let peak = 0;
  for (const v of data) peak = Math.max(peak, Math.abs(v));
  const norm = peak > 0 ? 0.82 / peak : 1;
  const fade = 1.5 * SAMPLE_RATE;
  for (let i = 0; i < total; i++) {
    let v = data[i] * norm;
    if (i < fade) v *= i / fade;
    if (i > total - fade) v *= (total - i) / fade;
    data[i] = v;
  }

  const pcm = Buffer.alloc(total * 2 + 44);
  pcm.write("RIFF", 0);
  pcm.writeUInt32LE(36 + total * 2, 4);
  pcm.write("WAVE", 8);
  pcm.write("fmt ", 12);
  pcm.writeUInt32LE(16, 16);
  pcm.writeUInt16LE(1, 20);
  pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SAMPLE_RATE, 24);
  pcm.writeUInt32LE(SAMPLE_RATE * 2, 28);
  pcm.writeUInt16LE(2, 32);
  pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36);
  pcm.writeUInt32LE(total * 2, 40);
  for (let i = 0; i < total; i++) {
    pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i])) * 32767), 44 + i * 2);
  }
  return pcm;
}

/* ---------------------------------- write --------------------------------- */

const images = [
  ["public/images/tiara/portrait.png", 1000, 1250, 11, 0],
  ["public/images/tiara/song-cover.png", 900, 900, 12, 2],
  ["public/images/memories/memory-01.png", 1000, 1250, 21, 0],
  ["public/images/memories/memory-02.png", 1000, 1000, 22, 3],
  ["public/images/memories/memory-03.png", 1200, 800, 23, 1],
  ["public/images/memories/memory-04.png", 1000, 1250, 24, 2],
  ["public/images/memories/memory-05.png", 1000, 1000, 25, 0],
  ["public/images/memories/memory-06.png", 1000, 1250, 26, 3],
  ["public/images/artworks/artwork-01.png", 1400, 1000, 31, 1],
  ["public/images/artworks/artwork-02.png", 1400, 1000, 32, 2],
  ["public/images/artworks/artwork-03.png", 1400, 1000, 33, 0],
  ["public/images/artworks/artwork-04.png", 1400, 1000, 34, 3],
  ["public/og.png", 1200, 630, 41, 0],
];

for (const [file, width, height, seed, variant] of images) {
  const out = join(ROOT, file);
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, paint(width, height, seed, variant));
  console.log(`image  ${file}  ${width}x${height}`);
}

const audioPath = join(ROOT, "public/audio/our-song.wav");
mkdirSync(join(audioPath, ".."), { recursive: true });
writeFileSync(audioPath, generateMusicBox());
console.log("audio  public/audio/our-song.wav");
