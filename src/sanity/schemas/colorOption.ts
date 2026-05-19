import { defineField, defineType } from 'sanity';

export const colorOption = defineType({
  name: 'colorOption',
  title: 'Rose Color',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Color Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hexValue',
      title: 'Hex Color',
      type: 'string',
      description: 'e.g. #F5F0E6 — used for the color swatch circle',
      validation: (Rule) =>
        Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
          name: 'hex',
          invert: false,
        }),
    }),
    defineField({
      name: 'available',
      title: 'Currently Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'hexValue' },
  },
});
