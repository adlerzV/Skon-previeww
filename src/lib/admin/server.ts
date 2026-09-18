import "server-only";
import { redirect } from "next/navigation";
import { getAuthToken, getCurrentUser } from "@/lib/auth/session";
import { fetchGraphQL } from "@/lib/graphql";
import {
  ADMIN_CLAIM_TICKET_MUTATION,
  ADMIN_CUSTOMER_QUERY,
  ADMIN_CUSTOMERS_QUERY,
  ADMIN_DASHBOARD_SUMMARY_QUERY,
  ADMIN_MODERATE_REVIEW_MUTATION,
  ADMIN_NOTIFICATIONS_QUERY,
  ADMIN_ORDER_QUERY,
  ADMIN_ORDERS_QUERY,
  ADMIN_REPLY_REVIEW_MUTATION,
  ADMIN_REPLY_TICKET_MUTATION,
  ADMIN_ADD_TICKET_NOTE_MUTATION,
  ADMIN_SET_TICKET_STATUS_MUTATION,
  ADMIN_ADD_ORDER_NOTE_MUTATION,
  ADMIN_UPDATE_ORDER_STATUS_MUTATION,
  ADMIN_UPDATE_ORDER_ITEM_FULFILLMENT_MUTATION,
  ADMIN_REASSIGN_TICKET_MUTATION,
  ADMIN_REVIEWS_QUERY,
  ADMIN_TICKET_QUERY,
  ADMIN_TICKETS_QUERY,
  ADMIN_STAFF_USERS_QUERY,
  ADMIN_OPEN_TICKETS_QUERY,
} from "@/lib/graphql/admin";
import type { AdminPermission } from "./permissions";

export async function requireAdmin(permission?: AdminPermission): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; permissions: string[] }> {
  const user = await getCurrentUser();
  if (!user?.isStaff) redirect("/admin-login");
  const permissions = user.adminPermissions ?? [];
  if (permission && !permissions.includes(permission)) redirect("/admin");
  return { user, permissions };
}

async function adminFetch<T = any>(query: string, variables: Record<string, unknown> = {}) {
  const token = (await getAuthToken()) || undefined;
  return fetchGraphQL<T>(query, variables, [], "no-store", token);
}

export async function getAdminSummary() {
  const { user, permissions } = await requireAdmin();
  const summaryPromise = adminFetch(ADMIN_DASHBOARD_SUMMARY_QUERY);
  const ticketsPromise = permissions.includes("tickets.read") ? adminFetch(ADMIN_OPEN_TICKETS_QUERY, { first: 8 }) : Promise.resolve(null);
  const [summaryData, ticketsData] = await Promise.all([summaryPromise, ticketsPromise]);
  return {
    user: { id: user.id, databaseId: user.databaseId, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
    permissions,
    summary: {
      openTicketsCount: Number(summaryData?.adminOpenTicketsCount ?? 0),
      pendingReviewsCount: Number(summaryData?.pendingReviewsCount ?? 0),
      processingOrdersCount: Number(summaryData?.adminProcessingOrdersCount ?? 0),
      unreadNotificationsCount: Number(summaryData?.adminUnreadNotificationsCount ?? 0),
    },
    tickets: Array.isArray(ticketsData?.adminOpenTickets) ? ticketsData.adminOpenTickets : [],
  };
}

export async function getAdminOrders(variables: Record<string, unknown> = {}) {
  await requireAdmin("orders.read");
  const data = await adminFetch(ADMIN_ORDERS_QUERY, { first: 20, ...variables });
  return data?.adminOrders ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getAdminOrder(id: number) {
  await requireAdmin("orders.read");
  const data = await adminFetch(ADMIN_ORDER_QUERY, { id });
  return data?.adminOrder ?? null;
}

export async function getAdminTickets(variables: Record<string, unknown> = {}) {
  await requireAdmin("tickets.read");
  const data = await adminFetch(ADMIN_TICKETS_QUERY, { first: 20, ...variables });
  return data?.adminTickets ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getAdminTicket(id: number) {
  await requireAdmin("tickets.read");
  const data = await adminFetch(ADMIN_TICKET_QUERY, { id });
  return data?.adminTicket ?? null;
}

export async function getAdminCustomers(variables: Record<string, unknown> = {}) {
  await requireAdmin("users.read");
  const data = await adminFetch(ADMIN_CUSTOMERS_QUERY, { first: 20, ...variables });
  return data?.adminCustomers ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getAdminCustomer(id: number) {
  await requireAdmin("users.read");
  const data = await adminFetch(ADMIN_CUSTOMER_QUERY, { id });
  return data?.adminCustomer ?? null;
}

export async function getAdminReviews(variables: Record<string, unknown> = {}) {
  await requireAdmin("reviews.moderate");
  const data = await adminFetch(ADMIN_REVIEWS_QUERY, { first: 20, state: "pending", ...variables });
  return data?.adminReviews ?? { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getAdminStaffUsers() {
  await requireAdmin("tickets.write");
  const data = await adminFetch(ADMIN_STAFF_USERS_QUERY);
  return Array.isArray(data?.adminStaffUsers) ? data.adminStaffUsers : [];
}

export async function getAdminNotifications(unreadOnly = false) {
  await requireAdmin();
  const data = await adminFetch(ADMIN_NOTIFICATIONS_QUERY, { first: 20, unreadOnly });
  return Array.isArray(data?.adminNotifications) ? data.adminNotifications : [];
}

export async function adminMutation(query: string, variables: Record<string, unknown> = {}) {
  await requireAdmin();
  return adminFetch(query, variables);
}

export const ADMIN_MUTATIONS = {
  claimTicket: ADMIN_CLAIM_TICKET_MUTATION,
  replyTicket: ADMIN_REPLY_TICKET_MUTATION,
  addTicketNote: ADMIN_ADD_TICKET_NOTE_MUTATION,
  setTicketStatus: ADMIN_SET_TICKET_STATUS_MUTATION,
  reassignTicket: ADMIN_REASSIGN_TICKET_MUTATION,
  moderateReview: ADMIN_MODERATE_REVIEW_MUTATION,
  replyReview: ADMIN_REPLY_REVIEW_MUTATION,
  addOrderNote: ADMIN_ADD_ORDER_NOTE_MUTATION,
  updateOrderStatus: ADMIN_UPDATE_ORDER_STATUS_MUTATION,
  updateOrderItemFulfillment: ADMIN_UPDATE_ORDER_ITEM_FULFILLMENT_MUTATION,
};
