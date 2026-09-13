import { ComponentProps } from "react";
import { getCurrentUser, getAuthToken } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import {
  DASHBOARD_SUMMARY_QUERY,
  ADMIN_DASHBOARD_SUMMARY_QUERY,
  ADMIN_OPEN_TICKETS_QUERY,
} from "@/lib/graphql/auth";
import UnifiedLoginFlow from "@/components/account/UnifiedLoginFlow";
import AccountDashboard from "@/components/account/AccountDashboard";
import AdminDashboard from "@/components/account/AdminDashboard";

const SUCCESSFUL_STATUSES = new Set(["PROCESSING", "COMPLETED"]);

type AccountDashboardProps = ComponentProps<typeof AccountDashboard>;
type OrderSummary = AccountDashboardProps["recentOrders"][number];
type TicketSummary = AccountDashboardProps["recentTickets"][number];

const resolveWpAdminUrl = (): string | null => {
  const envUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!envUrl) return null;

  try {
    const parsed = new URL(envUrl);
    const basePath = parsed.pathname.replace(/\/graphql\/?$/, "");
    parsed.pathname = `${basePath}/wp-admin`.replace(/\/+/g, "/");
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return null;
  }
};

export default async function MyAccountView() {
  const user = await getCurrentUser();

  if (!user) {
    return <UnifiedLoginFlow />;
  }

  const token = await getAuthToken();
  const authToken = token || undefined;

  if (user.isStaff) {
    try {
      const [summaryData, ticketsData] = await Promise.all([
        fetchGraphQL(ADMIN_DASHBOARD_SUMMARY_QUERY, {}, [], "no-store", authToken),
        fetchGraphQL(ADMIN_OPEN_TICKETS_QUERY, { first: 10 }, [], "no-store", authToken),
      ]);

      return (
        <div className="mx-auto h-full">
          <AdminDashboard
            user={user}
            openTicketsCount={summaryData?.adminOpenTicketsCount ?? 0}
            pendingReviewsCount={summaryData?.pendingReviewsCount ?? 0}
            initialOpenTickets={ticketsData?.adminOpenTickets ?? []}
            wpAdminUrl={resolveWpAdminUrl()}
          />
        </div>
      );
    } catch {
      return (
        <div className="mx-auto h-full">
          <AdminDashboard
            user={user}
            openTicketsCount={0}
            pendingReviewsCount={0}
            initialOpenTickets={[]}
            wpAdminUrl={resolveWpAdminUrl()}
          />
        </div>
      );
    }
  }

  try {
    const data = await fetchGraphQL(DASHBOARD_SUMMARY_QUERY, {}, [], "no-store", authToken);

    const allOrders: OrderSummary[] = data?.customer?.orders?.nodes ?? [];
    const successfulOrdersCount = allOrders.filter(
      (o) => typeof o.status === "string" && SUCCESSFUL_STATUSES.has(o.status)
    ).length;
    const wishlistIds: string[] = data?.viewer?.wishlistIds ?? [];
    const tickets: TicketSummary[] = data?.myTickets?.nodes ?? [];
    const openTicketsCount = tickets.filter(
      (t) => (t.ticketStatus ?? "open") !== "closed"
    ).length;
    const reviewsCount: number = data?.myReviews?.totalCount ?? 0;

    return (
      <div className="mx-auto h-full">
        <AccountDashboard
          user={user}
          recentOrders={allOrders.slice(0, 3)}
          successfulOrdersCount={successfulOrdersCount}
          wishlistCount={wishlistIds.length}
          recentTickets={tickets.slice(0, 3)}
          openTicketsCount={openTicketsCount}
          reviewsCount={reviewsCount}
        />
      </div>
    );
  } catch {
    return (
      <div className="mx-auto h-full">
        <AccountDashboard
          user={user}
          recentOrders={[]}
          successfulOrdersCount={0}
          wishlistCount={0}
          recentTickets={[]}
          openTicketsCount={0}
          reviewsCount={0}
        />
      </div>
    );
  }
}