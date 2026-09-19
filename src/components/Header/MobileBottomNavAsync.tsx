"use client";

import MobileBottomNav from "./MobileBottomNav";
import { useHeaderViewer } from "./HeaderViewerProvider";

export default function MobileBottomNavAsync() {
  const { user } = useHeaderViewer();
  return <MobileBottomNav user={user} />;
}
