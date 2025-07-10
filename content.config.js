import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    category:defineCollection({
      type: 'data',
      source: 'category/*/**.json',
      schema: z.object({
        name: z.string(),
        icon: z.string(),
        type: z.string(),
      }),
    }),
    article: defineCollection({
      source: 'article/**/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        coverImage: z.string(),
        description: z.string(),
        category: z.string(),
        theme: z.string(),
        isRecommend: z.boolean(),
        date: z.date().transform((val) => val.toDateString()),
      })
    }),
    project: defineCollection({
      source: 'project/**/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        image: z.string(),
        link: z.string(),
        date: z.date().transform((val) => val.toDateString()),
      })
    }),
    dynamic:defineCollection({
      type: 'data',
      source: 'dynamic/**.json',
      schema: z.object({
        content: z.string(),
        images: z.array(z.string()),
        date: z.date().transform((val) => val.toDateString()),
      }),
    }),
  }
})