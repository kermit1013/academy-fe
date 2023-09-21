import React from "react";
import "@/styles/globals.css";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ReactQueryProvider>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </ReactQueryProvider>
    </body>
  </html>
);

export default RootLayout;
