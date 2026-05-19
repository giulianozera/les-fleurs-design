import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio';
import StudioClientWrapper from './StudioClientWrapper';

export const metadata = {
  ...studioMetadata,
  title: 'Les Fleurs Design — Studio',
};

export const viewport = studioViewport;

export default function StudioPage() {
  return <StudioClientWrapper />;
}
