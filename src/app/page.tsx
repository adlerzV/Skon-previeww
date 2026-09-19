import { DEFAULT_REGION } from "@/lib/regions";
import { redirect } from "next/navigation";

export default function RootPage() {
  // The proxy normally preserves the user's region cookie. This fallback stays static.
  redirect(`/${DEFAULT_REGION}`);
}
