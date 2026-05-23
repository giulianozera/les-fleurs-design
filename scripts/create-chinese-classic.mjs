import { createClient } from '@sanity/client';
import { createReadStream, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: 'cpr2go84',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skevymz6J7CxzQFOUs594KBJYQpDxpEOJNeEpAqdTxti90nreyjl3C3zug6eXQBEb48F16eup3OAutXvwpxvBtUzfYa31AYj1j1hdxAoNCEXjHpCfkEVJRTYsiTqW0HRUplSEJmkQylIuxIWXlyoilIKqolTYje5eEY6egIN8Z3kquwDSXr3',
  useCdn: false,
});

const IMAGE_DIR = path.join(__dirname, '../public/chinese-classic');

// Colors: file prefix → { name, hex, existing color ID or null }
const COLORS = [
  { file: 'champagne', name: 'champagne', hex: '#F1DDCF', existingId: '7132785a-1a63-457b-baa3-25924cb73585' },
  { file: 'dark red',  name: 'dark red',  hex: '#8B1A1A', existingId: '3Supu5vBHRa3qSrr1FNiMw' },
  { file: 'ivory',     name: 'ivory',     hex: '#FFFFF0', existingId: 'c4e7a1bd-c6f3-4d6b-bf4c-8043fdd3cbc4' },
  { file: 'light red', name: 'light red', hex: '#FAA0A0', existingId: '0b769181-785c-42c3-9803-33b780b050bb' },
  { file: 'peach',     name: 'peach',     hex: '#FFE5B4', existingId: '08a38faa-2f1e-4a19-bd0d-aac09105b3f3' },
  { file: 'pink',      name: 'pink',      hex: '#FFB6C1', existingId: null },
  { file: 'purple',    name: 'purple',    hex: '#C8A2C8', existingId: 'a0af9f48-82ad-4eea-8b59-d4a13f05ca81' },
  { file: 'romantic shape', name: 'romantic shape', hex: '#E8A0B0', existingId: '1DZnwxmQoD9Hved5f073Yx' },
  { file: 'white',     name: 'white',     hex: '#FFFFFF', existingId: null },
  { file: 'yellow',    name: 'yellow',    hex: '#FFFF00', existingId: '064bddf9-8b29-4ed5-af11-0dbe5383cf2e' },
];

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function uploadImage(filePath) {
  console.log(`  Uploading: ${path.basename(filePath)}`);
  const stream = createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
    contentType: 'image/png',
  });
  return asset._id;
}

async function main() {
  // 1. Create or reuse colorOption documents
  console.log('\n--- Creating colorOption documents ---');
  const colorMap = {}; // file prefix → { colorId, name, hex, slug }

  for (const color of COLORS) {
    if (color.existingId) {
      colorMap[color.file] = { colorId: color.existingId, name: color.name, hex: color.hex, slug: slugify(color.name) };
      console.log(`  Reusing existing: ${color.name} (${color.existingId})`);
    } else {
      const doc = await client.create({
        _type: 'colorOption',
        name: color.name,
        hexValue: color.hex,
        slug: { _type: 'slug', current: slugify(color.name) },
      });
      colorMap[color.file] = { colorId: doc._id, name: color.name, hex: color.hex, slug: slugify(color.name) };
      console.log(`  Created: ${color.name} → ${doc._id}`);
    }
  }

  // 2. Create Chinese Classic Pot
  console.log('\n--- Creating Chinese Classic Pot ---');
  const pot = await client.create({
    _type: 'potOption',
    name: 'Chinese Classic',
    available: true,
    slug: { _type: 'slug', current: 'chinese-classic' },
  });
  console.log(`  Created pot: ${pot._id}`);

  // 3. Upload images — build imageMap: file prefix → [frontAssetId, topAssetId]
  console.log('\n--- Uploading images ---');
  const imageMap = {};
  for (const color of COLORS) {
    const frontPath = path.join(IMAGE_DIR, `${color.file} front.png`);
    const topPath   = path.join(IMAGE_DIR, `${color.file} top.png`);
    const frontId = await uploadImage(frontPath);
    const topId   = await uploadImage(topPath);
    imageMap[color.file] = [frontId, topId];
    console.log(`  ${color.name}: front=${frontId} top=${topId}`);
  }

  // 4. Pre-assign product IDs so we can wire colorVariants
  const COLLECTION_ID = 'dcdcb992-49db-4aeb-a88d-69a8cb8bda3d'; // The Eternal Edit
  const productIds = {};
  for (const color of COLORS) {
    // Generate a stable doc ID
    productIds[color.file] = `chinese-classic-${slugify(color.file)}`;
  }

  // 5. Create all product documents
  console.log('\n--- Creating product documents ---');

  const colorVariantsAll = COLORS.map((c, i) => ({
    _key: `var${i}`,
    _type: 'object',
    color: { _type: 'reference', _ref: colorMap[c.file].colorId },
    product: { _type: 'reference', _ref: productIds[c.file] },
  }));

  const transaction = client.transaction();

  for (const color of COLORS) {
    const [frontId, topId] = imageMap[color.file];
    const colorName = color.name;
    const productId = productIds[color.file];
    const slug = `chinese-classic-${slugify(color.file)}`;
    const title = `Chinese Classic Roses — ${colorName.charAt(0).toUpperCase() + colorName.slice(1)}`;

    const doc = {
      _id: productId,
      _type: 'product',
      title,
      slug: { _type: 'slug', current: slug },
      basePrice: 300,
      stockQuantity: 10,
      collection: { _type: 'reference', _ref: COLLECTION_ID },
      images: [
        { _key: 'img0', _type: 'image', asset: { _type: 'reference', _ref: frontId } },
        { _key: 'img1', _type: 'image', asset: { _type: 'reference', _ref: topId } },
      ],
      roseColors: [{ _type: 'reference', _ref: colorMap[color.file].colorId }],
      potOptions: [{ _type: 'reference', _ref: pot._id }],
      colorVariants: colorVariantsAll,
    };

    transaction.createOrReplace(doc);
    console.log(`  Queued: ${title}`);
  }

  console.log('\n--- Committing transaction ---');
  await transaction.commit();
  console.log('  Done!');

  // 6. Publish all products
  console.log('\n--- Publishing products ---');
  for (const color of COLORS) {
    const draftId = `drafts.${productIds[color.file]}`;
    const pubId = productIds[color.file];
    try {
      // createOrReplace already wrote to the published ID directly, so just confirm
      console.log(`  Published: ${pubId}`);
    } catch (e) {
      console.error(`  Error publishing ${pubId}:`, e.message);
    }
  }

  console.log('\n All done! Created 10 Chinese Classic Roses products.');
  console.log('\nProduct slugs:');
  for (const color of COLORS) {
    console.log(`  /shop/chinese-classic-${slugify(color.file)}`);
  }
}

main().catch(console.error);
