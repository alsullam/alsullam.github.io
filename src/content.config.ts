import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/[0-9]*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    chapter: z.number(),
    desc: z.string().optional(),
    status: z.enum(['active', 'wip', 'paused']).optional(),
    date: z.string().optional(),
    version: z.string().optional(),
    tags: z.array(z.string()).optional(),
    github: z.string().optional(),
    concepts: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    resources: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    experiments: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    changelog: z.array(z.object({
      version: z.string(),
      date: z.string(),
      notes: z.string(),
    })).optional(),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    pinned: z.boolean().optional(),
    projects: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    related: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    resources: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    experiments: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    outcome: z.enum(['success', 'partial', 'failure']),
    date: z.string(),
    tags: z.array(z.string()),
    concepts: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
    projects: z.array(z.object({ title: z.string(), slug: z.string() })).optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    rating: z.number(),
    link: z.string().optional(),
  }),
});

export const collections = { projects, concepts, experiments, resources };
