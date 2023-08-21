import React from "react";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">
    <Topbar />
    <Sidebar />
    <main>{children}</main>
  </div>
);

export default MainLayout;
