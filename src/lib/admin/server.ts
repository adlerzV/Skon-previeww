import "server-only";
import { redirect } from "next/navigation";
import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import { ADMIN_DASHBOARD_SUMMARY_QUERY, ADMIN_OPEN_TICKETS_QUERY } from "@/lib/graphql/auth";
import type { AdminPermission } from "./permissions";

export interface AdminContext {
  id: string;
  databaseId: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  permissions: string[];
}

export async function requireAdmin(permission?: AdminPermission): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; permissions: string[] }> {
  const user = await getCurrentUser();
  if (!user?.isStaff) redirect("/admin-login");

  const permissions = user.adminPermissions ?? [];
  if (permission && !permissions.includes(permission)) redirect("/admin");

  return { user, permissions };
}

export async function getAdminSummary() {
  const { user, permissions } = await requireAdmin();
  const token = (await getAuthToken()) || undefined;

  const summaryPromise = fetchGraphQL(ADMIN_DASHBOARD_SUMMARY_QUERY, {}, [], "no-store", token);
  const ticketsPromise = permissions.includes("tickets.read")
    ? fetchGraphQL(ADMIN_OPEN_TICKETS_QUERY, { first: 8 }, [], "no-store", token)
    : Promise.resolve(null);

  const [summaryData, ticketsData] = await Promise.all([summaryPromise, ticketsPromise]);

  return {
    user: {
      id: user.id,
      databaseId: user.databaseId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    permissions,
    summary: {
      openTicketsCount: Number(summaryData?.adminOpenTicketsCount ?? 0),
      pendingReviewsCount: Number(summaryData?.pendingReviewsCount ?? 0),
    },
    tickets: Array.isArray(ticketsData?.adminOpenTickets) ? ticketsData.adminOpenTickets : [],
  };
}
