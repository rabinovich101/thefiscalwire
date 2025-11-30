import prisma from "@/lib/prisma"
import { CategoryManager } from "@/components/admin/CategoryManager"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  })

  return <CategoryManager categories={categories} />
}
