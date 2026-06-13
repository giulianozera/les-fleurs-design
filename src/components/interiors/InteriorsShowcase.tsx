'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PrototypeCarousel, type PrototypeSlide } from './PrototypeCarousel';

type TrackId = 'commercial' | 'residential';

interface Track {
  id: TrackId;
  label: string;
  eyebrow: string;
  line: string;
  inquireHref: string;
  slides: PrototypeSlide[];
}

// Concept visualizations, not photographs of completed client installations.
// The /public/business images are design renders showing how a preserved-rose
// piece could sit in a given type of space — they are not real, named venues.
// TODO: replace concept renders containing fabricated third-party brand signage
// (AURUM HOLDINGS / THE EMPEROR) baked into the image files with original imagery.
const COMMERCIAL_SLIDES: PrototypeSlide[] = [
  { src: '/business/hotel lobby.jpg', caption: 'Concept — Hotel Lobby', alt: 'Design concept: preserved-rose arrangement in a hotel lobby setting', ratio: '16/9' },
  { src: '/business/private member club .png', caption: "Concept — Private Members' Club", alt: "Design concept: arrangement in a private members' club setting", ratio: '3/4' },
  { src: '/business/restourant table.jpg', caption: 'Concept — Restaurant', alt: 'Design concept: arrangement on a restaurant table', ratio: '4/3' },
  { src: '/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg', caption: 'Concept — Suite Amenity', alt: 'Design concept: suite amenity in a blue porcelain vessel', ratio: '3/4' },
  { src: '/business/event inistallation.JPG', caption: 'Concept — Event Installation', alt: 'Design concept: event floral installation', ratio: '4/3' },
  { src: '/business/corporate .png', caption: 'Concept — Corporate Reception', alt: 'Design concept: arrangement in a corporate reception setting', ratio: '16/9' },
];

// Residential concept placeholders — no images yet, so these render as labelled
// tiles. Captions describe space *types*, not real, named client projects.
// TODO: replace with <PrototypeSlide src="…"> once original concept renders or
// real, owner-approved project photography is available.
const RESIDENTIAL_SLIDES: PrototypeSlide[] = [
  { caption: 'Concept — Living Room', ratio: '16/9' },
  { caption: 'Concept — Entryway', ratio: '3/4' },
  { caption: 'Concept — Bedroom Detail', ratio: '4/3' },
  { caption: 'Concept — Library Corner', ratio: '3/4' },
  { caption: 'Concept — Dining Room', ratio: '16/9' },
];

const TRACKS: Track[] = [
  {
    id: 'commercial',
    label: 'Commercial',
    eyebrow: 'Hotels · Restaurants · Offices · Retail',
    line: 'Pieces that hold a room’s attention without ever raising their voice. Specified for lobbies, dining rooms, and reception spaces that are judged the moment you walk in.',
    inquireHref: '/interiors/inquire?space=Hotel',
    slides: COMMERCIAL_SLIDES,
  },
  {
    id: 'residential',
    label: 'Residential',
    eyebrow: 'Designers · Architects · Private Homes',
    line: 'Objects designed around the project — its palette, proportions, and material language. Specified with confidence, and never the thing a client asks to change.',
    inquireHref: '/interiors/inquire?space=Residential',
    slides: RESIDENTIAL_SLIDES,
  },
];

export function InteriorsShowcase() {
  const [active, setActive] = useState<TrackId>('commercial');
  const track = TRACKS.find((t) => t.id === active) ?? TRACKS[0];

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16 py-20 md:py-28 border-b border-charcoal/10">
      {/* Track toggle */}
      <div className="flex items-center justify-between flex-wrap gap-6 mb-10 md:mb-14">
        <div
          role="tablist"
          aria-label="Project type"
          className="inline-flex border border-charcoal/15"
        >
          {TRACKS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`interiors-tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`interiors-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                'px-6 py-3 label-caps text-[10px] transition-colors duration-300',
                active === t.id
                  ? 'bg-charcoal text-ivory'
                  : 'text-charcoal/70 hover:text-charcoal',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="label-caps text-charcoal/70 text-[10px]">{track.eyebrow}</p>
      </div>

      {/* Tab panel for the active track */}
      <div
        role="tabpanel"
        id={`interiors-panel-${track.id}`}
        aria-labelledby={`interiors-tab-${track.id}`}
      >
        {/* Concept eyebrow — these are design visualizations, not photos of real client projects */}
        <p className="label-caps text-charcoal/55 text-[10px] mb-3">
          Concept Visualizations
        </p>

        {/* Per-track intro */}
        <p className="font-body text-sm md:text-base text-charcoal/75 leading-[1.9] max-w-[58ch] mb-10 md:mb-12">
          {track.line}
        </p>

        {/* Carousel — re-keyed per track so it resets scroll/edges on switch */}
        <PrototypeCarousel
          key={track.id}
          slides={track.slides}
          ariaLabel={`${track.label} project prototypes`}
        />
      </div>

      {/* CTA */}
      <div className="mt-12 md:mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link
          href={track.inquireHref}
          className="inline-block px-8 py-3.5 label-caps text-ivory bg-charcoal hover:bg-stone transition-colors duration-300"
        >
          Start a Project
        </Link>
        <Link
          href="/interiors/inquire#book"
          className="label-caps text-charcoal/70 hover:text-charcoal transition-colors duration-300"
        >
          Or book a consultation <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
