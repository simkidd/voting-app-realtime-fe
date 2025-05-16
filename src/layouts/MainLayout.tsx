import Header from "@/components/shared/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full relative min-h-dvh">
      <Header />
      <main className="w-full max-w-2xl container mx-auto px-4 pt-8 relative">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
