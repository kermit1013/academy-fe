import React from "react";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <Topbar />
    <Sidebar />
    <main>
      <div className="contentPage  overflow-y-scroll bg-[url('../public/bg_dashboard_grid.svg')] bg-cover bg-repeat p-11 ">
        {children}
      </div>
    </main>
  </div>
);

export default MainLayout;
