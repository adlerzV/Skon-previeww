import Header from "@/components/Header/Header";
import SubHeaderBar from "@/components/Header/SubHeaderBar";
import Footer from "@/components/Footer/Footer";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import CommerceProviders from "@/components/providers/CommerceProviders";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommerceProviders>
      <Header />
      <SubHeaderBar />
      <div className="pb-[calc(58px+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
        <Footer />
      </div>
      <ScrollToTopButton />
    </CommerceProviders>
  );
}
