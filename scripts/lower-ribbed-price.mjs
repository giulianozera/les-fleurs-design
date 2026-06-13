// One-off: lower every "Ribbed …" product from basePrice 250 → 200.
// Run from repo root:  npx sanity exec scripts/lower-ribbed-price.mjs --with-user-token
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2024-10-01' });

const docs = await client.fetch(
  `*[_type == "product" && title match "ribbed*" && basePrice == 250]{ _id, title, basePrice }`,
);

if (docs.length === 0) {
  console.log('No ribbed products at basePrice 250 — nothing to do.');
  process.exit(0);
}

let tx = client.transaction();
for (const d of docs) tx = tx.patch(d._id, (p) => p.set({ basePrice: 200 }));
await tx.commit({ visibility: 'sync' });

console.log(`Updated ${docs.length} ribbed product(s) 250 → 200:`);
for (const d of docs) console.log(`  - ${d.title}`);
