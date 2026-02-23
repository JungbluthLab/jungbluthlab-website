import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pi' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    role: z.string(),
    email: z.string(),
    color: z.enum(['michelle', 'sean']),
    googleScholar: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    orcid: z.string().url().optional(),
    github: z.string().url().optional(),
    researchGate: z.string().url().optional(),
    keywords: z.array(z.string()),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    advisor: z.enum(['michelle', 'sean', 'both']),
    status: z.enum(['current', 'alumni']).default('current'),
    photo: z.string().optional(),
    website: z.string().url().optional(),
    order: z.number().default(99),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    pi: z.enum(['michelle', 'sean', 'both']),
    summary: z.string(),
    image: z.string().optional(),
    order: z.number().default(99),
  }),
});

const software = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/software' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    image: z.string().optional(),
    order: z.number().default(99),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { pi, people, research, software, news };
