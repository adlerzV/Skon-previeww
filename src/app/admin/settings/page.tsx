import AdminAccountSettings from "@/components/admin/AdminAccountSettings";
import { getAdminBootstrap } from "@/lib/admin/server";
import { getAuthToken, getSessionId } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import { GET_SESSIONS_QUERY } from "@/lib/graphql/auth";

export default async function Page() {
  const bootstrap = await getAdminBootstrap();
  const token = await getAuthToken();
  const [currentSessionId, data] = await Promise.all([
    getSessionId(),
    fetchGraphQL(GET_SESSIONS_QUERY, {}, [], "no-store", token || undefined),
  ]);
  const initial = {
    user: {
      avatarId: bootstrap.user.avatarId,
      avatarUrl: bootstrap.user.avatarUrl,
      name: bootstrap.user.name,
      email: bootstrap.user.email,
      isStaff: true,
      hasManualPassword: bootstrap.user.hasManualPassword,
    },
    sessions: Array.isArray(data?.viewer?.sessions) ? data.viewer.sessions : [],
    currentSessionId,
  };
  return <AdminAccountSettings initial={initial} />;
}
