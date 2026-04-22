#!/usr/bin/env node

/**
 * Generate splash screen with gradient background, "Bueboka" text, and logo
 * Run: node scripts/generate-splash.js
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'images', 'splash.png');
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'images', 'icon.png');

// Splash screen dimensions (standard for Expo)
const WIDTH = 1284;
const HEIGHT = 2778;

async function generateSplash() {
  try {
    console.log('🎨 Generating splash screen...');

    // Create gradient background using SVG
    const gradientSvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4FC3F7;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#29B6F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0288D1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#gradient)" />
      </svg>
    `;

    // Create text SVG overlay
    const textSvg = `
      <svg width="${WIDTH}" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="120" 
          font-weight="bold" 
          fill="#FFFFFF" 
          text-anchor="middle" 
          dominant-baseline="middle"
          filter="url(#shadow)"
          letter-spacing="4">Bueboka</text>
      </svg>
    `;

    // Load and resize logo
    const logo = await sharp(LOGO_PATH)
      .resize(480, 480, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Compose the final splash screen
    const splash = await sharp(Buffer.from(gradientSvg))
      .composite([
        {
          input: Buffer.from(textSvg),
          top: Math.floor(HEIGHT / 2 - 400),
          left: 0,
        },
        {
          input: logo,
          top: Math.floor(HEIGHT / 2 - 140),
          left: Math.floor((WIDTH - 480) / 2),
        },
      ])
      .png()
      .toFile(OUTPUT_PATH);

    console.log('✅ Splash screen generated successfully!');
    console.log(`📁 Saved to: ${OUTPUT_PATH}`);
    console.log(`📐 Size: ${splash.width}x${splash.height}`);
  } catch (error) {
    console.error('❌ Error generating splash screen:', error);
    process.exit(1);
  }
}

generateSplash();
