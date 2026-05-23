import { defineField, defineType } from 'sanity';

export const homepageHero = defineType({
  name: 'homepageHero',
  title: 'Homepage Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small caps label above the rose — e.g. "Maison Florale — Miami"',
      initialValue: 'Maison Florale — Miami',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'The main H1. Keep it short — it scales large on desktop.',
      initialValue: 'Not Just For Her.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subhead',
      title: 'Subhead',
      type: 'text',
      rows: 3,
      initialValue:
        'A design piece for hotels, restaurants, and the spaces that demand distinction — as much as it is a gift for the woman who deserves more than a bouquet.',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      initialValue: 'Shop the Collection',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA Link',
      type: 'string',
      description: 'Internal path, e.g. /shop',
      initialValue: '/shop',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
      initialValue: 'For Business',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA Link',
      type: 'string',
      description: 'Internal path, e.g. /wholesale',
      initialValue: '/wholesale',
    }),
    defineField({
      name: 'scrollHintLabel',
      title: 'Scroll Hint Label',
      type: 'string',
      initialValue: 'Scroll',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
  },
});
