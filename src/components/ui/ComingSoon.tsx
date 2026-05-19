import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  phase: string;
}

export function ComingSoon({ title, description, phase }: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="label-caps text-charcoal/30 mb-4">{phase}</p>
      <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-light text-charcoal mb-4">{title}</h1>
      <p className="font-body text-sm text-charcoal/50 max-w-sm mb-10 leading-relaxed">{description}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 label-caps text-charcoal/60 hover:text-charcoal transition-colors duration-300 group"
      >
        Return Home
        <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
