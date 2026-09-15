import { getRelatedPosts, getProducts } from "@/lib/graphql";
import RelatedNewsPanel from "./RelatedNewsPanel";

export default async function RelatedNewsPanelAsync({
  region,
  category,
  excludeId,
}: {
  region: string;
  category: any;
  excludeId: number;
}) {
  const mainCategory = category?.parent?.node ?? category;

  const [relatedPosts, relatedProducts] = await Promise.all([
    category
      ? getRelatedPosts({
          categoryId: category.databaseId,
          categorySlug: category.slug,
          parentCategoryId: category.parent?.node?.databaseId ?? null,
          parentCategorySlug: category.parent?.node?.slug ?? null,
          excludeId,
        })
      : Promise.resolve([]),
    mainCategory ? getProducts(mainCategory.slug, region).then((p) => p.slice(0, 5)) : Promise.resolve([]),
  ]);

  return <RelatedNewsPanel region={region} relatedPosts={relatedPosts} relatedProducts={relatedProducts} />;
}