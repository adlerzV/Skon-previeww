"use client";

import MobileBottomNav from "./MobileBottomNav";
import { useHeaderViewer } from "./HeaderViewerProvider";

export default function MobileBottomNavAsync() {
  const { user, loading } = useHeaderViewer();
  return <MobileBottomNav user={user} loading={loading} />;
}
