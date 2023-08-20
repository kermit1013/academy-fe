import React from "react";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import "@/globals.css";
import Topbar from "@/components/layout/Topbar";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <StyledComponentsRegistry>
        <div className="relative">
          <Topbar />
          <Sidebar />
          <main>{children}</main>
        </div>
      </StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
