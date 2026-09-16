import { Suspense } from "react";
import SubHeaderBarClient from "./SubHeaderBarClient";

export default function SubHeaderBar() {
  return (
    <Suspense fallback={null}>
      <SubHeaderBarClient />
    </Suspense>
  );
}