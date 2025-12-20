/**
 * OG Image Generator Script
 *
 * Generates a 1200x630 Open Graph image for social sharing.
 *
 * Usage: node scripts/generate-og-image.js
 *
 * Requirements: Install sharp first
 *   yarn add -D sharp
 */

const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.log('Installing sharp...');
    const { execSync } = require('child_process');
    execSync('yarn add -D sharp', { stdio: 'inherit' });
    sharp = require('sharp');
  }

  const width = 1200;
  const height = 630;

  // Create SVG with the OG image design
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a"/>
          <stop offset="50%" style="stop-color:#1a1a2e"/>
          <stop offset="100%" style="stop-color:#16213e"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#a855f7"/>
          <stop offset="50%" style="stop-color:#ec4899"/>
          <stop offset="100%" style="stop-color:#3b82f6"/>
        </linearGradient>
        <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#a855f7"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>

      <!-- Top accent bar -->
      <rect width="${width}" height="6" fill="url(#accent)"/>

      <!-- Name -->
      <text
        x="${width / 2}"
        y="260"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="72"
        font-weight="800"
        fill="#ffffff"
        text-anchor="middle"
      >Ahmad Al Mezaal</text>

      <!-- Title -->
      <text
        x="${width / 2}"
        y="340"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="36"
        font-weight="500"
        fill="url(#titleGradient)"
        text-anchor="middle"
      >Senior Software Engineer</text>

      <!-- Tagline -->
      <text
        x="${width / 2}"
        y="420"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="24"
        fill="#9ca3af"
        text-anchor="middle"
      >Fintech • Open Banking • Cloud-Native Systems</text>

      <!-- Domain -->
      <text
        x="${width / 2}"
        y="580"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="24"
        fill="#6b7280"
        text-anchor="middle"
      >theaam.dev</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log(`✓ OG image generated at: ${outputPath}`);
}

generateOGImage().catch(console.error);
