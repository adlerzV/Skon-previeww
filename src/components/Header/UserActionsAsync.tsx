"use client";

import UserActions from "./UserActions";
import { useHeaderViewer } from "./HeaderViewerProvider";

export default function UserActionsAsync() {
  const { user, wishlistCount } = useHeaderViewer();
  return <UserActions user={user} wishlistCount={wishlistCount} />;
}
