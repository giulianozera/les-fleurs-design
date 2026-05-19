import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  // Fall back to a non-empty placeholder so the module can be imported
  // before .env.local is configured. Queries return empty results until
  // NEXT_PUBLIC_SANITY_PROJECT_ID is set.
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});
