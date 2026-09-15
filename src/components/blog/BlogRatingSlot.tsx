import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_MY_RATING_QUERY } from "@/lib/graphql/blog";
import BlogRating from "./BlogRating";

export default async function BlogRatingSlot({
  postId,
  averageRating,
  ratingCount,
}: {
  postId: number;
  averageRating: number;
  ratingCount: number;
}) {
  const [user, token] = await Promise.all([
    getCurrentUser().catch(() => null),
    getAuthToken(),
  ]);

  const ratingData = token
    ? await fetchGraphQL(GET_MY_RATING_QUERY, { id: String(postId) }, [], "no-store", token)
    : null;

  return (
    <BlogRating
      postId={postId}
      initialAverage={averageRating}
      initialCount={ratingCount}
      isLoggedIn={Boolean(user)}
      initialMyRating={ratingData?.post?.myRating ?? null}
    />
  );
}