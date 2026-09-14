import "server-only";
import { fetchGraphQL } from "./client";
import { POST_COMMENTS_QUERY } from "./blog";
import { resolveAvatarUrl } from "@/lib/avatars";

export async function getPostComments(postId: string | number, after?: string) {
  const data = await fetchGraphQL(POST_COMMENTS_QUERY, { id: String(postId), after }, [], "no-store");
  const connection = data?.post?.comments;
  const rawNodes = connection?.nodes ?? [];

  const nodes = await Promise.all(
    rawNodes.map(async (c: any) => ({
      ...c,
      author: {
        node: {
          ...c.author?.node,
          avatarUrl: await resolveAvatarUrl(c.author?.node?.avatarUrl),
        },
      },
    }))
  );

  return {
    comments: nodes,
    pageInfo: connection?.pageInfo ?? { hasNextPage: false, endCursor: null },
  };
}