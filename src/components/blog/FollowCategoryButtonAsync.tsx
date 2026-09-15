import { fetchGraphQL } from "@/lib/graphql";
import { GET_FOLLOW_STATUS_QUERY } from "@/lib/graphql/blog";
import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import FollowCategoryButton from "./FollowCategoryButton";

export default async function FollowCategoryButtonAsync({
  categoryId,
  initialFollowerCount,
}: {
  categoryId: number;
  initialFollowerCount: number;
}) {
  const [user, token] = await Promise.all([
    getCurrentUser().catch(() => null),
    getAuthToken(),
  ]);

  const followData = token
    ? await fetchGraphQL(GET_FOLLOW_STATUS_QUERY, { id: String(categoryId) }, [], "no-store", token)
    : null;

  return (
    <FollowCategoryButton
      categoryId={categoryId}
      initialFollowerCount={initialFollowerCount}
      isLoggedIn={Boolean(user)}
      initialIsFollowing={Boolean(followData?.category?.isFollowedByViewer)}
    />
  );
}