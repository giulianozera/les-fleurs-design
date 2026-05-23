import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { resolve } from 'path';

const client = createClient({
  projectId: 'cpr2go84',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skevymz6J7CxzQFOUs594KBJYQpDxpEOJNeEpAqdTxti90nreyjl3C3zug6eXQBEb48F16eup3OAutXvwpxvBtUzfYa31AYj1j1hdxAoNCEXjHpCfkEVJRTYsiTqW0HRUplSEJmkQylIuxIWXlyoilIKqolTYje5eEY6egIN8Z3kquwDSXr3',
  useCdn: false,
});

const COLLECTION_ID = 'dcdcb992-49db-4aeb-a88d-69a8cb8bda3d'; // The Eternal Edit
const IMG_DIR = '/Users/giuliano/Desktop/claude test 1/les-fleurs-design/public/Eternal Chinoiserie Bloom';

const COLORS = [
  { name: 'champagne', id: '7132785a-1a63-457b-baa3-25924cb73585', slug: 'champagne' },
  { name: 'ivory',     id: 'c4e7a1bd-c6f3-4d6b-bf4c-8043fdd3cbc4', slug: 'ivory' },
  { name: 'peach',     id: '08a38faa-2f1e-4a19-bd0d-aac09105b3f3', slug: 'peach' },
  { name: 'red',       id: null,                                     slug: 'red' },
  { name: 'white',     id: 'jUpmPjJde0gP9YFyfbkg70',               slug: 'white' },
];

async function uploadImage(color) {
  const filename = `${color} Eternal Chinoiserie Bloom.png`;
  const filepath = resolve(IMG_DIR, filename);
  console.log(`Uploading ${filename}...`);
  const asset = await client.assets.upload('image', createReadStream(filepath), {
    filename,
    contentType: 'image/png',
  });
  return asset._id;
}

async function run() {
  // Create red colorOption if missing
  const redDoc = await client.createOrReplace({
    _id: 'colorOption-red',
    _type: 'colorOption',
    name: 'red',
    slug: { _type: 'slug', current: 'red' },
    hexValue: '#B22222',
    available: true,
  });
  console.log('Red colorOption:', redDoc._id);
  COLORS.find(c => c.name === 'red').id = redDoc._id;

  // Upload images
  const imageIds = {};
  for (const color of COLORS) {
    imageIds[color.name] = await uploadImage(color.name);
  }

  // Product IDs
  const productIds = Object.fromEntries(
    COLORS.map(c => [c.name, `chinoiserie-bloom-${c.slug}`])
  );

  // Build colorVariants array for a given product (all OTHER colors)
  function colorVariants(thisColor) {
    return COLORS.filter(c => c.name !== thisColor).map(c => ({
      _type: 'colorVariantRef',
      _key: c.slug,
      color: { _type: 'reference', _ref: c.id },
      product: { _type: 'reference', _ref: productIds[c.name] },
    }));
  }

  // Create all 5 products
  const tx = client.transaction();
  for (const color of COLORS) {
    tx.createOrReplace({
      _id: productIds[color.name],
      _type: 'product',
      title: `Eternal Chinoiserie Bloom — ${color.name.charAt(0).toUpperCase() + color.name.slice(1)}`,
      slug: { _type: 'slug', current: `eternal-chinoiserie-bloom-${color.slug}` },
      basePrice: 300,
      stockQuantity: 10,
      featured: false,
      collection: { _type: 'reference', _ref: COLLECTION_ID },
      roseColors: [{ _type: 'reference', _ref: color.id }],
      images: [{
        _type: 'image',
        _key: 'main',
        asset: { _type: 'reference', _ref: imageIds[color.name] },
        alt: `Eternal Chinoiserie Bloom — ${color.name}`,
      }],
      colorVariants: colorVariants(color.name),
    });
  }
  await tx.commit();
  console.log('All 5 Eternal Chinoiserie Bloom products created.');
}

run().catch(err => { console.error(err.message); process.exit(1); });
