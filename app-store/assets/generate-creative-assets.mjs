/**
 * Genererer App Store "creative assets" for Bueboka (iOS 27+):
 *   - header:   3840 x 1646 px (21:9), safe area 1920 x 824 sentrert
 *   - search:   3840 x 2560 px (3:2),  safe area 2168 x 1030 sentrert
 *   - universal: 5244 x 2950 px (16:9) som betjener begge (croppes til 21:9 og 3:2)
 * Alle PNG uten alpha, per Apple asset best practices.
 *
 * Kjøring (krever @resvg/resvg-js):
 *   npm install --no-save @resvg/resvg-js
 *   node app-store/assets/generate-creative-assets.mjs
 *
 * Kilder: brandfarger fra styles/colors.ts, logo fra assets/images/logo-main-dark.png,
 * bue-ikon fra assets/bow.svg. Tekst lokaliseres (no/en) — korte fraser per Apple 2.3.14.
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'app-store', 'assets');
mkdirSync(OUT, { recursive: true });

const C = { primaryDark: '#00171F', primary: '#053546', secondary: '#227B9A', accent: '#29B6F6', white: '#FFFFFF' };

// Bue-ikon fra assets/bow.svg (hvit variant)
const BOW_PATH =
  'M30.6956 0.0260342C31.3007 -0.128255 32.01 0.412759 32.01 1.03593C31.3187 3.5807 31.2286 6.63643 30.4872 9.12309C30.3048 9.73424 29.7257 10.1951 29.0885 9.87851C28.4073 9.53987 27.4034 8.03706 26.7141 7.54614H26.5157L11.2611 22.8088C10.8844 23.6263 12.6337 26.4897 11.6098 27.4575L7.24759 31.7976C4.56456 32.7614 4.96731 29.315 4.20989 27.758C3.22004 27.3813 2.02981 27.2691 1.05398 26.9124C-0.0661236 26.5017 -0.284533 25.3876 0.406763 24.4578C0.967815 23.7044 3.64684 21.0354 4.40626 20.4543C5.63457 19.5146 7.49205 20.6347 8.87264 20.805L9.16318 20.7148L24.4679 5.30193C24.0371 4.67074 22.3359 3.47049 22.0894 2.87538C21.7368 2.02178 22.404 1.62904 23.1093 1.4467C25.5319 0.819522 28.247 0.643191 30.6956 0.0260342Z';

const logoB64 = readFileSync(join(ROOT, 'assets', 'images', 'logo-main-dark.png')).toString('base64');

const LOCALES = {
  no: { tagline: 'Treningsdagboken for bueskyttere' },
  en: { tagline: 'The training log for archers' },
};

const CANVASES = [
  { name: 'creative-header-3840x1646', w: 3840, h: 1646, safeW: 1920, safeH: 824 },
  { name: 'creative-search-3840x2560', w: 3840, h: 2560, safeW: 2168, safeH: 1030 },
  { name: 'creative-universal-5244x2950', w: 5244, h: 2950, safeW: 2400, safeH: 1000 },
];

function buildSvg({ w, h, safeW, safeH }, locale) {
  const { tagline } = LOCALES[locale];
  const safeX = (w - safeW) / 2;
  const safeY = (h - safeH) / 2;

  const badge = Math.round(safeH * 0.62);
  const brandSize = Math.round(safeH * 0.34);
  const tagSize = Math.round(safeH * 0.15);

  // Horisontal lockup (badge + tekst) sentrert i safe area
  const textX = safeX + safeW / 2 + badge / 2 + Math.round(safeH * 0.12);
  const lockupW = badge + Math.round(safeH * 0.12) + Math.round(safeW * 0.42);
  const startX = safeX + safeW / 2 - lockupW / 2;
  const badgeX = startX;
  const badgeY = safeY + safeH / 2 - badge / 2;
  const brandY = safeY + safeH / 2 - brandSize * 0.18;
  const tagY = safeY + safeH / 2 + brandSize * 0.78;

  // Dekor: blink (konsentriske ringer) til venstre, bue til høyre — utenfor safe area
  const ringsCx = Math.round(w * 0.09);
  const ringsCy = h / 2;
  const ringsR = Math.round(h * 0.42);
  const rings = [1, 0.8, 0.6, 0.4, 0.2]
    .map((f, i) => `<circle cx="${ringsCx}" cy="${ringsCy}" r="${Math.round(ringsR * f)}" fill="${i === 4 ? C.accent : 'none'}" fill-opacity="${i === 4 ? 0.85 : 0}" stroke="${C.white}" stroke-opacity="${0.16 - i * 0.02}" stroke-width="${Math.max(2, h * 0.004)}"/>`)
    .join('');
  const bow = `<g transform="translate(${Math.round(w * 0.86)} ${Math.round(h * 0.5)}) rotate(18) scale(${Math.round(h * 0.055)}) translate(-16 -16)"><path d="${BOW_PATH}" fill="${C.white}" fill-opacity="0.1"/></g>`;
  const arrowLine = `<line x1="${Math.round(w * 0.3)}" y1="${Math.round(h * 0.82)}" x2="${Math.round(w * 0.72)}" y2="${Math.round(h * 0.18)}" stroke="${C.accent}" stroke-opacity="0.35" stroke-width="${Math.max(3, h * 0.006)}" stroke-linecap="round"/>`;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.primaryDark}"/>
      <stop offset="0.55" stop-color="${C.primary}"/>
      <stop offset="1" stop-color="${C.secondary}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${rings}
  ${bow}
  ${arrowLine}
  <rect x="${badgeX}" y="${badgeY}" width="${badge}" height="${badge}" rx="${Math.round(badge * 0.22)}" fill="${C.white}"/>
  <image x="${badgeX + badge * 0.12}" y="${badgeY + badge * 0.12}" width="${Math.round(badge * 0.76)}" height="${Math.round(badge * 0.76)}" href="data:image/png;base64,${logoB64}"/>
  <text x="${textX}" y="${brandY}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="${brandSize}" fill="${C.white}">Bueboka</text>
  <text x="${textX}" y="${tagY}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="400" font-size="${tagSize}" fill="${C.white}" fill-opacity="0.85">${tagline}</text>
</svg>`;
}

for (const canvas of CANVASES) {
  for (const locale of Object.keys(LOCALES)) {
    const svg = buildSvg(canvas, locale);
    const svgPath = join(OUT, `${canvas.name}-${locale}.svg`);
    const pngPath = join(OUT, `${canvas.name}-${locale}.png`);
    writeFileSync(svgPath, svg);
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: canvas.w } });
    const rendered = resvg.render();
    const png = rendered.asPng();
    writeFileSync(pngPath, png);
    console.log(`${canvas.name}-${locale}.png  ${rendered.width}x${rendered.height}  ${(png.length / 1024).toFixed(0)} KB`);
  }
}
