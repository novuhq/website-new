import { defineField, defineType } from 'sanity';

import { GROUP } from '../../shared/group';
import { SEO_FIELDS } from '../../shared/seo';
import pageObjects from './objects';

const pricing = defineType({
  name: 'pricing',
  title: 'Pricing',
  type: 'document',
  groups: [GROUP.content, GROUP.seo],
  fieldsets: [
    {
      name: 'hero',
      title: 'Hero',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'logos',
      title: 'Logos',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'plans',
      title: 'Plans',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'faq',
      title: 'FAQ',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'cta',
      title: 'CTA',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'pageCta',
      title: 'Page CTA',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'hero',
      type: 'pricingHero',
      title: 'Hero',
      group: GROUP.content.name,
      fieldset: 'hero',
    }),
    defineField({
      name: 'logos',
      type: 'logos',
      title: 'Logos',
      group: GROUP.content.name,
      fieldset: 'logos',
    }),
    defineField({
      name: 'plans',
      type: 'plans',
      title: 'Plans',
      group: GROUP.content.name,
      fieldset: 'plans',
    }),
    defineField({
      name: 'faq',
      type: 'faq',
      title: 'FAQ',
      group: GROUP.content.name,
      fieldset: 'faq',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'cta',
      type: 'ctaBlock',
      title: 'CTA',
      group: GROUP.content.name,
      fieldset: 'cta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageCta',
      type: 'pageCta',
      title: 'Page CTA',
      group: GROUP.content.name,
      fieldset: 'pageCta',
      validation: (rule) => rule.required(),
    }),
  ],
});

export default [...pageObjects, pricing];
