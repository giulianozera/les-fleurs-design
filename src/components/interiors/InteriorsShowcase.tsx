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

// Commercial uses the real hospitality photography already in /public/business.
const COMMERCIAL_SLIDES: PrototypeSlide[] = [
  { src: '/business/hotel lobby.jpg', caption: 'Hotel Lobby', alt: 'Hotel lobby installation', ratio: '16/9' },
  { src: '/business/private member club .png', caption: "Private Members' Club", alt: "Private members' club arrangement", ratio: '3/4' },
  { src: '/business/restourant table.jpg', caption: 'Restaurant', alt: 'Restaurant table arrangement', ratio: '4/3' },
  { src: '/business/Suite_amenity_—_blue_porcelain_202605282258.jpeg', caption: 'Suite Amenity', alt: 'Suite amenity — blue porcelain vessel', ratio: '3/4' },
  { src: '/business/event inistallation.JPG', caption: 'Event Installation', alt: 'Event floral installation', ratio: '4/3' },
  { src: '/business/corporate .png', caption: 'Corporate Reception', alt: 'Corporate reception arrangement', ratio: '16/9' },
];

// Residential placeholders — swap in real project images when available.
// TODO: replace with <PrototypeSlide src="…"> once prototype photography is shot.
const RESIDENTIAL_SLIDES: PrototypeSlide[] = [
  { caption: 'Living Room — Private Residence', ratio: '16/9' },
  { caption: 'Entryway — Miami Penthouse', ratio: '3/4' },
  { caption: 'Master Bedroom — Detail', ratio: '4/3' },
  { caption: 'Library Corner — Travertine Vessel', ratio: '3/4' },
  { caption: 'Dining Room — Blue Porcelain Dome', ratio: '16/9' },
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
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                'px-6 py-3 label-caps text-[10px] transition-colors duration-300',
                active === t.id
                  ? 'bg-charcoal text-ivory'
                  : 'text-charcoal/55 hover:text-charcoal',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="label-caps text-warm-gray text-[10px]">{track.eyebrow}</p>
      </div>

      {/* Per-track intro */}
      <p className="font-body text-sm md:text-base text-warm-gray leading-[1.9] max-w-[58ch] mb-10 md:mb-12">
        {track.line}
      </p>

      {/* Carousel — re-keyed per track so it resets scroll/edges on switch */}
      <PrototypeCarousel
        key={track.id}
        slides={track.slides}
        ariaLabel={`${track.label} project prototypes`}
      />

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
          className="label-caps text-charcoal/50 hover:text-charcoal transition-colors duration-300"
        >
          Or book a consultation →
        </Link>
      </div>
    </section>
  );
}
