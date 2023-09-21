import React from "react";
import "@/styles/globals.css";

import { AntdRegistryProvider, ReactQueryProvider } from "@/components/provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ReactQueryProvider>
        <AntdRegistryProvider>{children}</AntdRegistryProvider>
      </ReactQueryProvider>
    </body>
  </html>
);

export default RootLayout;
