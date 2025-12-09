import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Remove AI-telltale characters like em dashes from text
 * Replaces em dash and en dash with regular dash
 */
function sanitizeText(text: string): string {
  return text
    .replace(/—/g, '-')  // em dash
    .replace(/–/g, '-'); // en dash
}

/**
 * Recursively sanitize content blocks (JSON structure)
 */
function sanitizeContentBlocks(content: unknown): unknown {
  if (typeof content === 'string') {
    return sanitizeText(content)
  }
  if (Array.isArray(content)) {
    return content.map(sanitizeContentBlocks)
  }
  if (typeof content === 'object' && content !== null) {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(content)) {
      result[key] = sanitizeContentBlocks(value)
    }
    return result
  }
  return content
}

/**
 * Check if text contains em dash or en dash
 */
function containsDashes(text: string): boolean {
  return text.includes('—') || text.includes('–')
}

/**
 * Check if content blocks contain dashes
 */
function contentContainsDashes(content: unknown): boolean {
  if (typeof content === 'string') {
    return containsDashes(content)
  }
  if (Array.isArray(content)) {
    return content.some(contentContainsDashes)
  }
  if (typeof content === 'object' && content !== null) {
    return Object.values(content).some(contentContainsDashes)
  }
  return false
}

async function main() {
  console.log('Scanning all articles for em dashes and en dashes...\n')

  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      metaDescription: true,
    }
  })

  console.log(`Found ${articles.length} articles to check.\n`)

  let updatedCount = 0
  let errorCount = 0

  for (const article of articles) {
    const needsUpdate =
      containsDashes(article.title) ||
      containsDashes(article.excerpt) ||
      (article.metaDescription && containsDashes(article.metaDescription)) ||
      contentContainsDashes(article.content)

    if (needsUpdate) {
      try {
        const sanitizedTitle = sanitizeText(article.title)
        const sanitizedExcerpt = sanitizeText(article.excerpt)
        const sanitizedMeta = article.metaDescription ? sanitizeText(article.metaDescription) : null
        const sanitizedContent = sanitizeContentBlocks(article.content)

        await prisma.article.update({
          where: { id: article.id },
          data: {
            title: sanitizedTitle,
            excerpt: sanitizedExcerpt,
            metaDescription: sanitizedMeta,
            content: sanitizedContent as object,
          }
        })

        console.log(`Updated: "${article.title.substring(0, 60)}..."`)
        updatedCount++
      } catch (error) {
        console.error(`Error updating article ${article.id}:`, error)
        errorCount++
      }
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Total articles checked: ${articles.length}`)
  console.log(`Articles updated: ${updatedCount}`)
  console.log(`Errors: ${errorCount}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
