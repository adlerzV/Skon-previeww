import "server-only";
import { fetchGraphQL } from "./client";
import { resolveAvatarUrl } from "@/lib/avatars";

const GET_PRODUCT_REVIEWS_QUERY = `
  query GetProductReviews($id: ID!, $after: String) {
    product(id: $id, idType: DATABASE_ID) {
      reviews(first: 20, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          databaseId
          parentDatabaseId
          isStaffReply
          content
          date
          author {
            node {
              name
              ... on User { avatarUrl }
            }
          }
        }
      }
    }
  }
`;

export async function getProductReviews(productId: number, after?: string) {
  const data = await fetchGraphQL(GET_PRODUCT_REVIEWS_QUERY, { id: String(productId), after }, [], "no-store");
  const connection = data?.product?.reviews;
  const rawNodes = connection?.nodes ?? [];

  const nodes = await Promise.all(
    rawNodes.map(async (r: any) => ({
      ...r,
      author: {
        node: {
          ...r.author?.node,
          avatarUrl: await resolveAvatarUrl(r.author?.node?.avatarUrl),
        },
      },
    }))
  );

  return {
    reviews: nodes,
    pageInfo: connection?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}