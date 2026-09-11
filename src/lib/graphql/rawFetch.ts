import "server-only";

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
const INTERNAL_WP_GRAPHQL_URL = process.env.INTERNAL_WORDPRESS_API_URL;
const FALLBACK_LOCAL_URL = "http://tazavesh.local/graphql";
const REQUEST_TIMEOUT_MS = Number(process.env.GRAPHQL_REQUEST_TIMEOUT_MS) || 12_000;

function resolveEndpoint(): { url: string; hostHeader?: string } {
  const publicUrl = WP_GRAPHQL_URL || FALLBACK_LOCAL_URL;

  if (!INTERNAL_WP_GRAPHQL_URL) {
    return { url: publicUrl };
  }

  let hostHeader: string | undefined;
  try {
    hostHeader = new URL(publicUrl).host;
  } catch {
    hostHeader = undefined;
  }

  return { url: INTERNAL_WP_GRAPHQL_URL, hostHeader };
}

export async function fetchGraphQLWithErrors(
  query: string,
  variables: Record<string, unknown> = {},
  authToken?: string
): Promise<{ data: any; errorMessage: string | null }> {
  const { url: endpointUrl, hostHeader } = resolveEndpoint();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(endpointUrl, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(hostHeader ? { Host: hostHeader } : {}),
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    return { data: json?.data ?? null, errorMessage: json?.errors?.[0]?.message ?? null };
  } catch (error) {
    const isAbort = (error as Error)?.name === "AbortError";
    if (isAbort) {
      console.error(`GraphQL request timed out after ${REQUEST_TIMEOUT_MS}ms — query preview:`, query.trim().slice(0, 160));
      return { data: null, errorMessage: "خطا در ارتباط با سرور، دوباره تلاش کنید" };
    }
    console.error("GraphQL request error:", error);
    return { data: null, errorMessage: null };
  } finally {
    clearTimeout(timeoutId);
  }
}