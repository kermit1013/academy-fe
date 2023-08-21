import React from "react";
import "@/styles/globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
    </body>
  </html>
);

export default RootLayout;
