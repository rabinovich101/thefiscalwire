// Force dynamic rendering - no static generation at build time
export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma"
import { AuthorManager } from "@/components/admin/AuthorManager"

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  })

  return <AuthorManager authors={authors} />
}
