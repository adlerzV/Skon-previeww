import { Suspense } from "react";
import { getPostComments } from "@/lib/graphql/blogComments";
import CommentThread from "@/components/comments/CommentThread";
import Skeleton from "@/components/ui/Skeleton";

interface PostCommentsSectionProps {
  postId: number;
  initialCommentsCount?: number;
  isLoggedIn: boolean;
  isStaff?: boolean;
}

async function PostCommentsData({ postId, initialCommentsCount, isLoggedIn, isStaff }: PostCommentsSectionProps) {
  const { comments } = await getPostComments(postId);

  return (
    <CommentThread
      targetId={postId}
      initialComments={comments}
      initialCommentsCount={initialCommentsCount ?? 0}
      isLoggedIn={isLoggedIn}
      isStaff={isStaff}
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