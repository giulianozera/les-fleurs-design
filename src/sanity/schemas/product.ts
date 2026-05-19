import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),

    // ── Media ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'First image is the primary. Second image shows on hover. 4:5 portrait ratio recommended.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // ── Variants ──────────────────────────────────────────────────────────────
    defineField({
      name: 'roseColors',
      title: 'Available Rose Colors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'colorOption' }] }],
    }),
    defineField({
      name: 'potOptions',
      title: 'Available Ceramic Pots',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'potOption' }] }],
    }),

    // ── Taxonomy ──────────────────────────────────────────────────────────────
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),

    // ── Shipping ──────────────────────────────────────────────────────────────
    defineField({
      name: 'weightGrams',
      title: 'Weight (grams)',
      type: 'number',
      description: 'Used for EasyPost shipping rate calculation',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions (cm)',
      type: 'object',
      fields: [
        defineField({ name: 'length', type: 'number', title: 'Length (cm)' }),
        defineField({ name: 'width', type: 'number', title: 'Width (cm)' }),
        defineField({ name: 'height', type: 'number', title: 'Height (cm)' }),
      ],
    }),

    // ── Inventory ─────────────────────────────────────────────────────────────
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),

    // ── Care ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each entry becomes a bullet point in the care accordion',
    }),
  ],
  orderings: [
    {
      title: 'Price (Low → High)',
      name: 'priceAsc',
      by: [{ field: 'basePrice', direction: 'asc' }],
    },
    {
      title: 'Price (High → Low)',
      name: 'priceDesc',
      by: [{ field: 'basePrice', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'basePrice',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle != null ? `$${subtitle}` : 'No price set',
        media,
      };
    },
  },
});
