import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { cookies } from "next/headers";
import DesktopNavLinks from "./DesktopNavLinks";
import HeaderSearch from "./HeaderSearch";
import HeaderCart from "./HeaderCart";
import HeaderMenuSwitcherAsync from "./HeaderMenuSwitcherAsync";
import RegionSwitcherAsync from "./RegionSwitcherAsync";
import UserActionsAsync from "./UserActionsAsync";
import UserActionsSkeleton from "./UserActionsSkeleton";
import GamesNavSkeleton from "./GamesNavSkeleton";
import MobileMenuAsync from "./MobileMenuAsync";
import MobileBottomNavAsync from "./MobileBottomNavAsync";
import MobileBottomNav from "./MobileBottomNav";
import Skeleton from "@/components/ui/Skeleton";
import { Download, HelpCircle } from "lucide-react";

const ACTION_BUTTON_CLASSES =
  "flex items-center gap-2.5 px-3 py-4 cursor-pointer text-brand-m_khonsa text-[14px] font-semibold transition-colors duration-150 hover:bg-brand-surface hover:text-white";
const ICON_WRAPPER_CLASSES =
  "flex items-center justify-center rounded-full w-5 h-5 text-brand-surface_m shrink-0";

export default async function Header() {
  const cookieStore = await cookies();
  const activeRegion = cookieStore.get("store_region")?.value || "eu";

  return (
    <>
      <header className="w-full sticky top-0 lg:top-[-60px] z-[10000] bg-[#15171e]" dir="rtl">
        <div className="hidden lg:flex w-full justify-between items-center h-[60px] px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center h-full gap-8">
            <Link href={`/${activeRegion}`} className="flex items-center shrink-0" aria-label="صفحه اصلی">
              <Image
                src="/images/arena2battleLogo.webp"
                alt="Arena2Battle"
                width={100}
                height={40}
                className="h-10 w-auto object-contain"
                priority
                style={{ width: "auto" }}
              />
            </Link>
            <DesktopNavLinks activeRegion={activeRegion} />
          </div>

          <div className="flex items-center">
            <Link href={`/${activeRegion}/download`} prefetch={false} className={ACTION_BUTTON_CLASSES}>
              <span className={ICON_WRAPPER_CLASSES}>
                <Download size={18} strokeWidth={2.5} />
              </span>
              <span>دانلود بازی</span>
            </Link>

            <Link href={`/${activeRegion}/support`} prefetch={false} className={ACTION_BUTTON_CLASSES}>
              <span className={ICON_WRAPPER_CLASSES}>
                <HelpCircle size={18} strokeWidth={2.5} />
              </span>
              <span>پشتیبانی</span>
            </Link>

            <Suspense fallback={<UserActionsSkeleton />}>
              <UserActionsAsync />
            </Suspense>
          </div>
        </div>

        <div className="hidden lg:flex w-full justify-center bg-brand-bg">
          <div className="flex w-full container mx-auto px-6 max-w-[1600px] py-[10px] gap-[8px] h-[80px]">
            <div className="flex items-center justify-between flex-1 bg-brand-surface h-full pl-2 rounded-[5px]">
              <HeaderCart />
              <Suspense fallback={<GamesNavSkeleton />}>
                <HeaderMenuSwitcherAsync />
              </Suspense>
            </div>

            <HeaderSearch />

            <div className="flex items-center justify-center h-full">
              <Suspense fallback={<Skeleton className="w-[140px] h-[60px] rounded-[4px]" />}>
                <RegionSwitcherAsync initialRegion={activeRegion} />
              </Suspense>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between h-[60px] px-4 bg-brand-bg border-b border-white/5">
          <MobileMenuAsync activeRegion={activeRegion} />
        </div>
      </header>

      <Suspense fallback={<MobileBottomNav user={null} />}>
        <MobileBottomNavAsync />
      </Suspense>
    </>
  );
}