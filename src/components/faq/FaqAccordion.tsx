'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSection {
  category: string;
  items: FaqItem[];
}

const FAQ_DATA: FaqSection[] = [
  {
    category: 'Product & Care',
    items: [
      {
        q: 'How long do preserved roses last?',
        a: 'With proper care, our preserved roses last 12–18 months or longer. They require no water, no sunlight, and minimal maintenance — simply keep them in a stable environment.',
      },
      {
        q: 'How do I care for my arrangement?',
        a: 'Keep away from direct sunlight, humidity, and heat sources. Do not water — preserved roses contain no living tissue and will be damaged by moisture. If dust accumulates, remove it gently with a soft, dry brush.',
      },
      {
        q: 'Will the colors fade over time?',
        a: 'Minimal color shift is natural over many months. Keeping the arrangement away from direct sunlight significantly slows any fading. Most clients report no visible change in the first year.',
      },
      {
        q: 'Can I customize my order?',
        a: 'Yes. Each product page lets you select your preferred rose color and ceramic vessel from available options. For custom commissions or large-format installations, contact us or submit a wholesale inquiry.',
      },
      {
        q: 'How are the roses preserved?',
        a: 'We use a glycerin-based preservation process. The natural sap inside the rose is gradually replaced with a preservation solution, keeping petals soft and form intact — without chemicals that affect appearance.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping (UPS Ground) delivers in 5–7 business days for $12. Express shipping (UPS 2nd Day Air) delivers in 2–3 business days for $25. Orders over $200 qualify for free standard shipping.',
      },
      {
        q: 'Do you ship outside the United States?',
        a: 'Currently we ship to all 50 US states only. International shipping is planned for 2025 — join our newsletter to be notified first.',
      },
      {
        q: 'How long before my order ships?',
        a: 'Orders are processed and dispatched within 2–3 business days. You\'ll receive a UPS tracking number by email once your order leaves our Miami studio.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes. A tracking number is sent to your email address as soon as your order is dispatched. Use it on ups.com for real-time updates.',
      },
      {
        q: 'What is your return policy?',
        a: 'Due to the perishable nature of preserved flowers, all sales are final. If your arrangement arrives damaged, contact us at hello@lesfleursdesign.com within 48 hours of receipt with photographs and we will arrange a replacement.',
      },
      {
        q: 'How is my order packaged?',
        a: 'All arrangements ship in a custom matte gift box with tissue paper, a care card, and protective foam inserts to prevent movement during transit. The packaging is itself a gift experience.',
      },
    ],
  },
  {
    category: 'Wholesale & Partnerships',
    items: [
      {
        q: 'Do you offer wholesale pricing?',
        a: 'Yes. We work with hotels, boutique retailers, florists, and interior designers on partner programs with volume pricing, recurring delivery, and custom product options. Visit our Wholesale page to submit an inquiry.',
      },
      {
        q: 'What is the minimum order for wholesale?',
        a: 'Wholesale programs typically begin at 10 units per order. Minimum thresholds vary by product line. Contact us for a custom quote.',
      },
      {
        q: 'Can you create custom arrangements for events or spaces?',
        a: 'Yes. We offer bespoke commissions for lobby installations, event décor, and branded gifting programs. Book a consultation through our Wholesale page to discuss your project.',
      },
    ],
  },
];

export function FaqAccordion() {
  return (
    <div className="flex flex-col gap-16">
      {FAQ_DATA.map((section) => (
        <div key={section.category}>
          <p className="label-caps text-warm-gray mb-8">{section.category}</p>
          <Accordion.Root type="single" collapsible className="border-t border-charcoal/10">
            {section.items.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`${section.category}-${i}`}
                className="border-b border-charcoal/10"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between py-5 text-left focus:outline-none">
                    <p className="font-body text-sm font-medium text-charcoal pr-8">{item.q}</p>
                    <ChevronRight
                      size={14}
                      strokeWidth={1.5}
                      className="text-warm-gray flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-90"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease-out] data-[state=closed]:animate-[slideUp_200ms_ease-out]">
                  <p className="font-body text-sm text-warm-gray leading-[1.9] pb-6 max-w-2xl">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      ))}
    </div>
  );
}
