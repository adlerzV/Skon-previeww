"use client";

import UserActions from "./UserActions";
import { useHeaderViewer } from "./HeaderViewerProvider";

export default function UserActionsAsync() {
  const { user, wishlistCount, loading } = useHeaderViewer();
  return <UserActions user={user} wishlistCount={wishlistCount} loading={loading} />;
}
