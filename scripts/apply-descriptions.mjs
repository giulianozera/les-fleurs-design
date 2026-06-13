// Applies product descriptions to Sanity via the draft->publish Actions API
// (the `production` dataset is publish-mode, so direct mutate is rejected).
// Run: SANITY_WRITE_TOKEN=<admin-token> node scripts/apply-descriptions.mjs

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1); }

const ENDPOINT = 'https://cpr2go84.api.sanity.io/v2025-02-19/data/actions/production';

const VARY = 'Because each arrangement is made by hand, the exact number of roses may vary slightly.';
const TAIL = 'No water, no upkeep — designed to last up to one year with proper care.';
const ribbed = (c) => `Approximately 30 preserved ${c} roses, hand-composed in a ribbed ceramic vessel. ${VARY} ${TAIL}`;
const porcelain = (c) => `Approximately 20 preserved ${c} roses, hand-composed in a porcelain vessel. ${VARY} ${TAIL}`;
const bloom = (c) => `Approximately 43 preserved ${c} roses, hand-arranged in a chinoiserie ceramic vessel. ${VARY} ${TAIL}`;
const classic = (c) => `Approximately 35 preserved ${c} roses, hand-arranged in a hand-finished ceramic vessel. ${VARY} ${TAIL}`;
const miniTail = ' Approximately 15 roses; as each piece is made by hand, the exact number may vary slightly.';

const docs = [
  // ── Maison · Ribbed (~30) ──
  ['3Supu5vBHRa3qSrr1FNjS2', ribbed('champagne')],
  ['3Supu5vBHRa3qSrr1FNjXC', ribbed('dark red')],
  ['1DZnwxmQoD9Hved5f0743R', ribbed('light red')],
  ['HzWgUDU6zeELLZ0Necwx9N', ribbed('peach')],
  ['1DZnwxmQoD9Hved5f0746G', ribbed('pink')],
  ['HzWgUDU6zeELLZ0NecwxEr', ribbed('purple')],
  ['HzWgUDU6zeELLZ0NecwxKL', `Approximately 30 preserved red roses in a romantic open shape, hand-composed in a ribbed ceramic vessel. ${VARY} ${TAIL}`],
  ['1DZnwxmQoD9Hved5f074AD', ribbed('white')],
  ['HzWgUDU6zeELLZ0NecwxS1', ribbed('yellow')],
  // ── Maison · Porcelain (~20) ──
  ['9393ae6d-f893-4e05-8ae3-a6b1273ce090', porcelain('red')],
  ['50e2f563-dbac-4d78-84b6-4fce9d4e421c', porcelain('purple')],
  ['afbbd57b-0bb1-4322-92a5-c2e501141379', porcelain('white')],
  // ── Rosa Aeterna · Bloom (~43) ──
  ['chinoiserie-bloom-champagne', bloom('champagne')],
  ['chinoiserie-bloom-ivory', bloom('ivory')],
  ['chinoiserie-bloom-peach', bloom('peach')],
  ['chinoiserie-bloom-red', bloom('red')],
  ['chinoiserie-bloom-white', bloom('white')],
  // ── Rosa Aeterna · Classic (~35) ──
  ['chinese-classic-champagne', classic('champagne')],
  ['chinese-classic-dark-red', classic('dark red')],
  ['chinese-classic-ivory', classic('ivory')],
  ['chinese-classic-light-red', classic('light red')],
  ['chinese-classic-peach', classic('peach')],
  ['chinese-classic-pink', classic('pink')],
  ['chinese-classic-purple', classic('purple')],
  ['chinese-classic-romantic-shape', `Approximately 35 preserved roses in a romantic open shape, hand-arranged in a hand-finished ceramic vessel. ${VARY} ${TAIL}`],
  ['chinese-classic-white', classic('white')],
  ['chinese-classic-yellow', classic('yellow')],
  // ── Rosa Aeterna · Mini Blossom (~15) — append to existing copy ──
  ['34be76a0-b81f-4235-9a10-27af0092ff29', 'A miniature arrangement of preserved champagne roses, set in a hand-formed ceramic vessel. Warm, luminous, enduring. No water. No care. One year of quiet, unwavering bloom.' + miniTail],
  ['96f61094-95e1-4904-87a7-d0a1c871f92f', 'A miniature arrangement of preserved deep red roses, set in a hand-formed ceramic vessel. Rich in presence, restrained in form. No water. No care. One year of quiet, unwavering bloom.' + miniTail],
  ['d7c65172-05a1-4399-87d3-eed041c10ee2', 'A miniature arrangement of preserved peach roses, set in a hand-formed ceramic vessel. Delicate in tone, considered in craft. No water. No care. One year of quiet, unwavering bloom.' + miniTail],
  ['30aa5c62-2bbe-4891-9ba6-00293cb04221', 'A miniature arrangement of preserved violet roses, set in a hand-formed ceramic vessel. Rare in color, precise in form. No water. No care. One year of quiet, unwavering bloom.' + miniTail],
  ['77a75a84-ec65-4eae-aec3-fe7467ee1d26', 'A miniature arrangement of preserved white roses, set in a hand-formed blue-and-white porcelain vessel. Pure in tone, precise in craft. No water. No care. One year of quiet, unwavering bloom.' + miniTail],
];

async function apply(id, description) {
  const body = {
    actions: [
      { actionType: 'sanity.action.document.edit', draftId: 'drafts.' + id, publishedId: id, patch: { set: { description } } },
      { actionType: 'sanity.action.document.publish', draftId: 'drafts.' + id, publishedId: id },
    ],
  };
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return r;
}

let ok = 0, fail = 0;
for (const [id, description] of docs) {
  try {
    await apply(id, description);
    ok++;
    console.log(`✓ ${id}`);
  } catch (e) {
    fail++;
    console.error(`✗ ${id} — ${e.message}`);
  }
}
console.log(`\nDONE: ${ok} updated, ${fail} failed, of ${docs.length}.`);
