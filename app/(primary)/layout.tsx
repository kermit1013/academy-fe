"use client";
import React from "react";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="relative">
      <Topbar />
      <Sidebar />
      <main>
        <div
          className={`contentPage ${
            pathname === "/" ? "left-20 w-[calc(100vw-80px)]" : "w-full"
          } overflow-y-scroll bg-[url('../public/bg_dashboard_grid.svg')] bg-cover bg-repeat p-6`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
