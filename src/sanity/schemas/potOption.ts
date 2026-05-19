import { defineField, defineType } from 'sanity';

export const potOption = defineType({
  name: 'potOption',
  title: 'Ceramic Pot',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Pot Name',
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
      name: 'description',
      title: 'Short Description',
      type: 'string',
      description: 'e.g. "Blue & white hand-painted porcelain"',
    }),
    defineField({
      name: 'image',
      title: 'Pot Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'available',
      title: 'Currently Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'description', media: 'image' },
  },
});
