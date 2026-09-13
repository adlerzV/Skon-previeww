import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { unstable_cache } from "next/cache";

const AVATARS_ROOT = path.join(process.cwd(), "public", "avatars");
const USERS_DIR = path.join(AVATARS_ROOT, "users");
const ADMIN_DIR = path.join(AVATARS_ROOT, "admin");
const ALLOWED_EXT = [".webp", ".png", ".jpg", ".jpeg"];

export interface AvatarEntry {
  id: string;
  url: string;
}

interface AvatarManifest {
  users: AvatarEntry[];
  admin: AvatarEntry[];
  usersById: Record<string, string>;
  adminById: Record<string, string>;
}

async function scanDir(dir: string, urlPrefix: string): Promise<AvatarEntry[]> {
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => ALLOWED_EXT.includes(path.extname(f).toLowerCase()))
      .sort()
      .map((f) => ({
        id: path.basename(f, path.extname(f)),
        url: `${urlPrefix}/${f}`,
      }));
  } catch {
    return [];
  }
}

const loadManifest = unstable_cache(
  async (): Promise<AvatarManifest> => {
    const [users, admin] = await Promise.all([
      scanDir(USERS_DIR, "/avatars/users"),
      scanDir(ADMIN_DIR, "/avatars/admin"),
    ]);

    return {
      users,
      admin,
      usersById: Object.fromEntries(users.map((a) => [a.id, a.url])),
      adminById: Object.fromEntries(admin.map((a) => [a.id, a.url])),
    };
  },
  ["avatar-manifest"],
  { tags: ["avatars"], revalidate: 300 }
);

function parseAvatarId(value: string): { scope: "users" | "admin"; id: string } | null {
  const match = value.match(/^(users|admin)\/([A-Za-z0-9_-]+)$/);
  if (!match) return null;
  return { scope: match[1] as "users" | "admin", id: match[2] };
}

function parseLegacyPath(value: string): { scope: "users" | "admin"; id: string } | null {
  const match = value.match(/^\/avatars\/(users|admin)\/([A-Za-z0-9_-]+)\.(?:webp|png|jpe?g)$/i);
  if (!match) return null;
  return { scope: match[1] as "users" | "admin", id: match[2] };
}

function normalizeAvatarValue(value?: string | null): { scope: "users" | "admin"; id: string } | null {
  if (!value) return null;
  return parseAvatarId(value) ?? parseLegacyPath(value);
}

export async function listAvatars(scope: "users" | "admin" | "all" = "users"): Promise<AvatarEntry[]> {
  const manifest = await loadManifest();
  if (scope === "admin") return manifest.admin;
  if (scope === "all") return [...manifest.users, ...manifest.admin];
  return manifest.users;
}

export async function getDefaultAvatarUrl(): Promise<string | null> {
  const manifest = await loadManifest();
  const explicit = manifest.users.find((a) => a.id === "default");
  return explicit?.url ?? manifest.users[0]?.url ?? null;
}

export async function isValidAvatarId(value: string, allowAdmin: boolean): Promise<boolean> {
  const parsed = parseAvatarId(value);
  if (!parsed) return false;
  if (parsed.scope === "admin" && !allowAdmin) return false;

  const manifest = await loadManifest();
  const map = parsed.scope === "admin" ? manifest.adminById : manifest.usersById;
  return Boolean(map[parsed.id]);
}

export async function resolveAvatarUrl(stored?: string | null): Promise<string | null> {
  const parsed = normalizeAvatarValue(stored);
  if (parsed) {
    const manifest = await loadManifest();
    const map = parsed.scope === "admin" ? manifest.adminById : manifest.usersById;
    const url = map[parsed.id];
    if (url) return url;
  }
  return getDefaultAvatarUrl();
}