'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';

interface CareAccordionProps {
  instructions: string[];
}

const defaultInstructions = [
  'Keep away from direct sunlight to preserve color vibrancy.',
  'Avoid humidity and moisture — do not expose to rain or steam.',
  'Do not water. Preserved roses require no hydration.',
  'Gently remove dust with a soft, dry brush if needed.',
  'Expected bloom duration: 10–12 months under proper conditions.',
];

export function CareAccordion({ instructions }: CareAccordionProps) {
  const items = instructions.length > 0 ? instructions : defaultInstructions;

  return (
    <Accordion.Root type="single" collapsible className="border-t border-charcoal/10">
      <Accordion.Item value="care" className="border-b border-charcoal/10">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left focus:outline-none">
            <p className="label-caps text-charcoal">Care Instructions</p>
            <ChevronRight
              size={14}
              strokeWidth={1.5}
              className="text-warm-gray transition-transform duration-300 group-data-[state=open]:rotate-90"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease-out] data-[state=closed]:animate-[slideUp_200ms_ease-out]">
          <ul className="pb-6 flex flex-col gap-3">
            {items.map((instruction, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                <p className="font-body text-sm text-warm-gray leading-relaxed">{instruction}</p>
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>

      <Accordion.Item value="shipping-info" className="border-b border-charcoal/10">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left focus:outline-none">
            <p className="label-caps text-charcoal">Shipping Information</p>
            <ChevronRight
              size={14}
              strokeWidth={1.5}
              className="text-warm-gray transition-transform duration-300 group-data-[state=open]:rotate-90"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease-out] data-[state=closed]:animate-[slideUp_200ms_ease-out]">
          <div className="pb-6">
            <p className="font-body text-sm text-warm-gray leading-relaxed">
              All orders ship via UPS from Miami, FL. Delivery within 3–7 business days to all 50 states.
              Expedited shipping available at checkout. Orders placed before 2pm EST ship same day.
            </p>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
