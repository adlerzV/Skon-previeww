import { Suspense } from "react";
import { getPostComments } from "@/lib/graphql/blogComments";
import { getCurrentUser } from "@/lib/auth/session";
import CommentThread from "@/components/comments/CommentThread";
import Skeleton from "@/components/ui/Skeleton";

interface PostCommentsSectionProps {
  postId: number;
  initialCommentsCount?: number;
}

async function PostCommentsData({ postId, initialCommentsCount }: PostCommentsSectionProps) {
  const [{ comments }, user] = await Promise.all([
    getPostComments(postId),
    getCurrentUser().catch(() => null),
  ]);

  return (
    <CommentThread
      targetId={postId}
      initialComments={comments}
      initialCommentsCount={initialCommentsCount ?? 0}
      isLoggedIn={Boolean(user)}
      isStaff={Boolean(user?.isStaff)}
      writeEndpoint="/api/blog/comments"
      replyEndpoint="/api/blog/comments/reply"
    />
  );
}

function PostCommentsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6" dir="rtl">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-24 w-full" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

export default function PostCommentsSection(props: PostCommentsSectionProps) {
  return (
    <Suspense fallback={<PostCommentsSkeleton />}>
      <PostCommentsData {...props} />
    </Suspense>
  );
}