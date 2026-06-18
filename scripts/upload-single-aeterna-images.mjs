// Uploads the five "single aeterna rose" product photos to Sanity as image
// assets and prints a { color: assetId } JSON map on stdout. Document creation
// is done separately (the production dataset is publish-mode), via the MCP
// create/publish flow, using the asset IDs printed here.
//
// Run: node --env-file=.env.local scripts/upload-single-aeterna-images.mjs

import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { resolve } from 'path';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (load with --env-file=.env.local)');
  process.exit(1);
}

const client = createClient({
  projectId: 'cpr2go84',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const IMG_DIR = '/Users/giuliano/Desktop/claude test 1/les-fleurs-design/public/single aeterna rose';

// Exact on-disk filenames (note the stray space in the pink file).
const FILES = {
  champagne: 'single aeterna rose champagne.jpeg',
  'dark red': 'single aeterna rose dark red.jpeg',
  pink: 'single aeterna rose pink .jpeg',
  white: 'single aeterna rose white.jpeg',
  yellow: 'single aeterna rose yellow.jpeg',
};

const out = {};
for (const [color, filename] of Object.entries(FILES)) {
  const asset = await client.assets.upload('image', createReadStream(resolve(IMG_DIR, filename)), {
    filename,
    contentType: 'image/jpeg',
  });
  out[color] = asset._id;
  console.error(`✓ uploaded ${color} -> ${asset._id}`);
}

console.log(JSON.stringify(out, null, 2));
