import fs from 'fs';
import { execSync } from 'child_process';

// Convert the jpg to raw RGBA using ImageMagick
execSync('convert public/assets/aistudio/Gemini_Generated_Image_cq5l9vcq5l9vcq5l_0c7f50bf.jpg -depth 8 logo_raw.rgba');

// Get dimensions
const dim = execSync('identify -format "%w %h" public/assets/aistudio/Gemini_Generated_Image_cq5l9vcq5l9vcq5l_0c7f50bf.jpg').toString().trim().split(' ');
const width = parseInt(dim[0], 10);
const height = parseInt(dim[1], 10);

console.log(`Dimensions: ${width}x${height}`);
const buffer = fs.readFileSync('logo_raw.rgba');

const isCheckerboard = (r, g, b) => {
  const diff = Math.max(r, g, b) - Math.min(r, g, b);
  const minVal = Math.min(r, g, b);
  return diff <= 8 && minVal >= 195;
};

// Queue-based BFS flood fill from the borders
const visited = new Uint8Array(width * height);
const queue = [];

// Seed the 4 borders
for (let x = 0; x < width; x++) {
  queue.push(x, 0);
  visited[0 * width + x] = 1;
  queue.push(x, height - 1);
  visited[(height - 1) * width + x] = 1;
}
for (let y = 0; y < height; y++) {
  if (!visited[y * width + 0]) {
    queue.push(0, y);
    visited[y * width + 0] = 1;
  }
  if (!visited[y * width + (width - 1)]) {
    queue.push(width - 1, y);
    visited[y * width + (width - 1)] = 1;
  }
}

let head = 0;
while (head < queue.length) {
  const cx = queue[head++];
  const cy = queue[head++];
  const idx = (cy * width + cx) * 4;
  const r = buffer[idx];
  const g = buffer[idx + 1];
  const b = buffer[idx + 2];

  if (isCheckerboard(r, g, b)) {
    buffer[idx + 3] = 0;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIndex = ny * width + nx;
        if (!visited[nIndex]) {
          visited[nIndex] = 1;
          const nr = buffer[nIndex * 4];
          const ng = buffer[nIndex * 4 + 1];
          const nb = buffer[nIndex * 4 + 2];
          if (isCheckerboard(nr, ng, nb)) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }
}

// Clear any enclosed checkerboard pixels in graphic area (y < 890)
for (let y = 0; y < Math.min(height, 890); y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = buffer[idx];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];
    if (isCheckerboard(r, g, b)) {
      buffer[idx + 3] = 0;
    }
  }
}

// Clear grey checkerboard squares around text baseline (y >= 890)
for (let y = 890; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = buffer[idx];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) <= 6 && r >= 208 && r <= 235) {
      buffer[idx + 3] = 0;
    }
  }
}

// Find non-transparent bounding box
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = buffer[(y * width + x) * 4 + 3];
    if (a > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Bounding box: x: [${minX}, ${maxX}], y: [${minY}, ${maxY}], width: ${maxX - minX + 1}, height: ${maxY - minY + 1}`);

fs.writeFileSync('logo_clean.rgba', buffer);

// Convert back to PNG and crop cleanly
execSync(`convert -size ${width}x${height} -depth 8 logo_clean.rgba -crop ${maxX - minX + 40}x${maxY - minY + 40}+${Math.max(0, minX - 20)}+${Math.max(0, minY - 20)} +repage public/assets/aistudio/logo.png`);

// Also create an icon version
execSync('convert public/assets/aistudio/logo.png -resize 128x128 public/assets/aistudio/logo-icon.png');
execSync('convert public/assets/aistudio/logo.png -resize 64x64 public/favicon.png');

// Clean up temporary files
fs.unlinkSync('logo_raw.rgba');
fs.unlinkSync('logo_clean.rgba');

console.log('Logo created successfully at public/assets/aistudio/logo.png');
